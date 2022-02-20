-- CreateTable
CREATE TABLE `users` (
    `user_id` VARCHAR(191) NOT NULL,
    `user_name` VARCHAR(191) NULL,
    `user_username` VARCHAR(191) NULL,
    `user_password` VARCHAR(191) NOT NULL,
    `user_email` VARCHAR(191) NULL,
    `user_image` VARCHAR(191) NULL,

    UNIQUE INDEX `users_user_email_key`(`user_email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `loc_id` VARCHAR(191) NOT NULL,
    `loc_name` VARCHAR(191) NOT NULL,
    `loc_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `loc_created_by` VARCHAR(191) NOT NULL,
    `loc_updated_at` DATETIME(3) NOT NULL,
    `loc_updated_by` VARCHAR(191) NULL,

    PRIMARY KEY (`loc_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_categories` (
    `ic_id` VARCHAR(191) NOT NULL,
    `ic_name` VARCHAR(191) NOT NULL,
    `ic_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ic_created_by` VARCHAR(191) NOT NULL,
    `ic_updated_at` DATETIME(3) NOT NULL,
    `ic_updated_by` VARCHAR(191) NULL,

    PRIMARY KEY (`ic_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `item_id` VARCHAR(191) NOT NULL,
    `item_name` VARCHAR(191) NOT NULL,
    `item_desc` VARCHAR(191) NOT NULL,
    `item_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `item_created_by` VARCHAR(191) NOT NULL,
    `item_updated_at` DATETIME(3) NOT NULL,
    `item_updated_by` VARCHAR(191) NULL,

    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_history` (
    `ih_id` VARCHAR(191) NOT NULL,
    `ih_item_id` VARCHAR(191) NOT NULL,
    `ih_date` DATE NOT NULL,
    `ih_qty` DECIMAL(13, 2) NOT NULL,
    `ih_price` DECIMAL(20, 3) NOT NULL,
    `ih_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ih_created_by` VARCHAR(191) NOT NULL,
    `ih_updated_at` DATETIME(3) NOT NULL,
    `ih_updated_by` VARCHAR(191) NULL,

    UNIQUE INDEX `item_history_ih_id_ih_item_id_key`(`ih_id`, `ih_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_location` (
    `il_loc_id` VARCHAR(191) NOT NULL,
    `il_item_id` VARCHAR(191) NOT NULL,
    `il_qty` DECIMAL(13, 2) NOT NULL,
    `il_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `il_created_by` VARCHAR(191) NOT NULL,
    `il_updated_at` DATETIME(3) NOT NULL,
    `il_updated_by` VARCHAR(191) NULL,

    UNIQUE INDEX `item_location_il_loc_id_il_item_id_key`(`il_loc_id`, `il_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `member_id` VARCHAR(191) NOT NULL,
    `member_name` VARCHAR(191) NOT NULL,
    `member_address` VARCHAR(191) NULL,
    `member_date_of_birth` DATE NULL,
    `member_email` VARCHAR(191) NULL,
    `member_phone` VARCHAR(191) NULL,
    `member_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `member_created_by` VARCHAR(191) NOT NULL,
    `member_updated_at` DATETIME(3) NOT NULL,
    `member_updated_by` VARCHAR(191) NULL,

    PRIMARY KEY (`member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
