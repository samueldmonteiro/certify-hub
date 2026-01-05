-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "workload" INTEGER NOT NULL,
    "completionDate" TIMESTAMP(3) NOT NULL,
    "page" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "ptsBook" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificates_registrationNumber_key" ON "certificates"("registrationNumber");
