/*
  Warnings:

  - Added the required column `skorTest` to the `assesmentResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assesmentresult` ADD COLUMN `skorTest` DOUBLE NOT NULL;
