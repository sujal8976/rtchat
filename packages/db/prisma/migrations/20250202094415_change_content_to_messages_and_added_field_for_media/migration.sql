/*
  Warnings:

  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video');

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "content",
ADD COLUMN     "mediaType" "MediaType",
ADD COLUMN     "mediaUrl" TEXT,
ADD COLUMN     "message" TEXT;
