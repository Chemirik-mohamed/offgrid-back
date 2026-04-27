/*
  Warnings:

  - The values [MODERAT] on the enum `lightningRisk` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "lightningRisk_new" AS ENUM ('LOW', 'MODERATE', 'HIGH');
ALTER TABLE "public"."project_site" ALTER COLUMN "lightningRisk" DROP DEFAULT;
ALTER TABLE "project_site" ALTER COLUMN "lightningRisk" TYPE "lightningRisk_new" USING ("lightningRisk"::text::"lightningRisk_new");
ALTER TYPE "lightningRisk" RENAME TO "lightningRisk_old";
ALTER TYPE "lightningRisk_new" RENAME TO "lightningRisk";
DROP TYPE "public"."lightningRisk_old";
ALTER TABLE "project_site" ALTER COLUMN "lightningRisk" SET DEFAULT 'LOW';
COMMIT;
