/*
  Warnings:

  - A unique constraint covering the columns `[album_slug]` on the table `albums` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[post_slug]` on the table `posts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `albums_album_slug_key` ON `albums`(`album_slug`);

-- CreateIndex
CREATE UNIQUE INDEX `posts_post_slug_key` ON `posts`(`post_slug`);
