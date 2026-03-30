import { client } from './client';

export const leaderboardApi = {
  getLeaderboard: (subject, classLevel) =>
    client.get('/leaderboard', { params: { subject, class: classLevel } }),
};
