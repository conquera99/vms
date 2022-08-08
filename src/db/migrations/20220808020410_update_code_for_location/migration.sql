-- AlterTable
ALTER TABLE `item_location` ADD COLUMN `il_code` VARCHAR(21) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `locations` ADD COLUMN `loc_code` VARCHAR(3) NOT NULL DEFAULT '';
