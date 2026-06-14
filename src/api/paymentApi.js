import { client } from './client';

export const paymentApi = {
  // Native UPI-intent checkout flow (Razorpay Orders + SDK).
  createOrder: () => client.post('/payments/create-order'),
  verify: (payload) => client.post('/payments/verify', payload),

  // Legacy payment-link flow (kept as a fallback).
  createLink: () => client.post('/payments/create-link'),
  status: (linkId) => client.get(`/payments/status/${linkId}`),
};
