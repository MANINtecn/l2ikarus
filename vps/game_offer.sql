-- Ofertas da loja in-game (Community Board / Alt+B) - L2 Ikarus
-- Gerenciadas pelo AdminPanel do site; consumidas pelo IkaCommunityBoard (buyOffer) com Ikoin.
-- Rodar no mesmo banco do game/site (l2jmobiusessence).

CREATE TABLE IF NOT EXISTS `game_offer` (
  `id` INT NOT NULL,                       -- slot da oferta (1, 2, ...)
  `item_id` INT NOT NULL,
  `count` INT NOT NULL DEFAULT 1,
  `price_ikoin` INT NOT NULL DEFAULT 0,
  `title` VARCHAR(255) DEFAULT NULL,
  `icon` VARCHAR(255) DEFAULT NULL,
  `active` TINYINT NOT NULL DEFAULT 0,
  `updated_at` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
