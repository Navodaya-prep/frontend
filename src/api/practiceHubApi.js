import { client } from './client';

export const practiceHubApi = {
  // Student
  getSubjects: () => client.get('/practice/subjects'),
  getSubjectChapters: (subjectId) => client.get(`/practice/subjects/${subjectId}/chapters`),
  getChapterQuestions: (chapterId) => client.get(`/practice/chapters/${chapterId}/questions`),
  submitChapterPractice: (chapterId, answers) =>
    client.post(`/practice/chapters/${chapterId}/submit`, { answers }),
};
