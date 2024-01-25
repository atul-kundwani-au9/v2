/*
  Warnings:

  - The primary key for the `employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `manageremployee` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `manageremployee` DROP FOREIGN KEY `ManagerEmployee_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `manageremployee` DROP FOREIGN KEY `ManagerEmployee_managerId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_EmployeeID_fkey`;

-- DropForeignKey
ALTER TABLE `timesheet` DROP FOREIGN KEY `Timesheet_EmployeeID_fkey`;

-- AlterTable
ALTER TABLE `employee` DROP PRIMARY KEY,
    MODIFY `EmployeeID` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`EmployeeID`);

-- AlterTable
ALTER TABLE `manageremployee` DROP PRIMARY KEY,
    MODIFY `managerId` VARCHAR(191) NOT NULL,
    MODIFY `employeeId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`employeeId`, `managerId`);

-- AlterTable
ALTER TABLE `task` MODIFY `EmployeeID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `timesheet` MODIFY `EmployeeID` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Timesheet` ADD CONSTRAINT `Timesheet_EmployeeID_fkey` FOREIGN KEY (`EmployeeID`) REFERENCES `Employee`(`EmployeeID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ManagerEmployee` ADD CONSTRAINT `ManagerEmployee_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Employee`(`EmployeeID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ManagerEmployee` ADD CONSTRAINT `ManagerEmployee_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`EmployeeID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_EmployeeID_fkey` FOREIGN KEY (`EmployeeID`) REFERENCES `Employee`(`EmployeeID`) ON DELETE RESTRICT ON UPDATE CASCADE;
