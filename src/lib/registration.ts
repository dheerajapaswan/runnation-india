import type { DistanceId } from "@/types";

export interface RegistrationInput {
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  address: string;
  pincode: string;
  dateOfBirth: string;
  gender: string;
  distanceId: DistanceId;
  acceptTerms: boolean;
}

export type RegistrationErrors = Partial<Record<keyof RegistrationInput, string>>;

export function validateRegistration(v: RegistrationInput): RegistrationErrors {
  const e: RegistrationErrors = {};
  if (v.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Enter a valid email address.";
  if (!/^[6-9]\d{9}$/.test(v.mobile)) e.mobile = "Enter a valid 10-digit Indian mobile number.";
  if (v.city.trim().length < 2) e.city = "Enter your city.";
  if (v.address.trim().length < 8) e.address = "Enter your full delivery address for the medal.";
  if (!/^\d{6}$/.test(v.pincode)) e.pincode = "Enter a 6-digit PIN code.";
  if (!v.dateOfBirth) e.dateOfBirth = "Select your date of birth.";
  else if (new Date(v.dateOfBirth) > new Date()) e.dateOfBirth = "Date of birth cannot be in the future.";
  if (!v.gender) e.gender = "Select an option.";
  if (!v.acceptTerms) e.acceptTerms = "You must accept the terms to continue.";
  return e;
}
