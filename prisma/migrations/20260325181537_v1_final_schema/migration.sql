/*
  Warnings:

  - You are about to drop the column `altitude` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `hoursPerDay` on the `project_appliance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clientAccessToken]` on the table `project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyUsageMinutes` to the `project_appliance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratedPowerW` to the `project_appliance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_appliance" DROP CONSTRAINT "project_appliance_projectId_fkey";

-- DropIndex
DROP INDEX "client_token_key";

-- AlterTable
ALTER TABLE "client" DROP COLUMN "altitude",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "token",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "accessType" TEXT,
ADD COLUMN     "altitudeM" DOUBLE PRECISION,
ADD COLUMN     "autonomyDays" DOUBLE PRECISION,
ADD COLUMN     "clientAccessToken" TEXT,
ADD COLUMN     "clientSubmittedAt" TIMESTAMP(3),
ADD COLUMN     "dcBusVoltageV" INTEGER NOT NULL DEFAULT 48,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "hasGenerator" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasHydro" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasWindTurbine" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastCalculationSnapshot" JSONB,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "lightningRisk" TEXT,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "optimizePvInclination" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "panelToBatteryDistanceM" DOUBLE PRECISION,
ADD COLUMN     "projectAddress" TEXT,
ADD COLUMN     "projectCity" TEXT,
ADD COLUMN     "projectZipCode" TEXT,
ADD COLUMN     "pvMountingType" TEXT,
ADD COLUMN     "usagePeriods" TEXT;

-- AlterTable
ALTER TABLE "project_appliance" DROP COLUMN "hoursPerDay",
ADD COLUMN     "currentType" TEXT NOT NULL DEFAULT 'AC',
ADD COLUMN     "dailyScheduleMinutes" INTEGER[],
ADD COLUMN     "dailyUsageMinutes" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "diversityCoeff" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
ADD COLUMN     "ratedPowerW" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "startupPowerW" DOUBLE PRECISION,
ADD COLUMN     "voltageV" DOUBLE PRECISION NOT NULL DEFAULT 230;

-- CreateIndex
CREATE UNIQUE INDEX "project_clientAccessToken_key" ON "project"("clientAccessToken");

-- AddForeignKey
ALTER TABLE "project_appliance" ADD CONSTRAINT "project_appliance_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
