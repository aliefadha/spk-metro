/*
  Warnings:

  - You are about to drop the column `skorTest` on the `assesmentresult` table. All the data in the column will be lost.
  - Made the column `totalMember` on table `division` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `assesmentresult` DROP COLUMN `skorTest`;

-- AlterTable
ALTER TABLE `division` MODIFY `totalMember` INTEGER NOT NULL DEFAULT 0;
