<script lang="ts">
  // Task #8.1: Calendar Button Component
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  function handleClick() {
    dispatch('click');
  }
</script>

<button 
  class="calendar-button" 
  on:click={handleClick}
  aria-label="Open calendar"
  type="button"
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
    <path d="M3 10H21" stroke="currentColor" stroke-width="2"/>
    <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
</button>

<style>
  .calendar-button {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 2px solid rgba(232, 168, 124, 0.4);
    background: white;
    color: #d97642;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    padding: 0;
  }
  
  .calendar-button:hover {
    background: #d97642;
    color: white;
    border-color: #d97642;
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(217, 118, 66, 0.3);
  }
  
  .calendar-button:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    .calendar-button {
      width: 28px;
      height: 28px;
    }
    
    .calendar-button svg {
      width: 18px;
      height: 18px;
    }
  }
</style>