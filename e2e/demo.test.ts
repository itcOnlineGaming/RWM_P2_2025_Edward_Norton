import { expect, test } from '@playwright/test';

test.describe('Stress Bubble Graph - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Stress Bubble Graph/);
  });

  test('displays main heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /Stress Bubble Tracker/i });
    await expect(heading).toBeVisible();
  });

  test('shows empty state when no stressors exist', async ({ page }) => {
    // Clear localStorage first
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    const emptyState = page.getByText(/No stressors tracked yet/i);
    await expect(emptyState).toBeVisible();
  });

  test('can open add stressor modal', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    const addButton = page.locator('button[aria-label="Add new stressor"]');
    await addButton.click();
    
    const modal = page.getByRole('dialog', { name: /How stressed are you/i });
    await expect(modal).toBeVisible();
  });

  test('can add a new stressor', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Open add modal
    const addButton = page.locator('button[aria-label="Add new stressor"]');
    await addButton.click();
    
    // Fill out form
    await page.fill('input[id="stressor-name"]', 'Test Stressor');
    await page.click('button[aria-label="Level 4"]');
    await page.fill('textarea[id="stressor-notes"]', 'This is a test note');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify stressor appears
    const bubble = page.locator('.stress-bubble');
    await expect(bubble).toBeVisible();
    await expect(bubble).toContainText('Test Stressor');
  });

  test('displays correct number of cells based on stress level', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Add stressor with level 3
    const addButton = page.locator('button[aria-label="Add new stressor"]');
    await addButton.click();
    await page.fill('input[id="stressor-name"]', 'Level 3 Stress');
    await page.click('button[aria-label="Level 3"]');
    await page.click('button[type="submit"]');
    
    // Count cells (should be 3)
    const cells = page.locator('.cell-bubble');
    await expect(cells).toHaveCount(3);
  });
});