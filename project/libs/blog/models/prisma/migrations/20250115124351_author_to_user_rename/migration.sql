/*
  Warnings:

  - You are about to drop the column `author_id` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `origin_author_id` on the `posts` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "author_id",
DROP COLUMN "origin_author_id",
ADD COLUMN     "origin_user_id" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;
