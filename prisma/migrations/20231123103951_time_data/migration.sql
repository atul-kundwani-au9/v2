-- CreateTable
CREATE TABLE `ManagerEmployee` (
    `managerId` INTEGER NOT NULL,
    `employeeId` INTEGER NOT NULL,

    PRIMARY KEY (`employeeId`, `managerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ManagerEmployee` ADD CONSTRAINT `ManagerEmployee_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Employee`(`EmployeeID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ManagerEmployee` ADD CONSTRAINT `ManagerEmployee_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`EmployeeID`) ON DELETE RESTRICT ON UPDATE CASCADE;
