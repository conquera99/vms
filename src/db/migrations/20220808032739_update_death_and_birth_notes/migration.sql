/*
  Warnings:

  - You are about to drop the column `deceased_notes` on the `deceased` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `deceased` DROP COLUMN `deceased_notes`,
    ADD COLUMN `deceased_birth_notes` VARCHAR(191) NULL,
    ADD COLUMN `deceased_death_notes` VARCHAR(191) NULL;
