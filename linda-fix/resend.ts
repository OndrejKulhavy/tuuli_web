import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not configured")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Adds a delay to respect API rate limits
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the specified delay
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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

    // Add delay to respect Resend rate limits (2 requests/sec = 500ms minimum)
    // Using 600ms to be safe and account for any network latency
    // Note: Delay is applied after every send (including the last) to ensure
    // any subsequent email operations also respect the rate limit
    await delay(600)

    return { success: true, data }
  } catch (error) {
    console.error("Email sending error:", error)
    return { success: false, error }
  }
}
