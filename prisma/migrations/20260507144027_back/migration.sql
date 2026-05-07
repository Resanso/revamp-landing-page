/*
  Warnings:

  - You are about to drop the column `competitionCategoryId` on the `HallOfFame` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `HallOfFame` table. All the data in the column will be lost.
  - You are about to drop the `CompetitionCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `competition` to the `HallOfFame` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "HallOfFame" DROP CONSTRAINT "HallOfFame_competitionCategoryId_fkey";

-- AlterTable
ALTER TABLE "HallOfFame" DROP COLUMN "competitionCategoryId",
DROP COLUMN "description",
ADD COLUMN     "competition" TEXT NOT NULL;

-- DropTable
DROP TABLE "CompetitionCategory";
