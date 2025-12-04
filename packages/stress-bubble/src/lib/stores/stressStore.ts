// packages/stress-bubble/src/lib/stores/stressStore.ts
import { writable, derived } from 'svelte/store';
import type { StressData } from '../../types.ts';

// Main stress data store
export const stressData = writable<StressData>({});

// Current date being viewed
export const currentDate = writable<string>(new Date().toISOString().split('T')[0]);

// Derived store: Get stressors for current date
export const currentStressors = derived(
  [stressData, currentDate],
  ([$stressData, $currentDate]) => {
    return $stressData[$currentDate] || [];
  }
);

// Helper functions to interact with the store
export const stressActions = {
  // Load data from localStorage or API
  loadData: (data: StressData) => {
    stressData.set(data);
  },
  
  // Add a new stressor
  addStressor: (date: string, stressor: any) => {
    stressData.update(data => {
      if (!data[date]) {
        data[date] = [];
      }
      data[date] = [...data[date], stressor];
      return data;
    });
  },
  
  // Update a stressor
  updateStressor: (date: string, stressorId: string, updates: Partial<any>) => {
    stressData.update(data => {
      if (data[date]) {
        data[date] = data[date].map(s =>
          s.id === stressorId ? { ...s, ...updates } : s
        );
      }
      return data;
    });
  },
  
  // Delete a stressor
  deleteStressor: (date: string, stressorId: string) => {
    stressData.update(data => {
      if (data[date]) {
        data[date] = data[date].filter(s => s.id !== stressorId);
      }
      return data;
    });
  },
  
  // Change current date
  setDate: (date: string) => {
    currentDate.set(date);
  }
};