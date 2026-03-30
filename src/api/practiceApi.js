import { client } from './client';

export const practiceApi = {
  getQuestions: (chapterId) => client.get(`/practice/questions/${chapterId}`),
  submitAnswers: (chapterId, answers) => client.post('/practice/submit', { chapterId, answers }),
};
