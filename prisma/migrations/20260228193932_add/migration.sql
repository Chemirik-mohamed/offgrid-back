/*
  Warnings:

  - You are about to drop the column `category` on the `Appliance` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Appliance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appliance" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ApplianceCategory";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updeatedAT" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appliance" ADD CONSTRAINT "Appliance_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
