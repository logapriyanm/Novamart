-- AlterTable
ALTER TABLE "dealer_requests" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "escrows" ADD COLUMN     "dealerAmount" DECIMAL(12,2),
ADD COLUMN     "disputeId" TEXT,
ADD COLUMN     "platformFee" DECIMAL(12,2),
ADD COLUMN     "releaseCondition" TEXT DEFAULT 'DELIVERY_CONFIRMED';

-- AlterTable
ALTER TABLE "inventories" ADD COLUMN     "allocatedStock" INTEGER,
ADD COLUMN     "dealerBasePrice" DECIMAL(12,2),
ADD COLUMN     "dealerMoq" INTEGER,
ADD COLUMN     "isAllocated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isListed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "listedAt" TIMESTAMP(3),
ADD COLUMN     "marginPercent" DECIMAL(5,2),
ADD COLUMN     "maxMargin" DECIMAL(5,2);

-- AlterTable
ALTER TABLE "subscription_plans" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "marginBoost" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "priorityAllocation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wholesaleDiscount" DECIMAL(5,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "shipment_tracking" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "carrier" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "estimatedDelivery" TIMESTAMP(3),
    "actualDelivery" TIMESTAMP(3),
    "statusHistory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipment_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dealer_performance_metrics" (
    "id" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "orderFulfillmentRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "averageShippingTime" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "disputeRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "customerSatisfaction" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "performanceScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dealer_performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacturer_dealer_blocks" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "blockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unblockedAt" TIMESTAMP(3),

    CONSTRAINT "manufacturer_dealer_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipment_tracking_orderId_key" ON "shipment_tracking"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "dealer_performance_metrics_dealerId_key" ON "dealer_performance_metrics"("dealerId");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturer_dealer_blocks_manufacturerId_dealerId_key" ON "manufacturer_dealer_blocks"("manufacturerId", "dealerId");

-- AddForeignKey
ALTER TABLE "shipment_tracking" ADD CONSTRAINT "shipment_tracking_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dealer_performance_metrics" ADD CONSTRAINT "dealer_performance_metrics_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "dealers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacturer_dealer_blocks" ADD CONSTRAINT "manufacturer_dealer_blocks_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacturer_dealer_blocks" ADD CONSTRAINT "manufacturer_dealer_blocks_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "dealers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
