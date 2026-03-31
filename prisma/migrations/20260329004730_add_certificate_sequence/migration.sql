-- CreateTable
CREATE TABLE "certificate_sequences" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "lastRegistrationIndex" INTEGER NOT NULL DEFAULT 0,
    "lastPtsBookIndex" INTEGER NOT NULL DEFAULT 0,
    "year" INTEGER NOT NULL,

    CONSTRAINT "certificate_sequences_pkey" PRIMARY KEY ("id")
);
