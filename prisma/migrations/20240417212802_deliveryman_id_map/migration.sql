/*
  Warnings:

  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "userId",
ADD COLUMN     "deliveryman_id" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryman_id_fkey" FOREIGN KEY ("deliveryman_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
