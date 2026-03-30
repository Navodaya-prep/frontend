import { client } from './client';

export const courseApi = {
  getCourses: (params) => client.get('/courses', { params }),
  getCourseById: (id) => client.get(`/courses/${id}`),
  getChapters: (courseId) => client.get(`/courses/${courseId}/chapters`),
  getVideos: (chapterId) => client.get(`/chapters/${chapterId}/videos`),
  getPDFs: (chapterId) => client.get(`/chapters/${chapterId}/pdfs`),
};
