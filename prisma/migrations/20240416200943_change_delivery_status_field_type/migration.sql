/*
  Warnings:

  - Changed the type of `deliveryStatus` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryStatus",
ADD COLUMN     "deliveryStatus" TEXT NOT NULL;

-- DropEnum
DROP TYPE "DeliveryStatus";
