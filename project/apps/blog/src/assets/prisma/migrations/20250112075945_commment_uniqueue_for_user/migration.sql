/*
  Warnings:

  - A unique constraint covering the columns `[post_id,user_id]` on the table `comments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "comments_post_id_user_id_key" ON "comments"("post_id", "user_id");
