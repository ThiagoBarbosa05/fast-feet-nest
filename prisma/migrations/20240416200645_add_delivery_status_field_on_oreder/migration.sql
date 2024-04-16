/*
  Warnings:

  - Added the required column `deliveryStatus` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('WAITING', 'COLLECTED', 'DELIVERED', 'RETURNED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryStatus" "DeliveryStatus" NOT NULL;
