import { client } from './client';

export const liveClassApi = {
  getActiveLiveClasses: () => client.get('/live/classes'),
  getLiveClass: (id) => client.get(`/live/classes/${id}`),
  registerPushToken: (token, platform) =>
    client.post('/users/push-token', { token, platform }),
};
