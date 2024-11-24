/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `CareCharacteristic` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CareCharacteristic" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
