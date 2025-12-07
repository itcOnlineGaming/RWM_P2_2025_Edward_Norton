import { describe, expect, it, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { stressData, currentDate, stressActions } from './stressStore';
import type { Stressor } from '../../types';

describe('Stress Store', () => {
  const mockStressor: Stressor = {
    id: 'test-1',
    name: 'Test Stressor',
    level: 3,
    notes: 'Test notes',
    date: '2024-12-07',
    createdAt: Date.now()
  };

  beforeEach(() => {
    // Reset store
    stressActions.loadData({});
    stressActions.setDate(new Date().toISOString().split('T')[0]);
  });

  describe('currentDate store', () => {
    it('should initialize with today\'s date', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(get(currentDate)).toBe(today);
    });

    it('should update when setDate is called', () => {
      stressActions.setDate('2024-12-07');
      expect(get(currentDate)).toBe('2024-12-07');
    });
  });

  describe('stressData store', () => {
    it('should initialize as empty object', () => {
      expect(get(stressData)).toEqual({});
    });

    it('should add stressor to correct date', () => {
      stressActions.addStressor('2024-12-07', mockStressor);
      
      const data = get(stressData);
      expect(data['2024-12-07']).toBeDefined();
      expect(data['2024-12-07'].length).toBe(1);
      expect(data['2024-12-07'][0].name).toBe('Test Stressor');
    });

    it('should add multiple stressors to same date', () => {
      const stressor2: Stressor = {
        ...mockStressor,
        id: 'test-2',
        name: 'Second Stressor'
      };

      stressActions.addStressor('2024-12-07', mockStressor);
      stressActions.addStressor('2024-12-07', stressor2);
      
      const data = get(stressData);
      expect(data['2024-12-07'].length).toBe(2);
    });

    it('should store stressors for different dates separately', () => {
      stressActions.addStressor('2024-12-07', mockStressor);
      stressActions.addStressor('2024-12-08', { ...mockStressor, id: 'test-2' });
      
      const data = get(stressData);
      expect(data['2024-12-07'].length).toBe(1);
      expect(data['2024-12-08'].length).toBe(1);
    });
  });

  describe('stressActions.addStressor', () => {
    it('should create new date entry if it doesn\'t exist', () => {
      stressActions.addStressor('2024-12-07', mockStressor);
      
      const data = get(stressData);
      expect(data['2024-12-07']).toBeDefined();
    });

    it('should append to existing date entry', () => {
      stressActions.addStressor('2024-12-07', mockStressor);
      stressActions.addStressor('2024-12-07', { ...mockStressor, id: 'test-2' });
      
      const data = get(stressData);
      expect(data['2024-12-07'].length).toBe(2);
    });
  });

  describe('stressActions.updateStressor', () => {
    beforeEach(() => {
      stressActions.addStressor('2024-12-07', mockStressor);
    });

    it('should update stressor level', () => {
      stressActions.updateStressor('2024-12-07', 'test-1', { level: 5 });
      
      const data = get(stressData);
      expect(data['2024-12-07'][0].level).toBe(5);
    });

    it('should update stressor notes', () => {
      stressActions.updateStressor('2024-12-07', 'test-1', { notes: 'Updated notes' });
      
      const data = get(stressData);
      expect(data['2024-12-07'][0].notes).toBe('Updated notes');
    });

    it('should update multiple properties at once', () => {
      stressActions.updateStressor('2024-12-07', 'test-1', { 
        level: 4, 
        notes: 'New notes' 
      });
      
      const data = get(stressData);
      expect(data['2024-12-07'][0].level).toBe(4);
      expect(data['2024-12-07'][0].notes).toBe('New notes');
    });

    it('should not update non-existent stressor', () => {
      stressActions.updateStressor('2024-12-07', 'non-existent', { level: 5 });
      
      const data = get(stressData);
      expect(data['2024-12-07'][0].id).toBe('test-1');
      expect(data['2024-12-07'][0].level).toBe(3); // Unchanged
    });
  });

  describe('stressActions.deleteStressor', () => {
    beforeEach(() => {
      stressActions.addStressor('2024-12-07', mockStressor);
    });

    it('should remove stressor from date', () => {
      stressActions.deleteStressor('2024-12-07', 'test-1');
      
      const data = get(stressData);
      expect(data['2024-12-07'].length).toBe(0);
    });

    it('should remove date entry when last stressor deleted', () => {
      stressActions.deleteStressor('2024-12-07', 'test-1');
      
      const data = get(stressData);
      expect(data['2024-12-07']).toBeUndefined();
    });

    it('should not affect other stressors on same date', () => {
      const stressor2: Stressor = { ...mockStressor, id: 'test-2', name: 'Keep Me' };
      stressActions.addStressor('2024-12-07', stressor2);
      
      stressActions.deleteStressor('2024-12-07', 'test-1');
      
      const data = get(stressData);
      expect(data['2024-12-07'].length).toBe(1);
      expect(data['2024-12-07'][0].id).toBe('test-2');
    });

    it('should not affect stressors on other dates', () => {
      stressActions.addStressor('2024-12-08', { ...mockStressor, id: 'test-2' });
      
      stressActions.deleteStressor('2024-12-07', 'test-1');
      
      const data = get(stressData);
      expect(data['2024-12-08']).toBeDefined();
      expect(data['2024-12-08'].length).toBe(1);
    });
  });

  describe('stressActions.loadData', () => {
    it('should load complete data structure', () => {
      const mockData = {
        '2024-12-07': [mockStressor],
        '2024-12-08': [{ ...mockStressor, id: 'test-2' }]
      };

      stressActions.loadData(mockData);
      
      const data = get(stressData);
      expect(data).toEqual(mockData);
    });

    it('should replace existing data', () => {
      stressActions.addStressor('2024-12-07', mockStressor);
      
      const newData = {
        '2024-12-10': [{ ...mockStressor, id: 'new-1' }]
      };

      stressActions.loadData(newData);
      
      const data = get(stressData);
      expect(data['2024-12-07']).toBeUndefined();
      expect(data['2024-12-10']).toBeDefined();
    });
  });

  describe('stressActions.setDate', () => {
    it('should change current date', () => {
      stressActions.setDate('2024-12-15');
      expect(get(currentDate)).toBe('2024-12-15');
    });

    it('should accept Date object', () => {
      const date = new Date('2024-12-15');
      stressActions.setDate(date.toISOString().split('T')[0]);
      expect(get(currentDate)).toBe('2024-12-15');
    });
  });

  describe('edge cases', () => {
    it('should handle empty date entries', () => {
      const data = get(stressData);
      expect(data['2024-12-07']).toBeUndefined();
    });

    it('should handle updating stressor on non-existent date', () => {
      stressActions.updateStressor('2024-12-07', 'test-1', { level: 5 });
      
      const data = get(stressData);
      expect(data['2024-12-07']).toBeUndefined();
    });

    it('should handle deleting from non-existent date', () => {
      stressActions.deleteStressor('2024-12-07', 'test-1');
      
      const data = get(stressData);
      expect(data['2024-12-07']).toBeUndefined();
    });

    it('should handle stressor with no notes', () => {
      const noNotesStressor: Stressor = { ...mockStressor, notes: undefined };
      stressActions.addStressor('2024-12-07', noNotesStressor);
      
      const data = get(stressData);
      expect(data['2024-12-07'][0].notes).toBeUndefined();
    });

    it('should handle minimum stress level (1)', () => {
      const minStressor: Stressor = { ...mockStressor, level: 1 };
      stressActions.addStressor('2024-12-07', minStressor);
      
      const data = get(stressData);
      expect(data['2024-12-07'][0].level).toBe(1);
    });

    it('should handle maximum stress level (5)', () => {
      const maxStressor: Stressor = { ...mockStressor, level: 5 };
      stressActions.addStressor('2024-12-07', maxStressor);
      
      const data = get(stressData);
      expect(data['2024-12-07'][0].level).toBe(5);
    });
  });
});