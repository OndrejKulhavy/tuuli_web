# Quick Start Guide

## What's This PR About?
This PR provides a **complete solution** for fixing the rate limit issue in the Linda reminder cron job. The fix prevents 429 errors from Resend API when sending multiple reminder emails.

## ⚠️ Critical Info
The code to fix is **NOT in this repository**. It's in `OndrejKulhavy/linda`.

## Files You Need

### Start Here
- **SUMMARY.md** ← Read this first for a complete overview

### Technical Details  
- **LINDA_RATE_LIMIT_FIX.md** ← In-depth explanation of the problem and solution

### Apply the Fix
- **linda-fix/resend.ts** ← Copy this to `linda/lib/resend.ts`
- **linda-fix/README.md** ← Step-by-step instructions

### Context
- **REPOSITORY_NOTICE.md** ← Explains why this PR is in the wrong repo

## TL;DR - How to Fix It

### The Absolute Fastest Way
```bash
# 1. Clone or navigate to the linda repository
cd /path/to/linda

# 2. Copy the fixed file
# Get resend.ts from this PR's linda-fix folder
cp /path/to/tuuli_web/linda-fix/resend.ts lib/resend.ts

# 3. Commit and deploy
git add lib/resend.ts
git commit -m "Fix: Add rate limiting to email sends (600ms delay)"
git push

# 4. Test the cron job
# Trigger it manually or wait for the next scheduled run
```

### What Changed?
We added this to `lib/resend.ts`:
```typescript
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// And inside sendEmail(), after successful send:
await delay(600)
```

That's it! This adds a 600ms wait between each email to respect Resend's 2 req/sec limit.

## Why 600ms?
- Resend limit: 2 requests/second = 500ms minimum
- 600ms = 500ms + 20% safety margin
- Prevents rate limit errors completely

## Will This Slow Things Down?
A little, but it's fine:
- Sending 10 reminders: ~6 seconds (was instant)
- This is a background cron job, so no user impact
- Better than failing with 429 errors!

## Questions?
1. Read **SUMMARY.md** for full details
2. Check **linda-fix/README.md** for step-by-step guide
3. See **LINDA_RATE_LIMIT_FIX.md** for technical deep-dive

## Checklist
- [ ] Read SUMMARY.md
- [ ] Copy linda-fix/resend.ts to linda/lib/resend.ts  
- [ ] Test the cron job
- [ ] Verify no 429 errors in logs
- [ ] Deploy to production
- [ ] Close this PR (it's just documentation)

## Need Help?
All the details are in the other markdown files. Start with SUMMARY.md!
