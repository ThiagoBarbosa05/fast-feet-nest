-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_deliveryman_id_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryman_id_fkey" FOREIGN KEY ("deliveryman_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
