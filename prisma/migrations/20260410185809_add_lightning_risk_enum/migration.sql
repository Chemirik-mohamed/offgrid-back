/*
  Warnings:

  - The `lightningRisk` column on the `project_site` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "lightningRisk" AS ENUM ('LOW', 'MODERAT', 'HIGH');

-- AlterTable
ALTER TABLE "project_site" DROP COLUMN "lightningRisk",
ADD COLUMN     "lightningRisk" "lightningRisk" NOT NULL DEFAULT 'LOW';
