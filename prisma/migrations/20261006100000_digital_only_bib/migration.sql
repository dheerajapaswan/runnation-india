-- Digital-only event: remove physical medal + delivery address, add E-BIB numbers.
ALTER TABLE "Registration" DROP COLUMN "medalStatus", DROP COLUMN "address", DROP COLUMN "pincode";
DROP TYPE "MedalStatus";

ALTER TABLE "Registration" ADD COLUMN "bibNumber" SERIAL;
UPDATE "Registration" SET "bibNumber" = "bibNumber" + 1000;
SELECT setval(pg_get_serial_sequence('"Registration"', 'bibNumber'), GREATEST(1000, COALESCE((SELECT MAX("bibNumber") FROM "Registration"), 0)));
CREATE UNIQUE INDEX "Registration_bibNumber_key" ON "Registration"("bibNumber");
