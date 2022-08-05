-- CreateTable
CREATE TABLE `deceased` (
    `deceased_id` VARCHAR(191) NOT NULL,
    `deceased_name` VARCHAR(191) NOT NULL,
    `deceased_place_of_birth` VARCHAR(191) NULL,
    `deceased_date_of_birth` DATETIME(3) NULL,
    `deceased_date_of_dead` DATETIME(3) NULL,
    `deceased_image_id` VARCHAR(255) NULL,
    `deceased_image` TEXT NULL,
    `deceased_notes` VARCHAR(191) NULL,
    `deceased_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deceased_created_by` VARCHAR(191) NOT NULL,
    `deceased_updated_at` DATETIME(3) NOT NULL,
    `deceased_updated_by` VARCHAR(191) NULL,

    PRIMARY KEY (`deceased_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deceased_family` (
    `df_deceased_id` VARCHAR(191) NOT NULL,
    `df_member_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `deceased_family_df_deceased_id_df_member_id_key`(`df_deceased_id`, `df_member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
