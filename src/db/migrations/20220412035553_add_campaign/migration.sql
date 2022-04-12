-- CreateTable
CREATE TABLE `campaign` (
    `campaign_id` VARCHAR(191) NOT NULL,
    `campaign_title` VARCHAR(255) NOT NULL,
    `campaign_slug` VARCHAR(255) NOT NULL,
    `campaign_desc` TEXT NOT NULL,
    `campaign_notes` TEXT NULL,
    `campaign_start_date` DATE NULL,
    `campaign_end_date` DATE NULL,
    `campaign_status` VARCHAR(1) NOT NULL,
    `campaign_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `campaign_created_by` VARCHAR(191) NOT NULL,
    `campaign_updated_at` DATETIME(3) NOT NULL,
    `campaign_updated_by` VARCHAR(191) NULL,

    PRIMARY KEY (`campaign_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaign_detail` (
    `cd_campaign_id` VARCHAR(191) NOT NULL,
    `cd_seq` INTEGER NOT NULL,
    `cd_name` VARCHAR(255) NOT NULL,
    `cd_desc` TEXT NULL,
    `cd_value` DECIMAL(20, 3) NOT NULL,
    `cd_status` VARCHAR(1) NOT NULL,
    `cd_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cd_created_by` VARCHAR(191) NOT NULL,
    `cd_updated_at` DATETIME(3) NOT NULL,
    `cd_updated_by` VARCHAR(191) NULL,

    UNIQUE INDEX `campaign_detail_cd_campaign_id_cd_seq_key`(`cd_campaign_id`, `cd_seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
