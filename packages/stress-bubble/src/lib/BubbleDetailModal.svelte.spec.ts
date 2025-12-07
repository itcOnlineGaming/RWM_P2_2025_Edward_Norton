import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import BubbleDetailModal from './BubbleDetailModal.svelte';
import type { Stressor } from '../types';

describe('BubbleDetailModal Component', () => {
  const mockStressor: Stressor = {
    id: 'test-1',
    name: 'Test Stressor',
    level: 3,
    notes: 'Test notes',
    date: '2024-12-07',
    createdAt: Date.now()
  };

  it('should render modal with stressor name', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const heading = page.getByRole('heading', { name: /Test Stressor/i });
    await expect.element(heading).toBeInTheDocument();
  });

  it('should display stress level', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const level = page.getByText('3/5');
    await expect.element(level).toBeInTheDocument();
  });

  it('should render correct number of detail cells', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const cells = page.locator('.detail-cell');
    await expect.element(cells).toHaveCount(3);
  });

  it('should show add cell button when level < 5', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const addButton = page.getByRole('button', { name: /Add stress cell/i });
    await expect.element(addButton).toBeInTheDocument();
  });

  it('should not show add cell button when level = 5', async () => {
    const maxStressor: Stressor = { ...mockStressor, level: 5 };
    render(BubbleDetailModal, { props: { stressor: maxStressor } });
    
    const addButton = page.getByRole('button', { name: /Add stress cell/i });
    await expect.element(addButton).not.toBeInTheDocument();
  });

  it('should display stressor notes', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const notes = page.getByText('Test notes');
    await expect.element(notes).toBeInTheDocument();
  });

  it('should show placeholder when no notes exist', async () => {
    const noNotesStressor: Stressor = { ...mockStressor, notes: undefined };
    render(BubbleDetailModal, { props: { stressor: noNotesStressor } });
    
    const placeholder = page.getByText(/No notes added yet/i);
    await expect.element(placeholder).toBeInTheDocument();
  });

  it('should have edit notes button', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const editButton = page.getByRole('button', { name: /Edit/i });
    await expect.element(editButton).toBeInTheDocument();
  });

  it('should show notes textarea when edit clicked', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const editButton = page.getByRole('button', { name: /Edit/i });
    await editButton.click();
    
    const textarea = page.locator('.notes-textarea');
    await expect.element(textarea).toBeInTheDocument();
  });

  it('should have save and cancel buttons in edit mode', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const editButton = page.getByRole('button', { name: /Edit/i });
    await editButton.click();
    
    const saveButton = page.getByRole('button', { name: /Save Notes/i });
    const cancelButton = page.getByRole('button', { name: /Cancel/i });
    
    await expect.element(saveButton).toBeInTheDocument();
    await expect.element(cancelButton).toBeInTheDocument();
  });

  it('should have delete stressor button', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const deleteButton = page.getByRole('button', { name: /Delete Stressor/i });
    await expect.element(deleteButton).toBeInTheDocument();
  });

  it('should have close button', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const closeButton = page.getByRole('button', { name: /Close/i });
    await expect.element(closeButton).toBeInTheDocument();
  });

  it('should emit updateLevel when add cell clicked', async () => {
    const { component } = render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const updateLevelHandler = vi.fn();
    component.$on('updateLevel', updateLevelHandler);
    
    const addButton = page.getByRole('button', { name: /Add stress cell/i });
    await addButton.click();
    
    expect(updateLevelHandler).toHaveBeenCalled();
    expect(updateLevelHandler.mock.calls[0][0].detail.level).toBe(4);
  });

  it('should emit updateLevel when cell clicked', async () => {
    const { component } = render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const updateLevelHandler = vi.fn();
    component.$on('updateLevel', updateLevelHandler);
    
    const cell = page.locator('.detail-cell').first();
    await cell.click();
    
    expect(updateLevelHandler).toHaveBeenCalled();
    expect(updateLevelHandler.mock.calls[0][0].detail.level).toBe(2);
  });

  it('should emit delete when last cell of level 1 is removed', async () => {
    const level1Stressor: Stressor = { ...mockStressor, level: 1 };
    const { component } = render(BubbleDetailModal, { props: { stressor: level1Stressor } });
    
    const deleteHandler = vi.fn();
    component.$on('delete', deleteHandler);
    
    const cell = page.locator('.detail-cell').first();
    await cell.click();
    
    expect(deleteHandler).toHaveBeenCalled();
  });

  it('should emit updateNotes when save notes clicked', async () => {
    const { component } = render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const updateNotesHandler = vi.fn();
    component.$on('updateNotes', updateNotesHandler);
    
    // Enter edit mode
    const editButton = page.getByRole('button', { name: /Edit/i });
    await editButton.click();
    
    // Edit notes
    const textarea = page.locator('.notes-textarea');
    await textarea.fill('Updated notes');
    
    // Save
    const saveButton = page.getByRole('button', { name: /Save Notes/i });
    await saveButton.click();
    
    expect(updateNotesHandler).toHaveBeenCalled();
    expect(updateNotesHandler.mock.calls[0][0].detail.notes).toBe('Updated notes');
  });

  it('should emit close when close button clicked', async () => {
    const { component } = render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const closeHandler = vi.fn();
    component.$on('close', closeHandler);
    
    const closeButton = page.getByRole('button', { name: /^Close$/i });
    await closeButton.click();
    
    expect(closeHandler).toHaveBeenCalled();
  });

  it('should close on Escape key', async () => {
    const { component } = render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const closeHandler = vi.fn();
    component.$on('close', closeHandler);
    
    await page.keyboard.press('Escape');
    
    expect(closeHandler).toHaveBeenCalled();
  });

  it('should show confirmation dialog when delete clicked', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    
    const deleteButton = page.getByRole('button', { name: /Delete Stressor/i });
    await deleteButton.click();
    
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('should display formatted date', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    // Should show date like "Dec 7, 2024"
    const metadata = page.getByText(/Dec 7, 2024/i);
    await expect.element(metadata).toBeInTheDocument();
  });

  it('should show instruction text based on level', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const instruction = page.getByText(/Tap cells to reduce stress/i);
    await expect.element(instruction).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const dialog = page.getByRole('dialog');
    await expect.element(dialog).toHaveAttribute('aria-modal', 'true');
    await expect.element(dialog).toHaveAttribute('aria-labelledby', 'detail-modal-title');
  });

  it('should show cell numbers on cells', async () => {
    render(BubbleDetailModal, { props: { stressor: mockStressor } });
    
    const cellNumber1 = page.getByText('1');
    const cellNumber2 = page.getByText('2');
    const cellNumber3 = page.getByText('3');
    
    await expect.element(cellNumber1).toBeInTheDocument();
    await expect.element(cellNumber2).toBeInTheDocument();
    await expect.element(cellNumber3).toBeInTheDocument();
  });
});