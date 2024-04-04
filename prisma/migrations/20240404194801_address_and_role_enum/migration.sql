-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DELIVERYMAN', 'ADMINISTRATOR');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address_id" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'DELIVERYMAN';

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
