/*
  Warnings:

  - You are about to alter the column `user_username` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `albums` MODIFY `album_title` VARCHAR(200) NOT NULL,
    MODIFY `album_slug` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `images` MODIFY `image_album_id` VARCHAR(255) NOT NULL,
    MODIFY `image` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `item_history` MODIFY `ih_image_id` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `posts` MODIFY `post_title` VARCHAR(200) NOT NULL,
    MODIFY `post_slug` VARCHAR(255) NOT NULL,
    MODIFY `post_image` TEXT NULL,
    MODIFY `post_summary` VARCHAR(255) NULL,
    MODIFY `post_keywords` VARCHAR(255) NULL,
    MODIFY `post_image_id` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `user_username` VARCHAR(25) NULL,
    MODIFY `user_password` VARCHAR(255) NOT NULL,
    MODIFY `user_email` VARCHAR(254) NULL;

-- DropTable
DROP TABLE `Member`;

-- DropTable
DROP TABLE `Permissions`;

-- CreateTable
CREATE TABLE `permissions` (
    `permission_name` VARCHAR(100) NOT NULL,
    `permission_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `permission_updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`permission_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member` (
    `member_id` VARCHAR(191) NOT NULL,
    `member_name` VARCHAR(191) NOT NULL,
    `member_address` VARCHAR(191) NULL,
    `member_date_of_birth` DATE NULL,
    `member_email` VARCHAR(254) NULL,
    `member_phone` VARCHAR(191) NULL,
    `member_image_id` VARCHAR(255) NULL,
    `member_image` TEXT NULL,
    `member_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `member_created_by` VARCHAR(191) NOT NULL,
    `member_updated_at` DATETIME(3) NOT NULL,
    `member_updated_by` VARCHAR(191) NULL,

    PRIMARY KEY (`member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
