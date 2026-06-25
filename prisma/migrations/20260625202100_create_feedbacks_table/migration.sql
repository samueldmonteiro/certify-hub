-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "course" "CertificateType" NOT NULL,
    "stars" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);
