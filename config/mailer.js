import nodemailer from 'nodemailer'

const smtpConfigured = Boolean(
  process.env.SMTP_HOST
  && process.env.SMTP_USER
  && process.env.SMTP_PASSWORD,
)

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    })
  : null

export async function sendQuotationConfirmation(quotation) {
  if (!transporter) {
    return false
  }

  const from = process.env.MAIL_FROM || `Whitespace <${process.env.SMTP_USER}>`
  const deliverables = quotation.selectedDeliverables
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('')

  await Promise.race([
    transporter.sendMail({
    from,
    to: quotation.email,
    subject: 'Your Whitespace request is under process',
    text: `Hi ${quotation.fullName},\n\nThank you for opting for Whitespace. Your request for a personal workspace is now under process.\n\nService: ${quotation.serviceType}\nCompany: ${quotation.company}\nTeam size: ${quotation.teamSize}\n\nSelected deliverables:\n${quotation.selectedDeliverables.map((item) => `- ${item}`).join('\n')}\n\nOur onboarding team will review your request and contact you with the next steps.\n\nWarm regards,\nThe Whitespace Team`,
    html: `
      <div style="margin:0;background:#f5f8fc;padding:40px 20px;font-family:Arial,sans-serif;color:#0d1f3a">
        <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #dfe7f2;border-radius:18px;overflow:hidden">
          <div style="background:#1769ff;padding:28px 32px;color:#fff">
            <div style="font-size:22px;font-weight:700;letter-spacing:-.04em">whitespace</div>
            <div style="margin-top:8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.85">Request received</div>
          </div>
          <div style="padding:32px">
            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.15">Your workspace request is under process.</h1>
            <p style="font-size:16px;line-height:1.6;color:#52647b">Hi ${escapeHtml(quotation.fullName)}, thank you for opting for Whitespace. We have received your request for a personal workspace and our onboarding team is reviewing it now.</p>
            <div style="margin:24px 0;padding:18px;border-radius:12px;background:#f5f9ff;border:1px solid #dbe8f7;font-size:14px;line-height:1.8">
              <strong>Service:</strong> ${escapeHtml(quotation.serviceType)}<br />
              <strong>Company:</strong> ${escapeHtml(quotation.company)}<br />
              <strong>Team size:</strong> ${escapeHtml(quotation.teamSize)}
            </div>
            <p style="margin:0 0 8px;font-weight:700">Selected deliverables</p>
            <ul style="margin:0;padding-left:20px;color:#52647b;line-height:1.8">${deliverables}</ul>
            <p style="margin-top:24px;color:#52647b;line-height:1.6">We will contact you with the next steps once your request has been reviewed.</p>
            <p style="margin:28px 0 0;color:#52647b">Warm regards,<br /><strong style="color:#0d1f3a">The Whitespace Team</strong></p>
          </div>
        </div>
      </div>
    `,
    }),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email delivery timed out.')), 10000)
    }),
  ])

  return true
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
