-- CreateTable
CREATE TABLE `Permissions` (
    `permission_name` VARCHAR(100) NOT NULL,
    `permission_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`permission_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_permissions` (
    `up_user_id` VARCHAR(191) NOT NULL,
    `up_permission_name` VARCHAR(100) NOT NULL,
    `up_access` CHAR(1) NOT NULL DEFAULT 'N',
    `up_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `up_created_by` VARCHAR(191) NOT NULL,
    `up_updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `up_updated_by` VARCHAR(191) NULL,

    UNIQUE INDEX `user_permissions_up_user_id_up_permission_name_key`(`up_user_id`, `up_permission_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
