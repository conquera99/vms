-- AlterTable
ALTER TABLE `Permissions` ADD COLUMN `permission_updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
