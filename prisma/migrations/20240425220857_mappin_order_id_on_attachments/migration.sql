/*
  Warnings:

  - You are about to drop the column `orderId` on the `attachments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_orderId_fkey";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "orderId",
ADD COLUMN     "order_id" TEXT;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
