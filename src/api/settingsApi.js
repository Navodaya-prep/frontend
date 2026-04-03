import { client } from './client';

export const getSettings = async () => {
  const response = await client.get('/settings');
  return response.data;
};
