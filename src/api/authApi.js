import { client } from './client';

export const authApi = {
  sendOtp: (phone) => client.post('/auth/send-otp', { phone }),
  verifyOtp: (phone, otp) => client.post('/auth/verify-otp', { phone, otp }),
  signup: ({ name, phone, classLevel, state, tempToken }) =>
    client.post('/auth/signup', { name, phone, classLevel, state }, {
      headers: { Authorization: `Bearer ${tempToken}` },
    }),
  login: (phone, otp) => client.post('/auth/login', { phone, otp }),
};
