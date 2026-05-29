export default async function handler(req, res) {
  const { code, error } = req.query
  if (error) return res.redirect('/?reg_error=google_denied')

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI_REG || 'https://l2ikarus.com/api/register/callback'

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
    })
    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) return res.redirect('/?reg_error=token_failed')

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const gUser = await userRes.json()

    // Só passa o email e nome de volta — jogador escolhe login e senha
    const data = Buffer.from(JSON.stringify({ email: gUser.email, name: gUser.given_name || gUser.name })).toString('base64url')
    res.redirect(`/?google_data=${data}`)
  } catch (err) {
    console.error('Google register error:', err)
    res.redirect('/?reg_error=server_error')
  }
}
