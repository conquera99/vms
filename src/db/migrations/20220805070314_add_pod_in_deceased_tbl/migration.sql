-- AlterTable
ALTER TABLE `deceased` ADD COLUMN `deceased_place_of_death` VARCHAR(255) NULL,
    MODIFY `deceased_place_of_birth` VARCHAR(255) NULL;
