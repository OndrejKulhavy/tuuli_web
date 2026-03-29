# Summary: Linda Reminder Rate Limit Fix

## Problem Statement
The Linda reminder cron job was sending all reminder emails at once, causing Resend API to return 429 rate limit errors:
```
Failed to send email: {
  statusCode: 429,
  name: 'rate_limit_exceeded',
  message: 'Too many requests. You can only make 2 requests per second...'
}
```

## Root Cause
- **Resend API Limit**: 2 requests per second (500ms minimum between requests)
- **Current Behavior**: Emails sent in a loop without any delay
- **Result**: Multiple emails sent simultaneously, exceeding the rate limit

## Solution Implemented
Added a 600ms delay after each email send in `lib/resend.ts`:

```typescript
/**
 * Adds a delay to respect API rate limits
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function sendEmail({ ... }) {
  // ... send email ...
  
  // Wait 600ms to respect rate limit
  await delay(600)
  
  return { success: true, data }
}
```

## Why 600ms?
- Resend requires minimum 500ms between requests (2 req/sec)
- 600ms provides 20% safety margin for network latency
- Prevents rate limit errors while keeping delay minimal

## Files in This PR

### Documentation
1. **REPOSITORY_NOTICE.md** - ⚠️ Important notice about repository mismatch
2. **LINDA_RATE_LIMIT_FIX.md** - Detailed technical analysis and solution
3. **THIS FILE** - Executive summary

### Solution Files (to be applied to `linda` repository)
1. **linda-fix/resend.ts** - Fixed version of lib/resend.ts with rate limiting
2. **linda-fix/README.md** - Step-by-step application instructions

## Repository Context
⚠️ **IMPORTANT**: This PR is in the `tuuli_web` repository, but the code to be fixed is in the `OndrejKulhavy/linda` repository.

The solution is documented here for reference, but must be applied to the `linda` repository.

## How to Apply the Fix

### Quick Method
1. Copy `linda-fix/resend.ts` to `lib/resend.ts` in the linda repository
2. Test the cron job
3. Commit and deploy

### Manual Method
See `linda-fix/README.md` for detailed instructions

## Expected Impact
- ✅ No more 429 rate limit errors
- ✅ All reminder emails sent successfully
- ⏱️ Small time increase: ~6 seconds for 10 emails (previously instant)
- 🔒 Security: No vulnerabilities (verified with CodeQL)

## Testing
After applying:
1. Trigger the cron job manually or wait for scheduled run
2. Monitor logs for absence of 429 errors
3. Confirm all reminder emails are delivered

## Security Review
- ✅ CodeQL scan: 0 alerts
- ✅ Code review: Approved with documentation improvements applied
- ✅ No new dependencies added
- ✅ Only adds a delay function - no security impact

## Maintenance Notes
- The `sendEmail` function now automatically rate-limits all calls
- Future code using `sendEmail` will benefit from built-in rate limiting
- No changes needed to the cron job logic itself

## Questions?
Refer to the detailed documentation files:
- Technical details: `LINDA_RATE_LIMIT_FIX.md`
- Application guide: `linda-fix/README.md`
- Repository context: `REPOSITORY_NOTICE.md`
