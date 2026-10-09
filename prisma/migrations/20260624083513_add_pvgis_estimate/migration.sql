-- CreateEnum
CREATE TYPE "PvgisTechnology" AS ENUM ('crystSi', 'crystSi2025', 'CIS', 'CdTe', 'Unknown');

-- CreateEnum
CREATE TYPE "PvgisMountingPlace" AS ENUM ('free', 'building');

-- CreateTable
CREATE TABLE "pvgis_estimate" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pvgisApiVersion" TEXT NOT NULL DEFAULT '5.3',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "inclinationDeg" DOUBLE PRECISION NOT NULL,
    "azimuthDeg" DOUBLE PRECISION NOT NULL,
    "lossPercent" DOUBLE PRECISION NOT NULL,
    "technology" "PvgisTechnology" NOT NULL DEFAULT 'crystSi',
    "mountingPlace" "PvgisMountingPlace" NOT NULL DEFAULT 'free',
    "referencePeakPowerKwp" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "annualIrradiationKwhPerM2" DOUBLE PRECISION NOT NULL,
    "annualProductionKwhPerKwp" DOUBLE PRECISION NOT NULL,
    "monthly" JSONB NOT NULL,

    CONSTRAINT "pvgis_estimate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pvgis_estimate_projectId_calculatedAt_idx" ON "pvgis_estimate"("projectId", "calculatedAt");

-- AddForeignKey
ALTER TABLE "pvgis_estimate" ADD CONSTRAINT "pvgis_estimate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
