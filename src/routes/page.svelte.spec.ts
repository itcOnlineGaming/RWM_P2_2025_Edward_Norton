import { page } from 'vitest/browser';
import { describe, expect, it, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('Stress Bubble Graph Page Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should render the main heading', async () => {
    render(Page);
    
    const heading = page.getByRole('heading', { name: /Stress Bubble Tracker/i });
    await expect.element(heading).toBeInTheDocument();
  });

  it('should render subtitle', async () => {
    render(Page);
    
    const subtitle = page.getByText(/Track and manage your stress levels/i);
    await expect.element(subtitle).toBeInTheDocument();
  });

  it('should show instructions toggle button', async () => {
    render(Page);
    
    const toggleButton = page.getByRole('button', { name: /How to use this tracker/i });
    await expect.element(toggleButton).toBeInTheDocument();
  });

  it('should toggle instructions on click', async () => {
    render(Page);
    
    const toggleButton = page.getByRole('button', { name: /How to use this tracker/i });
    await toggleButton.click();
    
    const instructions = page.getByText(/Getting Started/i);
    await expect.element(instructions).toBeInTheDocument();
  });

  it('should show empty state initially', async () => {
    render(Page);
    
    const emptyState = page.getByText(/No stressors tracked yet/i);
    await expect.element(emptyState).toBeInTheDocument();
  });
});