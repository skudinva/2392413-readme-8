/*
  Warnings:

  - The values [published,draft] on the enum `PostState` will be removed. If these variants are still used in the database, this will fail.
  - The values [video,text,quote,photo,link] on the enum `PostType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `text` on the `comments` table. All the data in the column will be lost.
  - Added the required column `message` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostState_new" AS ENUM ('Published', 'Draft');
ALTER TABLE "posts" ALTER COLUMN "state" TYPE "PostState_new" USING ("state"::text::"PostState_new");
ALTER TYPE "PostState" RENAME TO "PostState_old";
ALTER TYPE "PostState_new" RENAME TO "PostState";
DROP TYPE "PostState_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PostType_new" AS ENUM ('Video', 'Text', 'Quote', 'Photo', 'Link');
ALTER TABLE "posts" ALTER COLUMN "post_type" TYPE "PostType_new" USING ("post_type"::text::"PostType_new");
ALTER TYPE "PostType" RENAME TO "PostType_old";
ALTER TYPE "PostType_new" RENAME TO "PostType";
DROP TYPE "PostType_old";
COMMIT;

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "text",
ADD COLUMN     "message" TEXT NOT NULL;
