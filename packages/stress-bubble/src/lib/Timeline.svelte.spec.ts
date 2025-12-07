import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Timeline from './Timeline.svelte';

describe('Timeline Component', () => {
  const mockStressData = {
    '2024-12-07': [{ id: '1', name: 'Test', level: 3, date: '2024-12-07', createdAt: Date.now() }],
    '2024-12-06': [{ id: '2', name: 'Test2', level: 2, date: '2024-12-06', createdAt: Date.now() }]
  };

  it('should render currently viewing display', async () => {
    render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: mockStressData 
      } 
    });
    
    const viewingText = page.getByText(/Currently viewing:/i);
    await expect.element(viewingText).toBeInTheDocument();
  });

  it('should display current date', async () => {
    render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: {} 
      } 
    });
    
    const dateDisplay = page.getByText(/Dec 7/i);
    await expect.element(dateDisplay).toBeInTheDocument();
  });

  it('should have previous day button', async () => {
    render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: {} 
      } 
    });
    
    const prevButton = page.getByRole('button', { name: /Previous day/i });
    await expect.element(prevButton).toBeInTheDocument();
  });

  it('should have next day button', async () => {
    render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: {} 
      } 
    });
    
    const nextButton = page.getByRole('button', { name: /Next day/i });
    await expect.element(nextButton).toBeInTheDocument();
  });

  it('should have today button', async () => {
    render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: {} 
      } 
    });
    
    const todayButton = page.getByRole('button', { name: /Today/i });
    await expect.element(todayButton).toBeInTheDocument();
  });

  it('should emit dateChange event when previous day clicked', async () => {
    const { component } = render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: {} 
      } 
    });
    
    const dateChangeHandler = vi.fn();
    component.$on('dateChange', dateChangeHandler);
    
    const prevButton = page.getByRole('button', { name: /Previous day/i });
    await prevButton.click();
    
    expect(dateChangeHandler).toHaveBeenCalled();
    expect(dateChangeHandler.mock.calls[0][0].detail).toBe('2024-12-06');
  });

  it('should emit dateChange event when next day clicked', async () => {
    const { component } = render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: {} 
      } 
    });
    
    const dateChangeHandler = vi.fn();
    component.$on('dateChange', dateChangeHandler);
    
    const nextButton = page.getByRole('button', { name: /Next day/i });
    await nextButton.click();
    
    expect(dateChangeHandler).toHaveBeenCalled();
    expect(dateChangeHandler.mock.calls[0][0].detail).toBe('2024-12-08');
  });

  it('should emit dateChange event when today clicked', async () => {
    const { component } = render(Timeline, { 
      props: { 
        currentDate: '2024-12-01', 
        stressData: {} 
      } 
    });
    
    const dateChangeHandler = vi.fn();
    component.$on('dateChange', dateChangeHandler);
    
    const todayButton = page.getByRole('button', { name: /Today/i });
    await todayButton.click();
    
    expect(dateChangeHandler).toHaveBeenCalled();
    // Should be today's date
    const today = new Date().toISOString().split('T')[0];
    expect(dateChangeHandler.mock.calls[0][0].detail).toBe(today);
  });

  it('should show data indicator when date has stress data', async () => {
    render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: mockStressData 
      } 
    });
    
    const dataDot = page.locator('.data-dot');
    await expect.element(dataDot).toBeInTheDocument();
  });

  it('should not show data indicator when date has no stress data', async () => {
    render(Timeline, { 
      props: { 
        currentDate: '2024-12-10', 
        stressData: mockStressData 
      } 
    });
    
    const dataDot = page.locator('.data-dot');
    await expect.element(dataDot).not.toBeInTheDocument();
  });

  it('should have calendar button', async () => {
    render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: {} 
      } 
    });
    
    const calendarButton = page.getByRole('button', { name: /Open calendar/i });
    await expect.element(calendarButton).toBeInTheDocument();
  });

  it('should emit openCalendar event when calendar button clicked', async () => {
    const { component } = render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: {} 
      } 
    });
    
    const openCalendarHandler = vi.fn();
    component.$on('openCalendar', openCalendarHandler);
    
    const calendarButton = page.getByRole('button', { name: /Open calendar/i });
    await calendarButton.click();
    
    expect(openCalendarHandler).toHaveBeenCalled();
  });

  it('should have date slider', async () => {
    render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: {} 
      } 
    });
    
    const slider = page.getByRole('slider', { name: /Navigate through dates/i });
    await expect.element(slider).toBeInTheDocument();
  });

  it('should emit dateChange when slider value changes', async () => {
    const { component } = render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: {} 
      } 
    });
    
    const dateChangeHandler = vi.fn();
    component.$on('dateChange', dateChangeHandler);
    
    const slider = page.getByRole('slider', { name: /Navigate through dates/i });
    await slider.fill('5'); // 5 days from today
    
    expect(dateChangeHandler).toHaveBeenCalled();
  });

  it('should display calendar icon', async () => {
    render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: {} 
      } 
    });
    
    const calendarIcon = page.locator('.calendar-icon');
    await expect.element(calendarIcon).toBeInTheDocument();
  });

  it('should be responsive and fit within container', async () => {
    render(Timeline, { 
      props: { 
        currentDate: '2024-12-07', 
        stressData: {} 
      } 
    });
    
    const timeline = page.locator('.timeline-compact');
    await expect.element(timeline).toBeInTheDocument();
  });
});