-- ============================================================================
-- PROGRAMA DE INDICAÇÃO IKARUS — evolução do sistema de streamers (17/08/2026)
-- Rodar no banco do site/game: l2jmobiusessence
-- ============================================================================
--
-- O QUE MUDA em relação ao que já existe:
--   1. As tabelas `streamers` e `account_referrals` CONTINUAM (não recriar).
--      Só ganham colunas para auto-cadastro e aprovação.
--   2. Nasce a `referral_commissions`: uma linha por compra indicada, com data de
--      liberação. É ela que permite dizer "R$ 742 disponível / R$ 100 em validação".
--   3. Nasce a `referral_payouts`: histórico de saques solicitados.
--
-- POR QUE UMA TABELA DE COMISSÃO POR COMPRA (e não só um SUM na hora de exibir):
--   - o valor precisa "amadurecer" 30 dias antes de virar sacável;
--   - se a compra for estornada DEPOIS, é preciso saber qual comissão reverter;
--   - o afiliado precisa ver o histórico linha a linha (data, jogador, compra, comissão);
--   - o percentual pode mudar com o tempo — a comissão fica congelada no valor da época.
--   Nada disso é possível recalculando por SUM a cada exibição.

-- ---------------------------------------------------------------- 1. streamers
-- Auto-cadastro com aprovação manual: a linha nasce com status='pending'.
ALTER TABLE `streamers`
  ADD COLUMN `account_name` VARCHAR(45) DEFAULT NULL COMMENT 'conta dona do link (auto-cadastro)',
  ADD COLUMN `status` VARCHAR(20) NOT NULL DEFAULT 'approved' COMMENT 'pending|approved|rejected|suspended',
  ADD COLUMN `applied_at` BIGINT DEFAULT NULL,
  ADD COLUMN `reviewed_at` BIGINT DEFAULT NULL,
  ADD COLUMN `reject_reason` VARCHAR(255) DEFAULT NULL,
  ADD INDEX `idx_account` (`account_name`),
  ADD INDEX `idx_status` (`status`);

-- Comissão padrão passa a 10% (regulamento). Só afeta cadastros NOVOS;
-- quem já existe mantém o percentual atual de propósito.
ALTER TABLE `streamers`
  ALTER COLUMN `commission_pct` SET DEFAULT 10;

-- ------------------------------------------------------- 2. comissões por compra
CREATE TABLE IF NOT EXISTS `referral_commissions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `order_id` VARCHAR(64) NOT NULL COMMENT 'ikoin_orders.id — 1 comissão por pedido',
  `streamer_slug` VARCHAR(45) NOT NULL,
  `buyer_account` VARCHAR(45) NOT NULL,
  `order_amount` INT NOT NULL COMMENT 'valor da compra (1 Ikoin = R$ 1,00)',
  `commission_pct` INT NOT NULL COMMENT 'percentual congelado no momento da compra',
  `commission_value` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT 'pending|available|paid|reversed',
  `created_at` BIGINT NOT NULL COMMENT 'quando a compra foi paga',
  `available_at` BIGINT NOT NULL COMMENT 'created_at + 30 dias — quando vira sacável',
  `paid_at` BIGINT DEFAULT NULL,
  `payout_id` BIGINT DEFAULT NULL COMMENT 'referral_payouts.id quando sacado',
  `reversed_at` BIGINT DEFAULT NULL,
  `reverse_reason` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  -- garante 1 comissão por pedido mesmo se o webhook do PIX disparar duas vezes
  UNIQUE KEY `uk_order` (`order_id`),
  INDEX `idx_slug_status` (`streamer_slug`, `status`),
  INDEX `idx_available` (`available_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------ 3. saques
CREATE TABLE IF NOT EXISTS `referral_payouts` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `streamer_slug` VARCHAR(45) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'requested' COMMENT 'requested|processing|paid|rejected',
  `pix_key` VARCHAR(255) DEFAULT NULL COMMENT 'coletado só na hora do saque (LGPD: princípio da necessidade)',
  `requested_at` BIGINT NOT NULL,
  `processed_at` BIGINT DEFAULT NULL,
  `note` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_slug` (`streamer_slug`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- CONFERIR DEPOIS DE RODAR
-- ============================================================================
-- SHOW COLUMNS FROM streamers LIKE 'status';
-- SHOW TABLES LIKE 'referral_%';
