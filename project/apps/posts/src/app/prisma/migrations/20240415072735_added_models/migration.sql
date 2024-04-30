/*
  Warnings:

  - You are about to drop the column `userId` on the `likes` table. All the data in the column will be lost.
  - Added the required column `postId` to the `likes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "likes" DROP COLUMN "userId",
ADD COLUMN     "postId" TEXT NOT NULL;
