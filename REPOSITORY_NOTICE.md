# ⚠️ IMPORTANT: Wrong Repository

## Current Situation
This PR (#6) was created in the `tuuli_web` repository, but the code that needs to be fixed is in the **`linda` repository**.

## The Issue
The Linda reminder cron job in `OndrejKulhavy/linda` repository sends all emails at once without rate limiting, causing Resend API to return 429 (rate_limit_exceeded) errors.

- **Location**: `OndrejKulhavy/linda` repository
- **Files**: 
  - `app/api/cron/linda-reminder/route.ts` (sends emails in loop)
  - `lib/resend.ts` (email sending function)

## The Solution
I've provided the fix in this repository as documentation:

1. **LINDA_RATE_LIMIT_FIX.md** - Detailed explanation of the problem and solution
2. **linda-fix/resend.ts** - Fixed version of the file with rate limiting
3. **linda-fix/README.md** - Instructions on how to apply the fix

## What Needs to Happen
The solution needs to be applied to the `linda` repository:

### Quick Fix (Copy File Method)
1. Clone the `OndrejKulhavy/linda` repository
2. Copy `linda-fix/resend.ts` to `lib/resend.ts` in the linda repo
3. Test the cron job to ensure no more 429 errors
4. Commit and deploy

### The Fix in Short
Add a 600ms delay after each email send to respect Resend's 2 requests/second rate limit:

```typescript
// In lib/resend.ts, add:
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Then in sendEmail function, after successful send:
await delay(600)
```

## Why This Happened
The Copilot agent was assigned to fix this issue in the `tuuli_web` repository, but the actual code exists in a separate `linda` repository. The solution has been documented here, but must be applied to the correct repository.

## Next Steps
1. Review the solution files in this PR
2. Apply the fix to the `linda` repository  
3. Test that the cron job works without rate limit errors
4. Close this PR as the issue is in a different repository

## Contact
If you have questions about the fix or need help applying it, please refer to the detailed documentation in the `linda-fix/` directory.
