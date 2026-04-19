import { client } from './client';

export const bookmarkApi = {
  list: () => client.get('/bookmarks'),
  add: (questionId, source = 'practice') => client.post('/bookmarks', { questionId, source }),
  remove: (questionId) => client.delete(`/bookmarks/${questionId}`),
};
