/*
  Warnings:

  - You are about to drop the column `description` on the `Income` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Income` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Income" DROP COLUMN "description",
DROP COLUMN "source",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
