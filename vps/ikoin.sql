-- Sistema de moeda digital Ikoin (IK) - L2 Ikarus
-- 1 Ikoin = R$ 1,00. Usável no site e no game.
-- Rodar no mesmo banco do game/site.

-- Saldo por conta
CREATE TABLE IF NOT EXISTS `ikoin_balance` (
  `account_name` VARCHAR(45) NOT NULL,
  `balance` INT NOT NULL DEFAULT 0,
  `updated_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`account_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Histórico de transações (compra, gasto, ajuste admin)
CREATE TABLE IF NOT EXISTS `ikoin_transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `account_name` VARCHAR(45) NOT NULL,
  `amount` INT NOT NULL,                 -- positivo = crédito, negativo = débito
  `type` VARCHAR(30) NOT NULL,           -- 'purchase', 'spend', 'admin', 'refund'
  `description` VARCHAR(255) DEFAULT NULL,
  `reference` VARCHAR(100) DEFAULT NULL, -- id do pagamento / referência externa
  `created_at` BIGINT DEFAULT NULL,
  INDEX `idx_account` (`account_name`),
  INDEX `idx_reference` (`reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Pedidos de pagamento (Mercado Pago)
CREATE TABLE IF NOT EXISTS `ikoin_orders` (
  `id` VARCHAR(64) NOT NULL,             -- nosso id interno (uuid)
  `account_name` VARCHAR(45) NOT NULL,
  `amount` INT NOT NULL,                 -- quantidade de Ikoin = valor em R$
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, paid, cancelled
  `mp_payment_id` VARCHAR(100) DEFAULT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `paid_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_mp` (`mp_payment_id`),
  INDEX `idx_acc` (`account_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
