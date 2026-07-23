const VPS_STATUS_URL = process.env.VPS_STATUS_URL;   // ex: http://192.99.110.164:8080/status
const VPS_API_KEY   = process.env.VPS_STATUS_TOKEN;  // mesmo valor de STATUS_API_KEY no VPS

export default async function handler(_req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (!VPS_STATUS_URL || !VPS_API_KEY) {
    return res.status(200).json({ online: false, players: 0, accounts: 0,
      status_login: 'OFFLINE', status_game: 'OFFLINE' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    // IKARUS 2026-07-23: consulta o status AGREGADO (/status/all) = soma o online de
    // TODOS os servidores da rede que estiverem no ar. O launcher le "players" e passa
    // a mostrar o total. VPS_STATUS_URL termina em /status -> vira /status/all.
    const allUrl = VPS_STATUS_URL.replace(/\/status(\/all)?$/, '/status/all');

    const response = await fetch(allUrl, {
      headers: { 'x-api-key': VPS_API_KEY },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error('VPS returned non-200');

    const data = await response.json();

    return res.status(200).json({
      online: data.online ?? false,
      players: data.players ?? 0,
      accounts: data.accounts ?? 0,
      servers: data.servers ?? [],
      status_login: data.online ? 'ONLINE' : 'OFFLINE',
      status_game:  data.online ? 'ONLINE' : 'OFFLINE',
    });
  } catch {
    return res.status(200).json({
      online: false, players: 0, accounts: 0,
      status_login: 'OFFLINE', status_game: 'OFFLINE',
    });
  }
}