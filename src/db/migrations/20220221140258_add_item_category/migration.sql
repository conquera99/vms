/*
  Warnings:

  - Added the required column `item_ic_id` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `items` ADD COLUMN `item_ic_id` VARCHAR(191) NOT NULL;
