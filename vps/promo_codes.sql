-- Sistema de Códigos Promocionais / Referral - L2 Ikarus
-- Rodar no banco do servidor (mesmo banco do game/site)

CREATE TABLE IF NOT EXISTS `promo_codes` (
  `code` VARCHAR(50) NOT NULL,
  `items` TEXT DEFAULT NULL,          -- formato: "itemId:count;itemId:count" (resgate no game)
  `ikoin` INT NOT NULL DEFAULT 0,     -- Ikoin de bônus (resgate no site)
  `description` VARCHAR(255) DEFAULT NULL,
  `active` TINYINT NOT NULL DEFAULT 1,
  `max_uses` INT NOT NULL DEFAULT 0,  -- 0 = ilimitado
  `uses` INT NOT NULL DEFAULT 0,
  `created_by` VARCHAR(100) DEFAULT NULL,
  `created_at` INT DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Se a tabela já existe, rode também:
-- ALTER TABLE `promo_codes` ADD COLUMN `ikoin` INT NOT NULL DEFAULT 0;
-- ALTER TABLE `promo_codes` MODIFY `items` TEXT DEFAULT NULL;

-- Resgates de Ikoin pelo site (separado dos itens do game)
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
