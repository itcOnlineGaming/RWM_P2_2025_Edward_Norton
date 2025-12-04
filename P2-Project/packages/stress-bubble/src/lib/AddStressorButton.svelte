<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let disabled = false;
  
  function handleClick() {
    // Always dispatch click - parent will handle showing warning
    dispatch('click');
  }
</script>

<button 
  class="add-stressor-fab" 
  class:disabled
  on:click={handleClick}
  aria-label="Add new stressor"
  type="button"
>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  </svg>
</button>

<style>
  /* FAB positioned absolutely INSIDE parent container */
  .add-stressor-fab {
    position: absolute;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d97642 0%, #c85a2d 100%);
    border: none;
    color: white;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(217, 118, 66, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 50; /* Higher than bubbles but lower than modals */
  }
  
  .add-stressor-fab:hover:not(.disabled) {
    transform: scale(1.1);
    box-shadow: 0 8px 28px rgba(217, 118, 66, 0.6);
    background: linear-gradient(135deg, #e08552 0%, #d96b3d 100%);
  }
  
  .add-stressor-fab:active:not(.disabled) {
    transform: scale(0.95);
  }
  
  /* Disabled state */
  .add-stressor-fab.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: linear-gradient(135deg, #999 0%, #777 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .add-stressor-fab.disabled:hover {
    transform: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .add-stressor-fab svg {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }
  
  /* Mobile adjustments */
  @media (max-width: 768px) {
    .add-stressor-fab {
      bottom: 20px;
      right: 20px;
      width: 52px;
      height: 52px;
    }
    
    .add-stressor-fab svg {
      width: 22px;
      height: 22px;
    }
  }
  
  @media (max-width: 480px) {
    .add-stressor-fab {
      bottom: 16px;
      right: 16px;
      width: 48px;
      height: 48px;
    }
    
    .add-stressor-fab svg {
      width: 20px;
      height: 20px;
    }
  }
</style>