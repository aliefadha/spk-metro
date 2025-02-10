/*
  Warnings:

  - A unique constraint covering the columns `[divisionName]` on the table `division` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `division` MODIFY `totalMember` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `division_divisionName_key` ON `division`(`divisionName`);
