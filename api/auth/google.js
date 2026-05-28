export default function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://l2ikarus.com/api/auth/callback'

  if (!clientId) {
    return res.status(500).json({ error: 'GOOGLE_CLIENT_ID não configurado' })
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'online',
    prompt: 'select_account',
  })

  res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}
