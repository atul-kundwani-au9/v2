/*
  Warnings:

  - Added the required column `Admin` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EmployeeType` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Password` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `Admin` BOOLEAN NOT NULL,
    ADD COLUMN `EmployeeType` VARCHAR(191) NOT NULL,
    ADD COLUMN `Password` VARCHAR(191) NOT NULL;
