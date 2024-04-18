/*
  Warnings:

  - You are about to drop the column `postId` on the `likes` table. All the data in the column will be lost.
  - Added the required column `post_id` to the `likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_postId_fkey";

-- AlterTable
ALTER TABLE "likes" DROP COLUMN "postId",
ADD COLUMN     "post_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
