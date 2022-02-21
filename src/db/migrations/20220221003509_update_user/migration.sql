/*
  Warnings:

  - A unique constraint covering the columns `[user_username]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `users_user_email_key` ON `users`;

-- CreateIndex
CREATE UNIQUE INDEX `users_user_username_key` ON `users`(`user_username`);
