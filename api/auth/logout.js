export default function handler(req, res) {
  res.setHeader('Set-Cookie', 'admin_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0')
  res.redirect('/')
}
