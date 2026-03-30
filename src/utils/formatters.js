export function formatScore(correct, total) {
  return `${correct}/${total}`;
}

export function formatPercent(correct, total) {
  if (total === 0) return '0%';
  return `${Math.round((correct / total) * 100)}%`;
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getRankSuffix(rank) {
  if (rank === 11 || rank === 12 || rank === 13) return `${rank}th`;
  switch (rank % 10) {
    case 1: return `${rank}st`;
    case 2: return `${rank}nd`;
    case 3: return `${rank}rd`;
    default: return `${rank}th`;
  }
}

export function getGrade(percent) {
  if (percent >= 90) return { label: 'Outstanding', color: '#34A853' };
  if (percent >= 75) return { label: 'Excellent', color: '#1A73E8' };
  if (percent >= 60) return { label: 'Good', color: '#FB8C00' };
  if (percent >= 40) return { label: 'Average', color: '#FBBC04' };
  return { label: 'Needs Improvement', color: '#EA4335' };
}
