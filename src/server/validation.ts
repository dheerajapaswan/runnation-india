import { z } from "zod";

const trimmed = (min: number, max: number, msg: string) => z.string().trim().min(min, msg).max(max, "Too long");

export const registrationSchema = z.object({
  fullName: trimmed(2, 100, "Enter your full name."),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email("Enter a valid email address.")),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
  city: trimmed(2, 80, "Enter your city."),
  address: trimmed(8, 300, "Enter your full delivery address for the medal."),
  pincode: z.string().regex(/^\d{6}$/, "Enter a 6-digit PIN code."),
  dateOfBirth: z.iso.date("Select your date of birth.").refine((d) => new Date(d) <= new Date(), "Date of birth cannot be in the future."),
  gender: z.enum(["Female", "Male", "Non-binary", "Prefer not to say"], "Select an option."),
  distanceId: z.enum(["3k", "5k", "10k", "21k"], "Choose a valid distance."),
  acceptTerms: z.literal(true, "You must accept the terms to continue."),
});

export const participantLoginSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^RV26-[A-Z0-9]{6}$/, "Enter a valid registration ID."),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
});

export const adminLoginSchema = z.object({ password: z.string().min(1, "Enter the password.").max(200) });

const idParam = z.string().uuid("Invalid ID");
export const parseId = (v: string) => idParam.parse(v);

export const proofReviewSchema = z.object({ status: z.enum(["approved", "rejected"]) });

export const registrationUpdateSchema = z
  .object({
    paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
    medalStatus: z.enum(["packed", "shipped", "delivered"]).optional(),
  })
  .refine((v) => v.paymentStatus || v.medalStatus, "Nothing to update");

export const proofSubmitSchema = z.object({
  app: z.enum(["Strava", "Garmin Connect", "Nike Run Club", "Apple Fitness", "Google Fit", "Other"], "Choose your running app."),
  time: z.string().trim().regex(/^(\d{1,2}:)?[0-5]?\d:[0-5]\d$/, "Use MM:SS or H:MM:SS, for example 45:20."),
  date: z.iso.date("Select the date of your run.").refine((d) => new Date(d) <= new Date(), "Run date cannot be in the future."),
});

export const PROOF_MAX_BYTES = 5 * 1024 * 1024;
export const PROOF_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
