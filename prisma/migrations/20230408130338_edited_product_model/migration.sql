/*
  Warnings:

  - You are about to drop the column `quantity_amount` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "quantity_amount",
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0;
