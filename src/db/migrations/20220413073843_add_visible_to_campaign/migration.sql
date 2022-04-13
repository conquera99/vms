-- AlterTable
ALTER TABLE `campaign` ADD COLUMN `campaign_visbile` VARCHAR(1) NOT NULL DEFAULT 'Y',
    MODIFY `campaign_status` VARCHAR(1) NOT NULL DEFAULT 'A';
