import { client } from './client';

export const profileApi = {
  getProfile: () => client.get('/profile/me'),
  updateProfile: (data) => client.put('/profile/update', data),
};
