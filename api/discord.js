export default async function handler(request, response) {
  const token = process.env.DISCORD_BOT_TOKEN;
  const adminId = process.env.DISCORD_ADMIN_ID; // ID do Discord do admin (IKARUS)
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

    // Verifica se o admin está online via widget (aparece apenas se estiver online)
    const members = widgetData.members || [];
    let adminOnline = false;
    let adminStatus = 'offline';

    if (adminId) {
      const adminMember = members.find(m => m.id === adminId);
      if (adminMember) {
        adminOnline = true;
        adminStatus = adminMember.status || 'online';
      }
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
