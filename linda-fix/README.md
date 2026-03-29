# How to Apply the Linda Rate Limit Fix

## Quick Summary
The Linda reminder cron job hits Resend's rate limit (2 requests/second) when sending multiple emails at once. This fix adds a 600ms delay between email sends to stay within the rate limit.

## Files Provided
- `resend.ts` - Fixed version of `lib/resend.ts` with rate limiting

## Instructions

### Option 1: Copy the Fixed File (Easiest)
1. Navigate to the `linda` repository
2. Copy `resend.ts` from this directory to `lib/resend.ts` in the linda repository
3. Commit and push the changes

### Option 2: Manual Changes
If you prefer to manually update the file:

1. Open `lib/resend.ts` in the linda repository
2. Add the delay helper function after the import statements:

```typescript
// Helper function to add delay between requests
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

3. Add the delay call in the `sendEmail` function, right after the successful email send:

```typescript
export async function sendEmail({ to, subject, html }: { ... }) {
  try {
    const { data, error } = await resend.emails.send({ ... })

    if (error) {
      console.error("Failed to send email:", error)
      return { success: false, error }
    }

    // ADD THIS LINE:
    await delay(600)

    return { success: true, data }
  } catch (error) {
    // ... existing error handling ...
  }
}
```

## Why 600ms?
- Resend allows 2 requests per second = minimum 500ms between requests
- We use 600ms to add a safety margin and account for network latency
- This prevents rate limit errors while keeping the delay minimal

## Testing
After applying the fix:
1. Trigger the cron job (manually or wait for scheduled run)
2. Monitor logs to ensure no 429 errors occur
3. Verify all emails are sent successfully

## Impact
- If 10 users need reminders, the job will take ~6 seconds instead of being instant
- This is acceptable for a background cron job
- Prevents all future rate limit errors

## Repository
**IMPORTANT**: Apply this fix to the `OndrejKulhavy/linda` repository, NOT `tuuli_web`.
