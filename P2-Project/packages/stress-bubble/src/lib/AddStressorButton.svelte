<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let disabled = false;
  
  function handleClick() {
    if (!disabled) {
      dispatch('click');
    }
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
    z-index: 10;
  }
  
  .add-stressor-fab:hover:not(.disabled) {
    transform: scale(1.1);
    box-shadow: 0 8px 28px rgba(217, 118, 66, 0.6);
    background: linear-gradient(135deg, #e08552 0%, #d96b3d 100%);
  }
  
  .add-stressor-fab:active:not(.disabled) {
    transform: scale(0.95);
  }
  
  .add-stressor-fab.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #ccc;
  }
  
  .add-stressor-fab svg {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }
  
  /* Mobile adjustments */
  @media (max-width: 768px) {
    .add-stressor-fab {
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
    }
  }
</style>