-- Physical finisher medal returns: delivery address + medal fulfilment status.
CREATE TYPE "MedalStatus" AS ENUM ('NOT_READY', 'PACKED', 'SHIPPED', 'DELIVERED');
ALTER TABLE "Registration"
  ADD COLUMN "medalStatus" "MedalStatus" NOT NULL DEFAULT 'NOT_READY',
  ADD COLUMN "address" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "pincode" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Registration" ALTER COLUMN "address" DROP DEFAULT, ALTER COLUMN "pincode" DROP DEFAULT;
