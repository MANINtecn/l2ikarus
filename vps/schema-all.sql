-- ============================================================
-- L2 Ikarus - TODAS as tabelas custom do site/Ikoin no banco do game
-- Banco: l2jmobiusessence (mesmo do game server)
-- Use isto para RECUPERAR rapidamente apos perda de dados (ex: ataque).
-- Tudo IF NOT EXISTS: seguro rodar varias vezes, nao apaga dados.
-- ============================================================

-- ---- Ikoin (moeda digital) ----
CREATE TABLE IF NOT EXISTS `ikoin_balance` (
  `account_name` VARCHAR(45) NOT NULL,
  `balance` INT NOT NULL DEFAULT 0,
  `updated_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`account_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `ikoin_transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `account_name` VARCHAR(45) NOT NULL,
  `amount` INT NOT NULL,
  `type` VARCHAR(30) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `reference` VARCHAR(100) DEFAULT NULL,
  `created_at` BIGINT DEFAULT NULL,
  INDEX `idx_account` (`account_name`),
  INDEX `idx_reference` (`reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `ikoin_orders` (
  `id` VARCHAR(64) NOT NULL,
  `account_name` VARCHAR(45) NOT NULL,
  `amount` INT NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `mp_payment_id` VARCHAR(100) DEFAULT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `paid_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_mp` (`mp_payment_id`),
  INDEX `idx_acc` (`account_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- Codigos promocionais / referral ----
CREATE TABLE IF NOT EXISTS `promo_codes` (
  `code` VARCHAR(50) NOT NULL,
  `items` TEXT DEFAULT NULL,
  `ikoin` INT NOT NULL DEFAULT 0,
  `description` VARCHAR(255) DEFAULT NULL,
  `active` TINYINT NOT NULL DEFAULT 1,
  `max_uses` INT NOT NULL DEFAULT 0,
  `uses` INT NOT NULL DEFAULT 0,
  `created_by` VARCHAR(100) DEFAULT NULL,
  `created_at` INT DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `promo_ikoin_redeemed` (
  `code` VARCHAR(50) NOT NULL,
  `account_name` VARCHAR(45) NOT NULL,
  `redeemed_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`code`, `account_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `promo_redeemed` (
  `code` VARCHAR(50) NOT NULL,
  `account_name` VARCHAR(45) NOT NULL,
  `redeemed_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`code`, `account_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- Ofertas da loja in-game (Alt+B) ----
CREATE TABLE IF NOT EXISTS `game_offer` (
  `id` INT NOT NULL,
  `item_id` INT NOT NULL,
  `count` INT NOT NULL DEFAULT 1,
  `price_ikoin` INT NOT NULL DEFAULT 0,
  `title` VARCHAR(255) DEFAULT NULL,
  `icon` VARCHAR(255) DEFAULT NULL,
  `active` TINYINT NOT NULL DEFAULT 0,
  `updated_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- Afiliados/streamers (link /r/<slug>) ----
CREATE TABLE IF NOT EXISTS `streamers` (
  `slug` VARCHAR(45) NOT NULL,
  `name` VARCHAR(100) DEFAULT NULL,
  `commission_pct` INT NOT NULL DEFAULT 30,
  `active` TINYINT NOT NULL DEFAULT 1,
  `payout_info` VARCHAR(255) DEFAULT NULL,
  `created_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `account_referrals` (
  `account_name` VARCHAR(45) NOT NULL,
  `streamer_slug` VARCHAR(45) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`account_name`),
  INDEX `idx_streamer` (`streamer_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
