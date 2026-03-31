/*
  Warnings:

  - You are about to drop the column `fileURL` on the `certificates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "certificates" DROP COLUMN "fileURL",
ADD COLUMN     "message" TEXT;
