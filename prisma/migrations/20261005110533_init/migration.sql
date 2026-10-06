-- CreateEnum
CREATE TYPE "Distance" AS ENUM ('D5K', 'D10K', 'D21K');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ProofStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MedalStatus" AS ENUM ('NOT_READY', 'QUEUED', 'DISPATCHED', 'DELIVERED');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3),
    "windowEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "gender" TEXT NOT NULL,
    "distance" "Distance" NOT NULL,
    "amountInr" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "medalStatus" "MedalStatus" NOT NULL DEFAULT 'NOT_READY',
    "certificateIssued" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunProof" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "app" TEXT NOT NULL,
    "finishSeconds" INTEGER NOT NULL,
    "runDate" DATE NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "status" "ProofStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RunProof_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_code_key" ON "Registration"("code");

-- CreateIndex
CREATE INDEX "Registration_paymentStatus_idx" ON "Registration"("paymentStatus");

-- CreateIndex
CREATE INDEX "Registration_distance_idx" ON "Registration"("distance");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_eventId_email_key" ON "Registration"("eventId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "RunProof_registrationId_key" ON "RunProof"("registrationId");

-- CreateIndex
CREATE INDEX "RunProof_status_idx" ON "RunProof"("status");

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunProof" ADD CONSTRAINT "RunProof_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
