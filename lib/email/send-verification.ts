// Fungsi untuk mengirim email verifikasi ke user yang baru mendaftar
// Menggunakan Resend jika API key tersedia, atau log ke console di development

interface SendVerificationEmailParams {
  name: string
  email: string
  token: string
}

export async function sendVerificationEmail({
  name,
  email,
  token,
}: SendVerificationEmailParams): Promise<void> {
  const baseUrl = process.env.AUTH_URL ?? 'http://localhost:3000'
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`

  // Mode development: jika RESEND_API_KEY belum diisi, tampilkan link di console
  if (!process.env.RESEND_API_KEY) {
    console.log('\n' + '='.repeat(60))
    console.log('📧 EMAIL VERIFIKASI (development mode — Resend belum dikonfigurasi)')
    console.log(`Kepada  : ${name} <${email}>`)
    console.log(`Link    : ${verificationUrl}`)
    console.log('='.repeat(60) + '\n')
    return
  }

  // Mode production: kirim via Resend
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'Jalin <noreply@jalin.app>',
    to: email,
    subject: 'Verifikasi Email Akun Jalin',
    html: buildEmailHtml({ name, verificationUrl }),
  })
}

// Template HTML email verifikasi — sederhana dan mudah dibaca di semua klien email
function buildEmailHtml({
  name,
  verificationUrl,
}: {
  name: string
  verificationUrl: string
}): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#F5F0E4;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
          style="background:#FDFAF4;border:1px solid #C9BC9E;border-radius:8px;padding:40px;">
          <tr>
            <td>
              <h1 style="margin:0 0 8px;font-size:28px;color:#1A1A1A;">Jalin</h1>
              <p style="margin:0 0 32px;color:#6B6355;font-size:14px;">Jago Lingo</p>

              <p style="color:#1A1A1A;font-size:16px;">Halo, <strong>${name}</strong>!</p>
              <p style="color:#6B6355;font-size:15px;line-height:1.6;">
                Terima kasih sudah mendaftar di Jalin. Klik tombol di bawah untuk
                memverifikasi email kamu dan mulai latihan IELTS.
              </p>

              <div style="margin:32px 0;text-align:center;">
                <a href="${verificationUrl}"
                  style="display:inline-block;padding:14px 28px;background:#E04B3A;
                         color:#FDFAF4;text-decoration:none;border-radius:4px;
                         font-weight:600;font-size:15px;
                         box-shadow:3px 3px 0px #C73D2E;">
                  Verifikasi Email
                </a>
              </div>

              <p style="color:#6B6355;font-size:13px;">
                Link ini berlaku selama <strong>24 jam</strong>. Jika kamu tidak
                mendaftar di Jalin, abaikan email ini.
              </p>

              <hr style="border:none;border-top:1px solid #C9BC9E;margin:24px 0;">
              <p style="color:#6B6355;font-size:12px;margin:0;">
                Atau salin link ini ke browser:<br>
                <span style="color:#E04B3A;word-break:break-all;">${verificationUrl}</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
