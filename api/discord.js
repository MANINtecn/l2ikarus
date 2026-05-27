export default async function handler(request, response) {
  const token = process.env.DISCORD_BOT_TOKEN;
  const adminUsername = process.env.DISCORD_ADMIN_USERNAME || 'ManinZk'; // parte do username do admin
  const guildId = "1254439382300098630";

  if (!token) {
    return response.status(500).json({ error: "ERRO: DISCORD_BOT_TOKEN não configurado na Vercel." });
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
      headers: { Authorization: `Bot ${token}` }
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const data = await res.json();

    const widgetRes = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`);
    const widgetData = await widgetRes.json();

    // Widget retorna IDs aleatórios (não reais) — comparamos pelo username
    const members = widgetData.members || [];
    let adminOnline = false;
    let adminStatus = 'offline';

    const adminMember = members.find(m =>
      m.username?.toLowerCase().includes(adminUsername.toLowerCase())
    );
    if (adminMember) {
      adminOnline = true;
      adminStatus = adminMember.status || 'online';
    }

    response.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    response.status(200).json({
      name: data.name,
      presence_count: data.approximate_presence_count || widgetData.presence_count || 0,
      member_count: data.approximate_member_count || 0,
      members,
      instant_invite: widgetData.instant_invite,
      adminOnline,
      adminStatus,
    });
  } catch (error) {
    console.error('Discord API Error:', error);
    response.status(500).json({ error: error.message });
  }
}
