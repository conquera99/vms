/*
  Warnings:

  - You are about to drop the column `deceased_date_of_dead` on the `deceased` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `deceased` DROP COLUMN `deceased_date_of_dead`,
    ADD COLUMN `deceased_date_of_death` DATETIME(3) NULL;
