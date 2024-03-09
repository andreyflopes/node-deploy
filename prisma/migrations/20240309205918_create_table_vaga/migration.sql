-- CreateTable
CREATE TABLE "vaga" (
    "id" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vaga_pkey" PRIMARY KEY ("id")
);
