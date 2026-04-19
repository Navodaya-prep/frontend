import { client } from './client';

export const doubtsApi = {
  list: (subject) => client.get('/doubts', { params: subject ? { subject } : {} }),
  post: (subject, text) => client.post('/doubts', { subject, text }),
  getAnswers: (id) => client.get(`/doubts/${id}/answers`),
  postAnswer: (id, text) => client.post(`/doubts/${id}/answers`, { text }),
  remove: (id) => client.delete(`/doubts/${id}`),
};
