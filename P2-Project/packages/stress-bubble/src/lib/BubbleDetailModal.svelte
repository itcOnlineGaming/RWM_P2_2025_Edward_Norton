<script lang="ts">
  // Feature #6: Bubble Detail/Edit Modal
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import type { Stressor } from '../types.ts';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let stressor: Stressor;
  
  // Local state for editing notes
  let isEditingNotes = false;
  let editedNotes = stressor.notes || '';
  
  // Color mapping
  const colorMap: Record<number, string> = {
    1: '#9ACD32',
    2: '#FFD700',
    3: '#FFA500',
    4: '#FF69B4',
    5: '#E91E63'
  };
  
  $: bubbleColor = colorMap[stressor.level];
  
  // Task #6: Cell Bubble Generation for detail view
  $: cells = Array.from({ length: stressor.level }, (_, i) => ({
    id: `detail-cell-${i}`,
    index: i
  }));
  
  // Check if can add more cells
  $: canAddCell = stressor.level < 5;
  
  // Task #6: Cell Removal Logic
  function handleRemoveCell(cellIndex: number) {
    if (stressor.level === 1) {
      // Task #6: Bubble "Popping" Animation
      // When last cell removed, delete entire stressor
      dispatch('delete', stressor.id);
      return;
    }
    
    const newLevel = Math.max(1, stressor.level - 1) as 1 | 2 | 3 | 4 | 5;
    dispatch('updateLevel', { id: stressor.id, level: newLevel });
  }
  
  // Task #6: Add Cell Logic (Increase stress)
  function handleAddCell() {
    if (stressor.level >= 5) return; // Max level is 5
    
    const newLevel = Math.min(5, stressor.level + 1) as 1 | 2 | 3 | 4 | 5;
    dispatch('updateLevel', { id: stressor.id, level: newLevel });
  }
  
  // Task #6: Delete Stressor Option
  function handleDelete() {
    if (confirm(`Are you sure you want to delete "${stressor.name}"?`)) {
      dispatch('delete', stressor.id);
    }
  }
  
  // Edit notes functionality
  function startEditingNotes() {
    isEditingNotes = true;
    editedNotes = stressor.notes || '';
  }
  
  function saveNotes() {
    dispatch('updateNotes', { id: stressor.id, notes: editedNotes.trim() || undefined });
    isEditingNotes = false;
  }
  
  function cancelEditNotes() {
    isEditingNotes = false;
    editedNotes = stressor.notes || '';
  }
  
  function handleClose() {
    dispatch('close');
  }
  
  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }
  
  // Format date
  function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Task #6: Detail Modal Structure -->
<div 
  class="modal-overlay" 
  on:click={handleOverlayClick}
  on:keydown={handleKeydown}
  role="dialog"
  aria-modal="true"
  aria-labelledby="detail-modal-title"
  transition:fade={{ duration: 200 }}
>
  <div class="modal-content" transition:scale={{ duration: 200, start: 0.9 }}>
    <div class="modal-header">
      <h2 id="detail-modal-title">{stressor.name}</h2>
      <button 
        class="close-button" 
        on:click={handleClose} 
        type="button" 
        aria-label="Close"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    
    <!-- Task #6: Detail View Layout -->
    <div class="detail-content">
      <!-- Stress Level Display -->
      <div class="level-section">
        <div class="level-info">
          <span class="level-label">Stress Level</span>
          <span class="level-value" style="color: {bubbleColor}">
            {stressor.level}/5
          </span>
        </div>
        
        <!-- Task #6: Interactive Cell Removal UI -->
        <div class="instruction-text">
          {#if stressor.level === 1}
            <p>Tap the cell to completely remove this stressor, or add more</p>
          {:else if stressor.level === 5}
            <p>Tap cells to reduce stress (Max level reached)</p>
          {:else}
            <p>Tap cells to reduce stress, or add more if stress increases</p>
          {/if}
        </div>
        
        <div class="cells-container">
          {#each cells as cell (cell.id)}
            <button
              class="detail-cell"
              style="background: {bubbleColor}"
              on:click={() => handleRemoveCell(cell.index)}
              type="button"
              aria-label="Remove cell {cell.index + 1}"
              transition:scale={{ duration: 300 }}
            >
              <span class="cell-number">{cell.index + 1}</span>
              <span class="cell-hover-icon">×</span>
            </button>
          {/each}
          
          <!-- Task #6: Add Cell Button -->
          {#if canAddCell}
            <button
              class="add-cell-button"
              on:click={handleAddCell}
              type="button"
              aria-label="Add stress cell"
              transition:scale={{ duration: 300 }}
            >
              <span class="add-icon">+</span>
            </button>
          {/if}
        </div>
      </div>
      
      <!-- Notes Section -->
      <div class="notes-section">
        <div class="notes-header">
          <h3>Notes</h3>
          {#if !isEditingNotes}
            <button class="edit-notes-btn" on:click={startEditingNotes} type="button">
              ✏️ Edit
            </button>
          {/if}
        </div>
        
        {#if isEditingNotes}
          <div class="notes-edit">
            <textarea 
              bind:value={editedNotes}
              placeholder="Add details about this stressor..."
              maxlength="500"
              rows="4"
              class="notes-textarea"
            ></textarea>
            <div class="notes-actions">
              <button class="btn-small btn-secondary" on:click={cancelEditNotes} type="button">
                Cancel
              </button>
              <button class="btn-small btn-primary-small" on:click={saveNotes} type="button">
                Save Notes
              </button>
            </div>
          </div>
        {:else}
          <p class="notes-text">
            {stressor.notes || 'No notes added yet. Click edit to add notes.'}
          </p>
        {/if}
      </div>
      
      <!-- Metadata -->
      <div class="metadata-section">
        <div class="metadata-item">
          <span class="metadata-label">Added</span>
          <span class="metadata-value">{formatDate(stressor.date)}</span>
        </div>
      </div>
    </div>
    
    <!-- Task #6: Delete Stressor Option -->
    <div class="modal-actions">
      <button 
        type="button" 
        class="btn btn-delete" 
        on:click={handleDelete}
      >
        Delete Stressor
      </button>
      <button 
        type="button" 
        class="btn btn-secondary" 
        on:click={handleClose}
      >
        Close
      </button>
    </div>
  </div>
</div>

<style>
  /* Modal Overlay */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    backdrop-filter: blur(4px);
  }
  
  .modal-content {
    background: linear-gradient(180deg, #f5e6dc 0%, #ede0d6 100%);
    border-radius: 20px;
    padding: 32px;
    max-width: 480px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    color: #2c2c2c;
    word-wrap: break-word;
    flex: 1;
    padding-right: 16px;
  }
  
  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    color: #666;
    transition: all 0.2s;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .close-button:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #2c2c2c;
  }
  
  /* Detail Content */
  .detail-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  /* Task #6: Detail View Layout - Level Section */
  .level-section {
    background: rgba(255, 255, 255, 0.6);
    padding: 20px;
    border-radius: 16px;
  }
  
  .level-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .level-label {
    font-size: 14px;
    font-weight: 600;
    color: #666;
  }
  
  .level-value {
    font-size: 28px;
    font-weight: 700;
  }
  
  .instruction-text {
    margin-bottom: 16px;
    padding: 12px;
    background: rgba(217, 118, 66, 0.1);
    border-radius: 8px;
    border-left: 3px solid #d97642;
  }
  
  .instruction-text p {
    margin: 0;
    font-size: 13px;
    color: #5c5c5c;
    font-weight: 500;
  }
  
  /* Task #6: Interactive Cell Removal UI */
  .cells-container {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .detail-cell {
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 18px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .detail-cell:hover {
    transform: scale(1.1);
    border-color: white;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
  
  .detail-cell:active {
    transform: scale(0.95);
  }
  
  .cell-number {
    transition: opacity 0.2s;
  }
  
  .cell-hover-icon {
    position: absolute;
    opacity: 0;
    font-size: 28px;
    font-weight: bold;
    transition: opacity 0.2s;
  }
  
  .detail-cell:hover .cell-number {
    opacity: 0;
  }
  
  .detail-cell:hover .cell-hover-icon {
    opacity: 1;
  }
  
  /* Task #6: Add Cell Button */
  .add-cell-button {
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 3px dashed #d97642;
    background: rgba(217, 118, 66, 0.1);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d97642;
    font-weight: 700;
    font-size: 28px;
  }
  
  .add-cell-button:hover {
    transform: scale(1.1);
    background: rgba(217, 118, 66, 0.2);
    border-color: #c85a2d;
    box-shadow: 0 4px 12px rgba(217, 118, 66, 0.3);
  }
  
  .add-cell-button:active {
    transform: scale(0.95);
  }
  
  .add-icon {
    font-size: 32px;
    line-height: 1;
  }
  
  /* Notes Section */
  .notes-section {
    background: rgba(255, 255, 255, 0.6);
    padding: 20px;
    border-radius: 16px;
  }
  
  .notes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .notes-section h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #2c2c2c;
  }
  
  .edit-notes-btn {
    background: none;
    border: none;
    color: #d97642;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s;
  }
  
  .edit-notes-btn:hover {
    background: rgba(217, 118, 66, 0.1);
  }
  
  .notes-text {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: #5c5c5c;
    white-space: pre-wrap;
    font-style: italic;
  }
  
  .notes-edit {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .notes-textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid rgba(217, 118, 66, 0.2);
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    background: white;
    color: #2c2c2c;
  }
  
  .notes-textarea:focus {
    outline: none;
    border-color: #d97642;
    box-shadow: 0 0 0 3px rgba(217, 118, 66, 0.1);
  }
  
  .notes-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  
  .btn-small {
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .btn-primary-small {
    background: linear-gradient(135deg, #d97642 0%, #c85a2d 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .btn-primary-small:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(217, 118, 66, 0.3);
  }
  
  /* Metadata Section */
  .metadata-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .metadata-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }
  
  .metadata-label {
    font-size: 13px;
    color: #999;
    font-weight: 500;
  }
  
  .metadata-value {
    font-size: 13px;
    color: #5c5c5c;
    font-weight: 600;
  }
  
  /* Task #6: Delete Stressor Option - Modal Actions */
  .modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 28px;
    padding-top: 20px;
    border-top: 2px solid rgba(0, 0, 0, 0.05);
  }
  
  .btn {
    padding: 14px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .btn-secondary {
    background: rgba(255, 255, 255, 0.8);
    color: #666;
    border: 2px solid rgba(0, 0, 0, 0.1);
  }
  
  .btn-secondary:hover {
    background: white;
    color: #2c2c2c;
  }
  
  .btn-delete {
    background: #e74c3c;
    color: white;
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  }
  
  .btn-delete:hover {
    background: #c0392b;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
  }
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .modal-content {
      padding: 24px;
    }
    
    .modal-header h2 {
      font-size: 22px;
    }
    
    .detail-cell {
      width: 52px;
      height: 52px;
    }
    
    .cell-hover-icon {
      opacity: 0.3;
    }
    
    .modal-actions {
      flex-direction: column-reverse;
    }
    
    .btn {
      width: 100%;
    }
  }
</style>