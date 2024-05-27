/*
  Warnings:

  - Added the required column `pathFile` to the `EnergyData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EnergyData" ADD COLUMN     "pathFile" TEXT NOT NULL,
ALTER COLUMN "energiaQtSCEE" DROP NOT NULL,
ALTER COLUMN "energiaVGDI" DROP NOT NULL;
