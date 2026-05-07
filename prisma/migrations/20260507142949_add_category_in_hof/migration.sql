/*
  Warnings:

  - You are about to drop the column `competition` on the `HallOfFame` table. All the data in the column will be lost.
  - Added the required column `competitionCategoryId` to the `HallOfFame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `HallOfFame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HallOfFame" DROP COLUMN "competition",
ADD COLUMN     "competitionCategoryId" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CompetitionCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CompetitionCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HallOfFame" ADD CONSTRAINT "HallOfFame_competitionCategoryId_fkey" FOREIGN KEY ("competitionCategoryId") REFERENCES "CompetitionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
