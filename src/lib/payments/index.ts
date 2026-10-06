/**
 * Payment provider boundary. Razorpay will implement this server-side using
 * RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET (never exposed to the client).
 */
export interface PaymentOrder {
  orderId: string;
  amountInr: number;
  currency: "INR";
}

export interface PaymentProvider {
  createOrder(input: { registrationId: string; amountInr: number }): Promise<PaymentOrder>;
  verifySignature(input: { orderId: string; paymentId: string; signature: string }): Promise<boolean>;
}

/** Not wired to any gateway. Throws so nobody mistakes it for a real payment. */
export const paymentProvider: PaymentProvider = {
  async createOrder() {
    throw new Error("Payments are not configured yet.");
  },
  async verifySignature() {
    throw new Error("Payments are not configured yet.");
  },
};
