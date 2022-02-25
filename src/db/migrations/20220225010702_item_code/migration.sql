-- AlterTable
ALTER TABLE `item_categories` ADD COLUMN `ic_code` VARCHAR(6) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `items` ADD COLUMN `item_code` VARCHAR(6) NOT NULL DEFAULT '';
