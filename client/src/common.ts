export const API_URL = 'http://localhost:3001/api';

export interface TimeEntry {
  id: number;
  description: string;
  startTime: Date;
  endTime: Date | null;
  duration: number;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
} 