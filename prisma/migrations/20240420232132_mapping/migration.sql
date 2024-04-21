-- DropForeignKey
ALTER TABLE "recipients" DROP CONSTRAINT "recipients_address_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_address_id_fkey";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
