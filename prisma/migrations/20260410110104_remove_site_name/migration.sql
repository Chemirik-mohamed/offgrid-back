/*
  Warnings:

  - You are about to drop the column `name` on the `project_site` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `project_site` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "project_site" DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "project_site_projectId_key" ON "project_site"("projectId");
