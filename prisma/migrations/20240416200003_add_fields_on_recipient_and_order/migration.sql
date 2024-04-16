-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "collected_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "delivered_at" TIMESTAMP(3),
ADD COLUMN     "returned_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Recipient" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);
