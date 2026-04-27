/*
  Warnings:

  - You are about to drop the column `accessType` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `altitudeM` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `autonomyDays` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `clientAccessToken` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `clientSubmittedAt` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `dcBusVoltageV` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `hasGenerator` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `hasHydro` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `hasWindTurbine` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `lightningRisk` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `optimizePvInclination` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `panelToBatteryDistanceM` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `projectAddress` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `projectCity` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `projectZipCode` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `pvMountingType` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `usagePeriods` on the `project` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "project_clientAccessToken_key";

-- AlterTable
ALTER TABLE "project" DROP COLUMN "accessType",
DROP COLUMN "altitudeM",
DROP COLUMN "autonomyDays",
DROP COLUMN "clientAccessToken",
DROP COLUMN "clientSubmittedAt",
DROP COLUMN "dcBusVoltageV",
DROP COLUMN "hasGenerator",
DROP COLUMN "hasHydro",
DROP COLUMN "hasWindTurbine",
DROP COLUMN "latitude",
DROP COLUMN "lightningRisk",
DROP COLUMN "longitude",
DROP COLUMN "optimizePvInclination",
DROP COLUMN "panelToBatteryDistanceM",
DROP COLUMN "projectAddress",
DROP COLUMN "projectCity",
DROP COLUMN "projectZipCode",
DROP COLUMN "pvMountingType",
DROP COLUMN "usagePeriods";

-- CreateTable
CREATE TABLE "client_intake" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_intake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_site" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "altitudeM" DOUBLE PRECISION,
    "accessType" TEXT,
    "lightningRisk" TEXT,
    "usagePeriods" TEXT,
    "dcBusVoltageV" INTEGER NOT NULL DEFAULT 48,
    "autonomyDays" DOUBLE PRECISION,
    "panelToBatteryDistanceM" DOUBLE PRECISION,
    "pvMountingType" TEXT,
    "optimizePvInclination" BOOLEAN NOT NULL DEFAULT false,
    "hasGenerator" BOOLEAN NOT NULL DEFAULT false,
    "hasWindTurbine" BOOLEAN NOT NULL DEFAULT false,
    "hasHydro" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_site_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_intake_projectId_key" ON "client_intake"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "client_intake_accessToken_key" ON "client_intake"("accessToken");

-- AddForeignKey
ALTER TABLE "client_intake" ADD CONSTRAINT "client_intake_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_site" ADD CONSTRAINT "project_site_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
