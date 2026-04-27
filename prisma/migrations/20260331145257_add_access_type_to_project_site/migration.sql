/*
  Warnings:

  - The `accessType` column on the `project_site` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('ROAD', 'CARRIAGE', 'FOOT');

-- AlterTable
ALTER TABLE "project_site" ADD COLUMN     "requiresFourWheelDrive" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "accessType",
ADD COLUMN     "accessType" "AccessType" NOT NULL DEFAULT 'ROAD';
