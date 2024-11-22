/*
  Warnings:

  - You are about to drop the column `isPremium` on the `ProfessionalProfile` table. All the data in the column will be lost.
  - You are about to drop the column `validated` on the `ProfessionalProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProfessionalProfile" DROP COLUMN "isPremium",
DROP COLUMN "validated",
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isValidated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;
