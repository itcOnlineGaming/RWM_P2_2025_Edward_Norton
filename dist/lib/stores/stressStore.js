// packages/stress-bubble/src/lib/stores/stressStore.ts
import { writable, derived } from 'svelte/store';
// Main stress data store
export const stressData = writable({});
// Current date being viewed
export const currentDate = writable(new Date().toISOString().split('T')[0]);
// Derived store: Get stressors for current date
export const currentStressors = derived([stressData, currentDate], ([$stressData, $currentDate]) => {
    return $stressData[$currentDate] || [];
});
// Helper functions to interact with the store
export const stressActions = {
    // Load data from localStorage or API
    loadData: (data) => {
        stressData.set(data);
    },
    // Add a new stressor
    addStressor: (date, stressor) => {
        stressData.update(data => {
            if (!data[date]) {
                data[date] = [];
            }
            data[date] = [...data[date], stressor];
            return data;
        });
    },
    // Update a stressor
    updateStressor: (date, stressorId, updates) => {
        stressData.update(data => {
            if (data[date]) {
                data[date] = data[date].map(s => s.id === stressorId ? { ...s, ...updates } : s);
            }
            return data;
        });
    },
    // Delete a stressor
    deleteStressor: (date, stressorId) => {
        stressData.update(data => {
            if (data[date]) {
                data[date] = data[date].filter(s => s.id !== stressorId);
            }
            return data;
        });
    },
    // Change current date
    setDate: (date) => {
        currentDate.set(date);
    }
};
