-- Sistema de Códigos Promocionais / Referral - L2 Ikarus
-- Rodar no banco do servidor (mesmo banco do game/site)

CREATE TABLE IF NOT EXISTS `promo_codes` (
  `code` VARCHAR(50) NOT NULL,
  `items` TEXT NOT NULL,              -- formato: "itemId:count;itemId:count"
  `description` VARCHAR(255) DEFAULT NULL,
  `active` TINYINT NOT NULL DEFAULT 1,
  `max_uses` INT NOT NULL DEFAULT 0,  -- 0 = ilimitado
  `uses` INT NOT NULL DEFAULT 0,
  `created_by` VARCHAR(100) DEFAULT NULL,
  `created_at` INT DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `promo_redeemed` (
  `code` VARCHAR(50) NOT NULL,
  `account_name` VARCHAR(45) NOT NULL,
  `redeemed_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`code`, `account_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
