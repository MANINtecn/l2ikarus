export default async function handler(request, response) {
  // Usamos Variável de Ambiente por segurança (evita bloqueio do GitHub)
  const token = process.env.DISCORD_BOT_TOKEN;
  const guildId = "1492885957517770772";

  if (!token) {
    return response.status(500).json({ error: "ERRO: DISCORD_BOT_TOKEN não configurado na Vercel." });
  }

  try {
    // 1. Contagem REAL do Bot API
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
      headers: {
        Authorization: `Bot ${token}`
      }
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const data = await res.json();
    
    // 2. Lista visual via Widget
    const widgetRes = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`);
    const widgetData = await widgetRes.json();

    response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    response.status(200).json({
      name: data.name,
      presence_count: data.approximate_presence_count || widgetData.presence_count || 0,
      member_count: data.approximate_member_count || 0,
      members: widgetData.members || [],
      instant_invite: widgetData.instant_invite
    });
  } catch (error) {
    console.error('Discord API Error:', error);
    response.status(500).json({ error: error.message });
  }
}
