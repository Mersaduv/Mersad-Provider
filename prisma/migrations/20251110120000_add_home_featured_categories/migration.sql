-- AlterTable
ALTER TABLE "public"."Category"
ADD COLUMN "showOnHome" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "homeOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Category_showOnHome_homeOrder_idx" ON "public"."Category"("showOnHome", "homeOrder");

