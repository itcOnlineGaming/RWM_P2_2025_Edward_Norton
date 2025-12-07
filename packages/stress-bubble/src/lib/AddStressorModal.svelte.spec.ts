import { page } from 'vitest/browser';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AddStressorModal from './AddStressorModal.svelte';

describe('AddStressorModal Component', () => {
  it('should render modal with heading', async () => {
    render(AddStressorModal);
    
    const heading = page.getByRole('heading', { name: /How stressed are you/i });
    await expect.element(heading).toBeInTheDocument();
  });

  it('should have stressor name input', async () => {
    render(AddStressorModal);
    
    const input = page.getByLabelText(/What's stressing you/i);
    await expect.element(input).toBeInTheDocument();
  });

  it('should have all 5 stress level buttons', async () => {
    render(AddStressorModal);
    
    for (let i = 1; i <= 5; i++) {
      const levelButton = page.getByRole('button', { name: `Level ${i}` });
      await expect.element(levelButton).toBeInTheDocument();
    }
  });

  it('should have notes textarea', async () => {
    render(AddStressorModal);
    
    const textarea = page.getByLabelText(/Notes/i);
    await expect.element(textarea).toBeInTheDocument();
  });

  it('should have cancel and save buttons', async () => {
    render(AddStressorModal);
    
    const cancelBtn = page.getByRole('button', { name: /Cancel/i });
    const saveBtn = page.getByRole('button', { name: /Save/i });
    
    await expect.element(cancelBtn).toBeInTheDocument();
    await expect.element(saveBtn).toBeInTheDocument();
  });

  it('should disable save button when name is empty', async () => {
    render(AddStressorModal);
    
    const saveBtn = page.getByRole('button', { name: /Save/i });
    await expect.element(saveBtn).toBeDisabled();
  });

  it('should enable save button when name is filled', async () => {
    render(AddStressorModal);
    
    const input = page.getByLabelText(/What's stressing you/i);
    await input.fill('Test Stressor');
    
    const saveBtn = page.getByRole('button', { name: /Save/i });
    await expect.element(saveBtn).not.toBeDisabled();
  });

  it('should allow selecting stress level', async () => {
    render(AddStressorModal);
    
    const level4Button = page.getByRole('button', { name: 'Level 4' });
    await level4Button.click();
    
    await expect.element(level4Button).toHaveClass(/selected/);
  });

  it('should highlight selected levels correctly', async () => {
    render(AddStressorModal);
    
    // Click level 3
    const level3Button = page.getByRole('button', { name: 'Level 3' });
    await level3Button.click();
    
    // Levels 1, 2, 3 should be selected
    const level1 = page.getByRole('button', { name: 'Level 1' });
    const level2 = page.getByRole('button', { name: 'Level 2' });
    const level4 = page.getByRole('button', { name: 'Level 4' });
    
    await expect.element(level1).toHaveClass(/selected/);
    await expect.element(level2).toHaveClass(/selected/);
    await expect.element(level3Button).toHaveClass(/selected/);
    await expect.element(level4).not.toHaveClass(/selected/);
  });

  it('should show character count for name input', async () => {
    render(AddStressorModal);
    
    const input = page.getByLabelText(/What's stressing you/i);
    await input.fill('Test');
    
    const charCount = page.getByText('4/50');
    await expect.element(charCount).toBeInTheDocument();
  });

  it('should show character count for notes textarea', async () => {
    render(AddStressorModal);
    
    const textarea = page.getByLabelText(/Notes/i);
    await textarea.fill('Test notes');
    
    const charCount = page.getByText('10/500');
    await expect.element(charCount).toBeInTheDocument();
  });

  it('should enforce maxlength on name input', async () => {
    render(AddStressorModal);
    
    const input = page.getByLabelText(/What's stressing you/i) as any;
    await expect.element(input).toHaveAttribute('maxlength', '50');
  });

  it('should enforce maxlength on notes textarea', async () => {
    render(AddStressorModal);
    
    const textarea = page.getByLabelText(/Notes/i) as any;
    await expect.element(textarea).toHaveAttribute('maxlength', '500');
  });

  it('should emit cancel event when cancel button clicked', async () => {
    const { component } = render(AddStressorModal);
    
    const cancelHandler = vi.fn();
    component.$on('cancel', cancelHandler);
    
    const cancelBtn = page.getByRole('button', { name: /Cancel/i });
    await cancelBtn.click();
    
    expect(cancelHandler).toHaveBeenCalled();
  });

  it('should emit submit event with correct data', async () => {
    const { component } = render(AddStressorModal);
    
    const submitHandler = vi.fn();
    component.$on('submit', submitHandler);
    
    // Fill form
    const input = page.getByLabelText(/What's stressing you/i);
    await input.fill('Test Stressor');
    
    const level4Button = page.getByRole('button', { name: 'Level 4' });
    await level4Button.click();
    
    const textarea = page.getByLabelText(/Notes/i);
    await textarea.fill('Test notes');
    
    // Submit
    const saveBtn = page.getByRole('button', { name: /Save/i });
    await saveBtn.click();
    
    expect(submitHandler).toHaveBeenCalled();
    const eventData = submitHandler.mock.calls[0][0].detail;
    expect(eventData.name).toBe('Test Stressor');
    expect(eventData.level).toBe(4);
    expect(eventData.notes).toBe('Test notes');
  });

  it('should close on Escape key', async () => {
    const { component } = render(AddStressorModal);
    
    const cancelHandler = vi.fn();
    component.$on('cancel', cancelHandler);
    
    await page.keyboard.press('Escape');
    
    expect(cancelHandler).toHaveBeenCalled();
  });

  it('should auto-focus name input on mount', async () => {
    render(AddStressorModal);
    
    const input = page.getByLabelText(/What's stressing you/i);
    await expect.element(input).toBeFocused();
  });

  it('should have proper ARIA attributes', async () => {
    render(AddStressorModal);
    
    const dialog = page.getByRole('dialog');
    await expect.element(dialog).toHaveAttribute('aria-modal', 'true');
    await expect.element(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });
});