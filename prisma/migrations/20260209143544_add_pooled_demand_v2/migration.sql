-- CreateEnum
CREATE TYPE "PoolStatus" AS ENUM ('OPEN', 'LOCKED', 'FULFILLED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "pooled_demands" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "targetQuantity" INTEGER NOT NULL,
    "currentQuantity" INTEGER NOT NULL DEFAULT 0,
    "status" "PoolStatus" NOT NULL DEFAULT 'OPEN',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pooled_demands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pool_participants" (
    "id" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pool_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pool_participants_poolId_dealerId_key" ON "pool_participants"("poolId", "dealerId");

-- AddForeignKey
ALTER TABLE "pooled_demands" ADD CONSTRAINT "pooled_demands_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pooled_demands" ADD CONSTRAINT "pooled_demands_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pool_participants" ADD CONSTRAINT "pool_participants_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "pooled_demands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pool_participants" ADD CONSTRAINT "pool_participants_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "dealers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
