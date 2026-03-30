import { client } from './client';

export const mockTestApi = {
  getTests: (params) => client.get('/mocktests', { params }),
  getTest: (id) => client.get(`/mocktests/${id}`),
  submitTest: (testId, answers, timeTaken) =>
    client.post(`/mocktests/${testId}/submit`, { answers, timeTaken }),
  getUserAttempts: () => client.get('/mocktests/attempts'),
};
