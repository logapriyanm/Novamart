/*
  Warnings:

  - You are about to drop the column `autoRule` on the `badges` table. All the data in the column will be lost.
  - You are about to drop the column `adminDecision` on the `disputes` table. All the data in the column will be lost.
  - You are about to drop the column `raisedByUserId` on the `disputes` table. All the data in the column will be lost.
  - You are about to drop the column `resolvedAt` on the `disputes` table. All the data in the column will be lost.
  - You are about to drop the column `lockedAt` on the `escrows` table. All the data in the column will be lost.
  - You are about to drop the column `refundedAt` on the `escrows` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceUrl` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `assignedAt` on the `user_badges` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `user_badges` table. All the data in the column will be lost.
  - You are about to drop the `Evidence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarginRule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaxRule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `platform_settings` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,badgeId]` on the table `user_badges` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `disputes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `raisedBy` to the `disputes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `disputes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `escrows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddress` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Evidence" DROP CONSTRAINT "Evidence_disputeId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_dealerId_fkey";

-- DropForeignKey
ALTER TABLE "disputes" DROP CONSTRAINT "disputes_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_logs" DROP CONSTRAINT "order_logs_orderId_fkey";

-- DropIndex
DROP INDEX "disputes_orderId_key";

-- AlterTable
ALTER TABLE "badges" DROP COLUMN "autoRule";

-- AlterTable
ALTER TABLE "disputes" DROP COLUMN "adminDecision",
DROP COLUMN "raisedByUserId",
DROP COLUMN "resolvedAt",
ADD COLUMN     "adminNotes" TEXT,
ADD COLUMN     "compensationAmount" DECIMAL(12,2),
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "evidenceFiles" TEXT[],
ADD COLUMN     "raisedBy" TEXT NOT NULL,
ADD COLUMN     "resolutionDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "escrows" DROP COLUMN "lockedAt",
DROP COLUMN "refundedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "metadata",
DROP COLUMN "readAt",
ADD COLUMN     "link" TEXT,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "invoiceUrl",
ADD COLUMN     "billingAddress" TEXT,
ADD COLUMN     "shippingAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_badges" DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy",
ADD COLUMN     "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Evidence";

-- DropTable
DROP TABLE "MarginRule";

-- DropTable
DROP TABLE "Rating";

-- DropTable
DROP TABLE "TaxRule";

-- DropTable
DROP TABLE "order_logs";

-- DropTable
DROP TABLE "platform_settings";

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "method" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carts_customerId_key" ON "carts"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_inventoryId_key" ON "cart_items"("cartId", "inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_orderId_key" ON "payments"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_razorpayOrderId_key" ON "payments"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_razorpayPaymentId_key" ON "payments"("razorpayPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_userId_badgeId_key" ON "user_badges"("userId", "badgeId");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "dealers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
