-- CreateTable
CREATE TABLE `posts` (
    `post_id` VARCHAR(191) NOT NULL,
    `post_title` VARCHAR(191) NOT NULL,
    `post_slug` VARCHAR(191) NOT NULL,
    `post_image` VARCHAR(191) NULL,
    `post_summary` VARCHAR(191) NULL,
    `post_keywords` VARCHAR(191) NULL,
    `post_content` VARCHAR(191) NOT NULL,
    `post_status` CHAR(1) NOT NULL DEFAULT 'D',
    `post_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `post_created_by` VARCHAR(191) NOT NULL,
    `post_updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `post_updated_by` VARCHAR(191) NULL,

    PRIMARY KEY (`post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `albums` (
    `album_id` VARCHAR(191) NOT NULL,
    `album_title` VARCHAR(191) NOT NULL,
    `album_slug` VARCHAR(191) NOT NULL,
    `album_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `album_created_by` VARCHAR(191) NOT NULL,
    `album_updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `album_updated_by` VARCHAR(191) NULL,

    PRIMARY KEY (`album_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `images` (
    `image_id` VARCHAR(191) NOT NULL,
    `image_album_id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `image_alt` VARCHAR(191) NULL,
    `image_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `image_created_by` VARCHAR(191) NOT NULL,
    `image_updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `image_updated_by` VARCHAR(191) NULL,

    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
