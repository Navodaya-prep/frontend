import { client } from './client';

export const courseApi = {
  getCourses: (params) => client.get('/courses', { params }),
  getCourseById: (id) => client.get(`/courses/${id}`),
  getChapters: (courseId) => client.get(`/courses/${courseId}/chapters`),
  // New: chapters with progress + lesson content
  getChaptersWithProgress: (courseId) => client.get(`/courses/${courseId}/chapters/progress`),
  getChapterLessons: (chapterId) => client.get(`/chapters/${chapterId}/lessons`),
  markLessonComplete: (lessonId) => client.post(`/lessons/${lessonId}/complete`),
};
