/*
  Warnings:

  - Added the required column `fileURL` to the `certificates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "certificates" ADD COLUMN     "fileURL" TEXT NOT NULL;
