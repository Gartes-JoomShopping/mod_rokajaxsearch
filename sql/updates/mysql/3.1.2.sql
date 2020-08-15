ALTER TABLE `#__jshopping_products`
ADD FULLTEXT INDEX fulltext_search_index ( `name_ru-RU` , `meta_keyword_ru-RU` ) ;


-- ALTER TABLE `#__jshopping_products` DROP INDEX `product_ean`, ADD UNIQUE `product_ean` (`product_ean`) USING BTREE;