/*
  Warnings:

  - You are about to drop the column `isIncome` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the `Expense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Income` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('EXPENSE', 'INCOME');

-- Add type column to Category
ALTER TABLE "Category" ADD COLUMN "type" "MovementType" NOT NULL DEFAULT 'EXPENSE';

-- Create the new Movement table first
CREATE TABLE "Movement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL,
    "recurrence" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "type" "MovementType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);

-- Migrate existing data from Expense table to Movement table
INSERT INTO "Movement" (
    "id", "userId", "date", "currency", "recurrence", 
    "categoryId", "categoryName", "name", "description", 
    "amount", "type", "createdAt", "updatedAt"
)
SELECT 
    "id", "userId", "date", "currency", "recurrence", 
    "categoryId", "categoryName", "name", "description", 
    "amount", 'EXPENSE'::"MovementType", "createdAt", "updatedAt"
FROM "Expense";

-- Migrate existing data from Income table to Movement table
INSERT INTO "Movement" (
    "id", "userId", "date", "currency", "recurrence", 
    "categoryId", "categoryName", "name", "description", 
    "amount", "type", "createdAt", "updatedAt"
)
SELECT 
    "id", "userId", "date", "currency", "recurrence", 
    "categoryId", "categoryName", "name", "description", 
    "amount", 'INCOME'::"MovementType", "createdAt", "updatedAt"
FROM "Income";

-- Update Category types based on isIncome
UPDATE "Category"
SET "type" = CASE 
    WHEN "isIncome" = true THEN 'INCOME'::"MovementType"
    ELSE 'EXPENSE'::"MovementType"
END;

-- Create indexes
CREATE INDEX "Movement_userId_idx" ON "Movement"("userId");
CREATE INDEX "Movement_categoryId_idx" ON "Movement"("categoryId");

-- Add foreign key constraints
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop old foreign key constraints
ALTER TABLE "Expense" DROP CONSTRAINT IF EXISTS "Expense_categoryId_fkey";
ALTER TABLE "Expense" DROP CONSTRAINT IF EXISTS "Expense_userId_fkey";
ALTER TABLE "Income" DROP CONSTRAINT IF EXISTS "Income_categoryId_fkey";
ALTER TABLE "Income" DROP CONSTRAINT IF EXISTS "Income_userId_fkey";

-- Drop old tables
DROP TABLE "Expense";
DROP TABLE "Income";

-- Drop isIncome column from Category
ALTER TABLE "Category" DROP COLUMN "isIncome";
