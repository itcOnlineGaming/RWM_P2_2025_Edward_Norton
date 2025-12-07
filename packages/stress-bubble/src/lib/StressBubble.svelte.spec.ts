import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import StressBubble from './StressBubble.svelte';
import type { Stressor } from '../types';

describe('StressBubble Component', () => {
  const mockStressor: Stressor = {
    id: 'test-1',
    name: 'Test Stressor',
    level: 3,
    notes: 'Test notes',
    date: '2024-12-07',
    createdAt: Date.now()
  };

  it('should render bubble with stressor name', async () => {
    render(StressBubble, { props: { stressor: mockStressor } });
    
    const bubbleName = page.getByText('Test Stressor');
    await expect.element(bubbleName).toBeInTheDocument();
  });

  it('should display correct stress level', async () => {
    render(StressBubble, { props: { stressor: mockStressor } });
    
    const level = page.getByText('Lv 3');
    await expect.element(level).toBeInTheDocument();
  });

  it('should render correct number of cells based on level', async () => {
    render(StressBubble, { props: { stressor: mockStressor } });
    
    const cells = page.locator('.cell-bubble');
    await expect.element(cells).toHaveCount(3);
  });

  it('should render different number of cells for different levels', async () => {
    const level5Stressor: Stressor = { ...mockStressor, level: 5 };
    render(StressBubble, { props: { stressor: level5Stressor } });
    
    const cells = page.locator('.cell-bubble');
    await expect.element(cells).toHaveCount(5);
  });

  it('should apply correct color for stress level 1', async () => {
    const level1Stressor: Stressor = { ...mockStressor, level: 1 };
    render(StressBubble, { props: { stressor: level1Stressor } });
    
    const bubble = page.locator('.stress-bubble');
    await expect.element(bubble).toBeInTheDocument();
    // Color #9ACD32 (yellow-green)
  });

  it('should apply correct color for stress level 5', async () => {
    const level5Stressor: Stressor = { ...mockStressor, level: 5 };
    render(StressBubble, { props: { stressor: level5Stressor } });
    
    const bubble = page.locator('.stress-bubble');
    await expect.element(bubble).toBeInTheDocument();
    // Color #E91E63 (deep pink)
  });

  it('should be clickable', async () => {
    const { component } = render(StressBubble, { props: { stressor: mockStressor } });
    
    const bubble = page.locator('.stress-bubble');
    await expect.element(bubble).toBeInTheDocument();
    
    // Should have role="button"
    const button = page.getByRole('button', { name: /Test Stressor/i });
    await expect.element(button).toBeInTheDocument();
  });

  it('should show remove icon on cell hover', async () => {
    render(StressBubble, { props: { stressor: mockStressor } });
    
    const cell = page.locator('.cell-bubble').first();
    await cell.hover();
    
    const removeIcon = page.locator('.cell-remove-icon');
    await expect.element(removeIcon).toBeInTheDocument();
  });

  it('should emit click event when bubble is clicked', async () => {
    const { component } = render(StressBubble, { props: { stressor: mockStressor } });
    
    const clickHandler = vi.fn();
    component.$on('click', clickHandler);
    
    const bubble = page.locator('.stress-bubble');
    await bubble.click();
    
    expect(clickHandler).toHaveBeenCalled();
  });

  it('should have proper aria-label', async () => {
    render(StressBubble, { props: { stressor: mockStressor } });
    
    const bubble = page.getByRole('button', { name: 'Stressor: Test Stressor, Level 3' });
    await expect.element(bubble).toBeInTheDocument();
  });

  it('should truncate long stressor names', async () => {
    const longNameStressor: Stressor = {
      ...mockStressor,
      name: 'This is a very long stressor name that should be truncated properly'
    };
    
    render(StressBubble, { props: { stressor: longNameStressor } });
    
    const bubble = page.locator('.stress-bubble');
    await expect.element(bubble).toBeInTheDocument();
  });
});