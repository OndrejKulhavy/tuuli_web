import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not configured")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Helper function to add delay between requests
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
    await delay(600)

    return { success: true, data }
  } catch (error) {
    console.error("Email sending error:", error)
    return { success: false, error }
  }
}
