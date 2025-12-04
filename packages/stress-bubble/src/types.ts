export interface Stressor {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  date: string; // ISO date string
  createdAt: number; // timestamp
}

export interface StressData {
  [date: string]: Stressor[]; // date as key (YYYY-MM-DD)
}

export interface BubblePosition {
  x: number;
  y: number;
  radius: number;
}