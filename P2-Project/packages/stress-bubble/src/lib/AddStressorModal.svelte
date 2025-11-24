<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  
  const dispatch = createEventDispatcher();
  
  // Form state
  let name = '';
  let level: 1 | 2 | 3 | 4 | 5 = 3;
  let notes = '';
  
  // Validation
  $: isValid = name.trim().length > 0 && level >= 1 && level <= 5;
  
  let nameInput: HTMLInputElement;
  
  // Auto-focus name input when modal opens
  $: if (nameInput) {
    nameInput.focus();
  }
  
  function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!isValid) return;
    
    dispatch('submit', {
      name: name.trim(),
      level,
      notes: notes.trim() || undefined,
      date: new Date().toISOString().split('T')[0]
    });
    
    // Reset form
    name = '';
    level = 3;
    notes = '';
  }
  
  function handleCancel() {
    dispatch('cancel');
  }
  
  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleCancel();
    }
  }
  
  function selectLevel(newLevel: 1 | 2 | 3 | 4 | 5) {
    level = newLevel;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div 
  class="modal-overlay" 
  on:click={handleOverlayClick}
  on:keydown={handleKeydown}
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  transition:fade={{ duration: 200 }}
>
  <div class="modal-content" transition:scale={{ duration: 200, start: 0.9 }}>
    <div class="modal-header">
      <h2 id="modal-title">How stressed are you?</h2>
      <button class="close-button" on:click={handleCancel} type="button" aria-label="Close">
      </button>
    </div>
    
    <form on:submit={handleSubmit}>
      <!-- Stressor Name Input -->
      <div class="form-group">
        <label for="stressor-name">What's stressing you? <span class="required">*</span></label>
        <input 
          id="stressor-name"
          type="text" 
          bind:this={nameInput}
          bind:value={name}
          placeholder="e.g., Final Exams, Work Deadline"
          maxlength="50"
          required
          class:error={name.length === 0 && name !== ''}
        />
        {#if name.length > 0}
          <span class="char-count">{name.length}/50</span>
        {/if}
      </div>
      
      <!-- Stress Level Selector -->
      <div class="form-group">
        <fieldset>
          <legend>Stress Level <span class="required">*</span></legend>
          
          <div class="level-selector">
            {#each [1, 2, 3, 4, 5] as levelOption}
              <button
                type="button"
                class="level-bubble"
                class:selected={levelOption <= level}
                on:click={() => selectLevel(levelOption)}
                aria-label="Level {levelOption}"
              >
                {levelOption}
              </button>
            {/each}
          </div>
          <div class="level-labels">
            <span>Low</span>
            <span>High</span>
          </div>
        </fieldset>
      </div>
      
      <!-- Optional Notes Field -->
      <div class="form-group">
        <label for="stressor-notes">Notes <span class="optional">(optional)</span></label>
        <textarea 
          id="stressor-notes"
          bind:value={notes}
          placeholder="Add any details about this stressor..."
          maxlength="500"
          rows="3"
        ></textarea>
        {#if notes.length > 0}
          <span class="char-count">{notes.length}/500</span>
        {/if}
      </div>
      
      <!-- Modal Actions -->
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" on:click={handleCancel}>
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" disabled={!isValid}>
          Save
        </button>
      </div>
    </form>
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
    max-width: 520px;
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
  }
  
  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    color: #666;
    transition: all 0.2s;
    border-radius: 50%;
  }
  
  .close-button:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #2c2c2c;
  }
  
  /* Form Groups */
  .form-group {
    margin-bottom: 24px;
    position: relative;
  }
  
  label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: #2c2c2c;
    font-size: 15px;
  }
  
  .required {
    color: #d97642;
  }
  
  .optional {
    color: #999;
    font-weight: 400;
  }
  
  /* Stressor Name Input */
  input[type="text"] {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid rgba(217, 118, 66, 0.2);
    border-radius: 12px;
    font-size: 15px;
    transition: all 0.2s;
    background: white;
    color: #2c2c2c;
  }
  
  input[type="text"]:focus {
    outline: none;
    border-color: #d97642;
    box-shadow: 0 0 0 3px rgba(217, 118, 66, 0.1);
  }
  
  input[type="text"].error {
    border-color: #e74c3c;
  }
  
  .char-count {
    position: absolute;
    right: 0;
    bottom: -20px;
    font-size: 12px;
    color: #999;
  }
  
  /* Fieldset */
  fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }
  
  legend {
    display: block;
    margin-bottom: 16px;
    font-weight: 600;
    color: #2c2c2c;
    font-size: 15px;
    padding: 0;
  }
  
  /* Level Illustration */
  .level-illustration {
    margin-bottom: 20px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Stress Level Selector */
  .level-selector {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-bottom: 12px;
  }
  
  .level-bubble {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 3px solid rgba(217, 118, 66, 0.3);
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 700;
    font-size: 18px;
    color: #999;
  }
  
  .level-bubble:hover {
    transform: scale(1.1);
    border-color: #d97642;
  }
  
  .level-bubble.selected {
    background: linear-gradient(135deg, #d97642 0%, #c85a2d 100%);
    border-color: #d97642;
    color: white;
    box-shadow: 0 4px 12px rgba(217, 118, 66, 0.3);
  }
  
  .level-labels {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #666;
    padding: 0 8px;
    font-weight: 500;
  }
  
  /* Optional Notes Field */
  textarea {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid rgba(217, 118, 66, 0.2);
    border-radius: 12px;
    font-size: 15px;
    font-family: inherit;
    resize: vertical;
    transition: all 0.2s;
    background: white;
    color: #2c2c2c;
  }
  
  textarea:focus {
    outline: none;
    border-color: #d97642;
    box-shadow: 0 0 0 3px rgba(217, 118, 66, 0.1);
  }
  
  /* Modal Actions */
  .modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 28px;
  }
  
  .btn {
    padding: 14px 32px;
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
  
  .btn-primary {
    background: linear-gradient(135deg, #d97642 0%, #c85a2d 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(217, 118, 66, 0.3);
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(217, 118, 66, 0.4);
  }
  
  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .modal-content {
      padding: 24px;
    }
    
    .modal-header h2 {
      font-size: 22px;
    }
    
    .level-bubble {
      width: 48px;
      height: 48px;
      font-size: 16px;
    }
    
    .modal-actions {
      flex-direction: column-reverse;
    }
    
    .btn {
      width: 100%;
    }
  }
</style>