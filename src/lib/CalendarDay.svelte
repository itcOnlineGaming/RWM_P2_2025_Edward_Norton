<script lang="ts">
  // Task #8.2: Calendar Day Component
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let day: number;
  export let isCurrentMonth: boolean = true;
  export let isToday: boolean = false;
  export let isSelected: boolean = false;
  export let hasData: boolean = false;
  export let date: Date;
  
  function handleClick() {
    if (isCurrentMonth) {
      dispatch('select', date);
    }
  }
</script>

<button
  class="calendar-day"
  class:other-month={!isCurrentMonth}
  class:today={isToday}
  class:selected={isSelected}
  class:has-data={hasData}
  on:click={handleClick}
  disabled={!isCurrentMonth}
  type="button"
  aria-label="Select {date.toLocaleDateString()}"
>
  <span class="day-number">{day}</span>
  {#if hasData && isCurrentMonth}
    <span class="data-indicator"></span>
  {/if}
</button>

<style>
  .calendar-day {
    position: relative;
    aspect-ratio: 1;
    border: 1px solid rgba(232, 168, 124, 0.2);
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 4px;
    min-height: 48px;
  }
  
  .calendar-day:hover:not(:disabled) {
    background: rgba(232, 168, 124, 0.1);
    border-color: #e8a87c;
    transform: scale(1.05);
  }
  
  .calendar-day:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  .calendar-day.other-month {
    opacity: 0.3;
    cursor: not-allowed;
    background: rgba(0, 0, 0, 0.02);
  }
  
  .calendar-day.today {
    border: 2px solid #d97642;
    border-radius: 8px;
    font-weight: 700;
  }
  
  .calendar-day.selected {
    background: linear-gradient(135deg, #d97642 0%, #c85a2d 100%);
    color: white;
    border-color: #d97642;
  }
  
  .day-number {
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
  }
  
  .calendar-day.selected .day-number {
    color: white;
    font-weight: 700;
  }
  
  .data-indicator {
    position: absolute;
    bottom: 4px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #d97642;
  }
  
  .calendar-day.selected .data-indicator {
    background: white;
  }
  
  @media (max-width: 768px) {
    .calendar-day {
      min-height: 40px;
      padding: 6px 4px;
    }
    
    .day-number {
      font-size: 12px;
    }
    
    .data-indicator {
      width: 3px;
      height: 3px;
      bottom: 3px;
    }
  }
</style>