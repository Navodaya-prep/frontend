import { client } from './client';

export const dailyChallengeApi = {
  getToday: () => client.get('/daily-challenge/today'),
  submit: (selectedIndex, timeTakenMs) =>
    client.post('/daily-challenge/submit', { selectedIndex, timeTakenMs }),
  reveal: () => client.post('/daily-challenge/reveal'),
  getLeaderboard: (period = 'today') =>
    client.get('/daily-challenge/leaderboard', { params: { period } }),
  getPractice: () => client.get('/daily-challenge/practice'),
};
