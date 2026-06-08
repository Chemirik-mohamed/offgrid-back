/*
  Warnings:

  - You are about to drop the column `maxPowerW` on the `appliance` table. All the data in the column will be lost.
  - You are about to drop the column `minPowerW` on the `appliance` table. All the data in the column will be lost.
  - You are about to drop the column `typicalPowerW` on the `appliance` table. All the data in the column will be lost.
  - You are about to drop the column `dailyScheduleMinutes` on the `project_appliance` table. All the data in the column will be lost.
  - You are about to drop the column `dailyUsageMinutes` on the `project_appliance` table. All the data in the column will be lost.
  - You are about to drop the column `diversityCoeff` on the `project_appliance` table. All the data in the column will be lost.
  - You are about to drop the column `ratedPowerW` on the `project_appliance` table. All the data in the column will be lost.
  - You are about to drop the column `startupPowerW` on the `project_appliance` table. All the data in the column will be lost.
  - You are about to drop the column `voltageV` on the `project_appliance` table. All the data in the column will be lost.
  - Added the required column `startupPowerW` to the `appliance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPowerW` to the `appliance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultDiversityFactorSnapshot` to the `project_appliance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startupPowerWSnapshot` to the `project_appliance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeSlots` to the `project_appliance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPowerWSnapshot` to the `project_appliance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voltageVSnapshot` to the `project_appliance` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `currentType` on the `project_appliance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CurrentType" AS ENUM ('AC', 'DC');

-- AlterTable
ALTER TABLE "appliance" DROP COLUMN "maxPowerW",
DROP COLUMN "minPowerW",
DROP COLUMN "typicalPowerW",
ADD COLUMN     "currentType" "CurrentType" NOT NULL DEFAULT 'AC',
ADD COLUMN     "defaultDiversityFactor" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
ADD COLUMN     "startupPowerW" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unitPowerW" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "voltageV" DOUBLE PRECISION NOT NULL DEFAULT 230;

-- AlterTable
ALTER TABLE "project_appliance" DROP COLUMN "dailyScheduleMinutes",
DROP COLUMN "dailyUsageMinutes",
DROP COLUMN "diversityCoeff",
DROP COLUMN "ratedPowerW",
DROP COLUMN "startupPowerW",
DROP COLUMN "voltageV",
ADD COLUMN     "defaultDiversityFactorSnapshot" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "diversityFactorOverride" DOUBLE PRECISION,
ADD COLUMN     "startupPowerWSnapshot" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "timeSlots" JSONB NOT NULL,
ADD COLUMN     "unitPowerWSnapshot" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "voltageVSnapshot" DOUBLE PRECISION NOT NULL,
DROP COLUMN "currentType",
ADD COLUMN     "currentType" "CurrentType" NOT NULL;
