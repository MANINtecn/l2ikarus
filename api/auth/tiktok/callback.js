export default async function handler(req, res) {
    const { code, state } = req.query;
    const NGROK_URL = "https://liquefy-maturity-tapering.ngrok-free.dev";
    
    if (!code) return res.status(400).send("Código de autorização não recebido.");

    // Redireciona o código recebido do TikTok para o robô local
    console.log("[BRIDGE] Redirecionando código para o Ngrok local...");
    res.redirect(`${NGROK_URL}/api/auth/tiktok/callback?code=${code}&state=${state}`);
}
