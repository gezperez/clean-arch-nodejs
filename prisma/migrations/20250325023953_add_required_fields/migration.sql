/*
  Warnings:

  - Added the required column `categoryName` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recurrence` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- First add the columns with NULL allowed
ALTER TABLE "Expense" 
ADD COLUMN "categoryName" TEXT,
ADD COLUMN "description" TEXT,
ADD COLUMN "recurrence" TEXT;

-- Update existing records with default values
UPDATE "Expense" 
SET 
    "categoryName" = (SELECT "name" FROM "Category" WHERE "Category"."id" = "Expense"."categoryId"),
    "description" = '',
    "recurrence" = 'None';

-- Now make the columns NOT NULL
ALTER TABLE "Expense" 
ALTER COLUMN "categoryName" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "recurrence" SET NOT NULL;
