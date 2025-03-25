/*
  Warnings:

  - Added the required column `categoryName` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recurrence` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Income" ADD COLUMN "categoryName" TEXT;
ALTER TABLE "Income" ADD COLUMN "currency" TEXT;
ALTER TABLE "Income" ADD COLUMN "description" TEXT;
ALTER TABLE "Income" ADD COLUMN "recurrence" TEXT;

-- Update existing records with default values
UPDATE "Income" SET 
  "categoryName" = (SELECT name FROM "Category" WHERE "Category".id = "Income"."categoryId"),
  "currency" = 'USD',
  "description" = '',
  "recurrence" = 'monthly'
WHERE "categoryName" IS NULL;

-- Make columns required after setting default values
ALTER TABLE "Income" ALTER COLUMN "categoryName" SET NOT NULL;
ALTER TABLE "Income" ALTER COLUMN "currency" SET NOT NULL;
ALTER TABLE "Income" ALTER COLUMN "description" SET NOT NULL;
ALTER TABLE "Income" ALTER COLUMN "recurrence" SET NOT NULL;
