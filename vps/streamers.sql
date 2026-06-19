-- Sistema de afiliados/streamers - L2 Ikarus
-- Link /r/<slug> -> first-touch -> comissao % sobre Ikoin comprado pelos indicados.
-- Rodar no mesmo banco do game/site (l2jmobiusessence).

-- Cadastro de streamers (gerenciado no admin)
CREATE TABLE IF NOT EXISTS `streamers` (
  `slug` VARCHAR(45) NOT NULL,            -- nick do link: l2ikarus.com/r/<slug>
  `name` VARCHAR(100) DEFAULT NULL,       -- nome de exibicao
  `commission_pct` INT NOT NULL DEFAULT 30,
  `active` TINYINT NOT NULL DEFAULT 1,
  `payout_info` VARCHAR(255) DEFAULT NULL, -- pix/dados de pagamento (livre)
  `created_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Atribuicao conta -> streamer (1 conta = 1 streamer, first-touch via INSERT IGNORE)
CREATE TABLE IF NOT EXISTS `account_referrals` (
  `account_name` VARCHAR(45) NOT NULL,
  `streamer_slug` VARCHAR(45) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`account_name`),
  INDEX `idx_streamer` (`streamer_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
