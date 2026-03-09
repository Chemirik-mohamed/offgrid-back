-- CreateEnum
CREATE TYPE "ApplianceCategory" AS ENUM ('COLD', 'IT', 'LIGHTING', 'KITCHEN', 'AGRICULTURE', 'MISC');

-- CreateTable
CREATE TABLE "Appliance" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ApplianceCategory" NOT NULL,
    "typicalPowerW" INTEGER NOT NULL,
    "minPowerW" INTEGER,
    "maxPowerW" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appliance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appliance_slug_key" ON "Appliance"("slug");
