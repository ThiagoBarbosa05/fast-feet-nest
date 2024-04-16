/*
  Warnings:

  - Added the required column `address_id` to the `Recipient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipient" ADD COLUMN     "address_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Recipient" ADD CONSTRAINT "Recipient_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
