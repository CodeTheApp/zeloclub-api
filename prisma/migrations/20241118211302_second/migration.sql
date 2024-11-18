-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "acceptApplications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quantityVacancies" INTEGER NOT NULL DEFAULT 1;
