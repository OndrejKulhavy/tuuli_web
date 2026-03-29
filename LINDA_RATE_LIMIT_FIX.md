# Linda Reminder Rate Limit Fix

## Problem
The Linda reminder cron job sends all emails at once, which causes a rate limit error from Resend:

```
Failed to send email: {
  statusCode: 429,
  name: 'rate_limit_exceeded',
  message: 'Too many requests. You can only make 2 requests per second...'
}
```

Resend allows **2 requests per second** (500ms minimum between requests).

## Root Cause
In `app/api/cron/linda-reminder/route.ts`, emails are sent in a loop without any delay:

```typescript
for (const user of users) {
  // ...
  if (totalHours < hoursThreshold) {
    const emailResult = await sendEmail({ ... }) // Sent immediately
  }
}
```

## Solution
Add a delay function and implement rate limiting between email sends.

### Step 1: Add a delay utility function

In `lib/resend.ts`, add a `delay` function:

```typescript
// Add this helper function at the top
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### Step 2: Modify the `sendEmail` function to include delay

Update `lib/resend.ts` to add automatic rate limiting:

```typescript
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Linda z Tuuli <linda@tuuli.cz>",
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Failed to send email:", error)
      return { success: false, error }
    }

    // Add delay to respect rate limits (2 requests/sec = 500ms between requests)
    // Using 600ms to be safe
    await delay(600)

    return { success: true, data }
  } catch (error) {
    console.error("Email sending error:", error)
    return { success: false, error }
  }
}
```

### Alternative: Rate limit in the cron job

If you prefer to keep the delay logic in the cron job itself, modify `app/api/cron/linda-reminder/route.ts`:

```typescript
// Add delay function at the top of the file
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Then in the loop:
for (const user of users) {
  if (!user.email) continue
  
  // ... existing code ...

  if (totalHours < hoursThreshold) {
    const firstName = getFirstName(user.name)
    const html = getRandomLindaMessage({ name: firstName, hours: totalHours, expectedHours })
    const subject = getEmailSubject()

    const emailResult = await sendEmail({
      to: user.email,
      subject,
      html,
    })

    // Add delay after each email (600ms = safe for 2 req/sec limit)
    if (emailResult.success) {
      await delay(600)
    }

    results.push({
      user: user.name,
      email: user.email,
      hours: Math.round(totalHours * 10) / 10,
      expectedHours,
      threshold: Math.round(hoursThreshold * 10) / 10,
      emailSent: emailResult.success,
    })
  } else {
    // ... existing code ...
  }
}
```

## Recommendation
**Implement the fix in `lib/resend.ts`** (Step 2 above) because:
1. It centralizes rate limiting logic
2. Any future code using `sendEmail` will automatically be rate-limited
3. Cleaner and more maintainable

## Testing
After applying the fix:
1. Trigger the cron job manually or wait for the scheduled run
2. Verify that emails are sent successfully without 429 errors
3. Check that the total time increases proportionally with the number of emails (600ms per email)

## Files to Modify
- **Repository**: `OndrejKulhavy/linda` (NOT tuuli_web)
- **File**: `lib/resend.ts`

Note: This fix needs to be applied to the `linda` repository, not `tuuli_web`.
