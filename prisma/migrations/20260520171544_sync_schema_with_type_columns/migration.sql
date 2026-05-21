/*
  Warnings:

  - The primary key for the `certificate_sequences` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `certificate_sequences` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `certificates` table. All the data in the column will be lost.
  - Added the required column `type` to the `certificate_sequences` table without a default value. This is not possible if the table is not empty.
  - The required column `typeId` was added to the `certificate_sequences` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `type` to the `certificates` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('BRIGADISTA', 'CIPEIRO', 'DIRECAO_DEFENSIVA');

-- AlterTable
ALTER TABLE "certificate_sequences" DROP CONSTRAINT "certificate_sequences_pkey",
DROP COLUMN "id",
ADD COLUMN     "type" "CertificateType" NOT NULL,
ADD COLUMN     "typeId" TEXT NOT NULL,
ADD CONSTRAINT "certificate_sequences_pkey" PRIMARY KEY ("type", "year");

-- AlterTable
ALTER TABLE "certificates" DROP COLUMN "message",
ADD COLUMN     "type" "CertificateType" NOT NULL;
