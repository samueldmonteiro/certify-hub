-- CreateTable
CREATE TABLE "attendance_calls" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_presences" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "course" "CertificateType" NOT NULL,
    "trainingDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "branchNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_presences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "attendance_presences" ADD CONSTRAINT "attendance_presences_callId_fkey" FOREIGN KEY ("callId") REFERENCES "attendance_calls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
