-- Rodar no banco CENTRAL da VPS (l2jmobiusessence ou onde está ikoin_balance)
-- Adiciona campo 'server' na game_offer para separar Essence de Interlude

ALTER TABLE `game_offer` ADD COLUMN IF NOT EXISTS `server` VARCHAR(20) NOT NULL DEFAULT 'essence';

-- Atualizar registros existentes para marcar como Essence
UPDATE `game_offer` SET `server` = 'essence' WHERE `server` = '';

-- Criar tabela account_premium_interlude separada (o aCis tem banco próprio)
-- Premium do Interlude fica no banco central vinculado por account_name
CREATE TABLE IF NOT EXISTS `account_premium_interlude` (
  `account_name` VARCHAR(45) NOT NULL,
  `premium_expiry` BIGINT NOT NULL DEFAULT 0,
  `updated_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`account_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
