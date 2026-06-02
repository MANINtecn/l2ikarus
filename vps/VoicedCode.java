package net.sf.l2j.gameserver.handler.voicedcommandhandlers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.StringTokenizer;
import java.util.logging.Logger;

import net.sf.l2j.L2DatabaseFactory;
import net.sf.l2j.gameserver.handler.IVoicedCommandHandler;
import net.sf.l2j.gameserver.model.actor.instance.L2PcInstance;

/**
 * Sistema de Códigos Promocionais / Referral - L2 Ikarus
 * Uso no jogo: .code SEUCODIGO
 *
 * Tabelas necessárias (rodar promo_codes.sql no banco):
 *   - promo_codes (code, items, active, max_uses, uses)
 *   - promo_redeemed (code, account_name, redeemed_at)
 *
 * Formato da coluna items: "itemId:count;itemId:count"
 *   Ex: "57:1000000;3470:5;9628:1"
 */
public class VoicedCode implements IVoicedCommandHandler
{
	private static final Logger _log = Logger.getLogger(VoicedCode.class.getName());

	private static final String[] VOICED_COMMANDS =
	{
		"code"
	};

	@Override
	public boolean useVoicedCommand(String command, L2PcInstance activeChar, String params)
	{
		if (activeChar == null)
			return false;

		StringTokenizer st = new StringTokenizer(command, " ");
		st.nextToken(); // "code"

		if (!st.hasMoreTokens())
		{
			activeChar.sendMessage("Uso: .code SEUCODIGO");
			return false;
		}

		String code = st.nextToken().trim();
		String account = activeChar.getAccountName();

		try (Connection con = L2DatabaseFactory.getInstance().getConnection())
		{
			// 1. Busca o código
			String itemsStr = null;
			int active = 0, maxUses = 0, uses = 0;

			try (PreparedStatement ps = con.prepareStatement(
				"SELECT items, active, max_uses, uses FROM promo_codes WHERE code = ?"))
			{
				ps.setString(1, code);
				try (ResultSet rs = ps.executeQuery())
				{
					if (!rs.next())
					{
						activeChar.sendMessage("Codigo invalido.");
						return false;
					}
					itemsStr = rs.getString("items");
					active = rs.getInt("active");
					maxUses = rs.getInt("max_uses");
					uses = rs.getInt("uses");
				}
			}

			if (active != 1)
			{
				activeChar.sendMessage("Este codigo nao esta ativo.");
				return false;
			}

			if (maxUses > 0 && uses >= maxUses)
			{
				activeChar.sendMessage("Este codigo atingiu o limite de usos.");
				return false;
			}

			// 2. Verifica se a conta ja resgatou
			try (PreparedStatement ps = con.prepareStatement(
				"SELECT 1 FROM promo_redeemed WHERE code = ? AND account_name = ?"))
			{
				ps.setString(1, code);
				ps.setString(2, account);
				try (ResultSet rs = ps.executeQuery())
				{
					if (rs.next())
					{
						activeChar.sendMessage("Voce ja resgatou este codigo.");
						return false;
					}
				}
			}

			// 3. Entrega os itens
			if (itemsStr == null || itemsStr.isEmpty())
			{
				activeChar.sendMessage("Codigo sem itens configurados.");
				return false;
			}

			for (String pair : itemsStr.split(";"))
			{
				if (pair.trim().isEmpty())
					continue;
				String[] parts = pair.split(":");
				int itemId = Integer.parseInt(parts[0].trim());
				int count = Integer.parseInt(parts[1].trim());
				activeChar.getInventory().addItem("PromoCode", itemId, count, activeChar, activeChar);
			}

			// 4. Registra o resgate e incrementa uso
			try (PreparedStatement ps = con.prepareStatement(
				"INSERT INTO promo_redeemed (code, account_name, redeemed_at) VALUES (?, ?, ?)"))
			{
				ps.setString(1, code);
				ps.setString(2, account);
				ps.setLong(3, System.currentTimeMillis() / 1000L);
				ps.executeUpdate();
			}

			try (PreparedStatement ps = con.prepareStatement(
				"UPDATE promo_codes SET uses = uses + 1 WHERE code = ?"))
			{
				ps.setString(1, code);
				ps.executeUpdate();
			}

			activeChar.sendMessage("Codigo resgatado com sucesso! Itens entregues.");
			return true;
		}
		catch (Exception e)
		{
			_log.warning("VoicedCode error: " + e.getMessage());
			activeChar.sendMessage("Erro ao processar o codigo. Tente novamente.");
			return false;
		}
	}

	@Override
	public String[] getVoicedCommandList()
	{
		return VOICED_COMMANDS;
	}
}
