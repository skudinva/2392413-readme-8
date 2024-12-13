/*
  Warnings:

  - The primary key for the `likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_id,post_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `likes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "likes" DROP CONSTRAINT "likes_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_post_id_key" ON "likes"("user_id", "post_id");
