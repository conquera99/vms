-- Move authentication to better-auth.
-- Fails on the unique index if two users share an email; check beforehand with:
--   SELECT user_email, COUNT(*) FROM users WHERE user_email <> '' GROUP BY user_email HAVING COUNT(*) > 1;

-- better-auth requires a name and a unique email
UPDATE `users` SET `user_name` = COALESCE(`user_username`, `user_id`) WHERE `user_name` IS NULL;
UPDATE `users` SET `user_email` = CONCAT(`user_id`, '@no-email.invalid') WHERE `user_email` IS NULL OR `user_email` = '';

ALTER TABLE `users`
    ADD COLUMN `user_email_verified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `user_name` VARCHAR(191) NOT NULL,
    MODIFY `user_email` VARCHAR(254) NOT NULL;

-- CreateTable
CREATE TABLE `sessions` (
    `session_id` VARCHAR(191) NOT NULL,
    `session_user_id` VARCHAR(191) NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `session_expires_at` DATETIME(3) NOT NULL,
    `session_ip_address` VARCHAR(191) NULL,
    `session_user_agent` TEXT NULL,
    `session_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `session_updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sessions_session_token_key`(`session_token`),
    INDEX `sessions_session_user_id_idx`(`session_user_id`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `account_id` VARCHAR(191) NOT NULL,
    `account_user_id` VARCHAR(191) NOT NULL,
    `account_account_id` VARCHAR(191) NOT NULL,
    `account_provider_id` VARCHAR(191) NOT NULL,
    `account_password` VARCHAR(255) NULL,
    `account_access_token` TEXT NULL,
    `account_refresh_token` TEXT NULL,
    `account_id_token` TEXT NULL,
    `account_access_token_expires_at` DATETIME(3) NULL,
    `account_refresh_token_expires_at` DATETIME(3) NULL,
    `account_scope` VARCHAR(191) NULL,
    `account_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `account_updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `accounts_account_user_id_idx`(`account_user_id`),
    UNIQUE INDEX `accounts_account_provider_id_account_account_id_key`(`account_provider_id`, `account_account_id`),
    PRIMARY KEY (`account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verifications` (
    `verification_id` VARCHAR(191) NOT NULL,
    `verification_identifier` VARCHAR(191) NOT NULL,
    `verification_value` TEXT NOT NULL,
    `verification_expires_at` DATETIME(3) NOT NULL,
    `verification_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verification_updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `verifications_verification_identifier_idx`(`verification_identifier`),
    PRIMARY KEY (`verification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_user_email_key` ON `users`(`user_email`);


-- Carry the existing password hashes over before dropping the old column
INSERT INTO `accounts` (`account_id`, `account_user_id`, `account_account_id`, `account_provider_id`, `account_password`, `account_created_at`, `account_updated_at`)
SELECT UUID(), `user_id`, `user_id`, 'credential', `user_password`, `user_created_at`, `user_updated_at` FROM `users`;

ALTER TABLE `users` DROP COLUMN `user_password`;
