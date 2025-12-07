<script lang="ts">
  // Feature #7: Compact Timeline Navigation (Top-Left)
  import { createEventDispatcher } from 'svelte';
  import CalendarButton from './CalendarButton.svelte';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let currentDate: string; // ISO date string (YYYY-MM-DD)
  export let stressData: Record<string, any[]> = {}; // To show indicators
  
  // Update selectedDate when currentDate prop changes
  $: selectedDate = new Date(currentDate);
  
  // Format date with full display
  $: formattedDate = selectedDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
  
  // Short date for compact display
  $: shortDate = selectedDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
  
  // Check if date has stress data
  function hasData(date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return !!(stressData[dateStr] && stressData[dateStr].length > 0);
  }
  
  // Navigation functions
  function goToPreviousDay() {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    dispatchDateChange(newDate);
  }
  
  function goToNextDay() {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    dispatchDateChange(newDate);
  }
  
  function goToToday() {
    dispatchDateChange(new Date());
  }
  
  function dispatchDateChange(date: Date) {
    const dateStr = date.toISOString().split('T')[0];
    dispatch('dateChange', dateStr);
  }
  
  // Slider functionality
  let sliderValue = 0;
  const daysRange = 30; // Show ±30 days from today
  
  // Calculate slider value based on current date
  $: {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    const diffTime = selected.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    sliderValue = diffDays;
  }
  
  function handleSliderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const days = parseInt(target.value);
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    dispatchDateChange(newDate);
  }
  
  // Get indicator level for current date
  $: dataIndicator = hasData(selectedDate);
  
  // Calendar modal
  function handleOpenCalendar() {
    dispatch('openCalendar');
  }
</script>

<div class="timeline-compact">
  <!-- Currently Viewing Display -->
  <div class="viewing-display">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="calendar-icon">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
      <path d="M3 10H21" stroke="currentColor" stroke-width="2"/>
    </svg>
    <span class="viewing-text">Currently viewing: <strong>{formattedDate}</strong></span>
    {#if dataIndicator}
      <span class="data-dot"></span>
    {/if}
  </div>
  
  <div class="timeline-header">
    <div class="date-info">
      <button 
        class="nav-btn" 
        on:click={goToPreviousDay}
        aria-label="Previous day"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      
      <div class="date-display">
        <span class="date-text">{shortDate}</span>
      </div>
      
      <button 
        class="nav-btn" 
        on:click={goToNextDay}
        aria-label="Next day"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    
    <!-- Task #8: Calendar Button -->
    <CalendarButton on:click={handleOpenCalendar} />
  </div>
  
  <div class="slider-section">
    <input 
      type="range" 
      min="-{daysRange}" 
      max="{daysRange}" 
      value={sliderValue}
      on:input={handleSliderChange}
      class="date-slider"
      aria-label="Navigate through dates"
    />
    <div class="slider-actions">
      <button class="today-btn" on:click={goToToday} type="button">Today</button>
    </div>
  </div>
</div>

<style>
  /* FIXED: Fully responsive timeline */
  .timeline-compact {
    position: absolute;
    top: 16px;
    left: 16px;
    right: 16px; /* FIXED: Responsive width */
    max-width: 360px; /* Max width on desktop */
    background: rgba(254, 245, 238, 0.95);
    border: 2px solid #e8a87c;
    border-radius: 12px;
    padding: 12px 16px;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
  
  /* Currently Viewing Display */
  .viewing-display {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding: 8px 12px;
    background: rgba(232, 168, 124, 0.15);
    border-radius: 8px;
    border-left: 3px solid #d97642;
  }
  
  .calendar-icon {
    color: #d97642;
    flex-shrink: 0;
  }
  
  .viewing-text {
    font-size: 12px;
    color: #5c5c5c;
    line-height: 1.4;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .viewing-text strong {
    color: #2c2c2c;
    font-weight: 700;
  }
  
  .timeline-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }
  
  .date-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }
  
  .nav-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
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
  
  .nav-btn:hover {
    background: #d97642;
    color: white;
    border-color: #d97642;
    transform: scale(1.05);
  }
  
  .date-display {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-width: 60px;
  }
  
  .date-text {
    font-weight: 700;
    font-size: 14px;
    color: #2c2c2c;
    white-space: nowrap;
  }
  
  .data-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #d97642;
    flex-shrink: 0;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .slider-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .date-slider {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    outline: none;
    background: linear-gradient(to right, 
      rgba(217, 118, 66, 0.2) 0%, 
      rgba(217, 118, 66, 0.4) 50%, 
      rgba(217, 118, 66, 0.2) 100%
    );
    -webkit-appearance: none;
    appearance: none;
  }
  
  .date-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #d97642;
    cursor: grab;
    box-shadow: 0 1px 4px rgba(217, 118, 66, 0.4);
    transition: all 0.2s ease;
  }
  
  .date-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
  
  .date-slider::-webkit-slider-thumb:active {
    cursor: grabbing;
  }
  
  .date-slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #d97642;
    cursor: grab;
    border: none;
    box-shadow: 0 1px 4px rgba(217, 118, 66, 0.4);
  }
  
  .slider-actions {
    display: flex;
    justify-content: center;
  }
  
  .today-btn {
    background: none;
    border: none;
    color: #d97642;
    font-weight: 600;
    font-size: 11px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s;
  }
  
  .today-btn:hover {
    background: rgba(217, 118, 66, 0.1);
  }
  
  /* MOBILE RESPONSIVE FIXES */
  @media (max-width: 768px) {
    .timeline-compact {
      max-width: calc(100% - 32px); /* Responsive to screen */
      padding: 10px 12px;
    }
    
    .viewing-text {
      font-size: 11px;
    }
    
    .date-text {
      font-size: 13px;
    }
    
    .nav-btn {
      width: 26px;
      height: 26px;
    }
    
    .nav-btn svg {
      width: 14px;
      height: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .timeline-compact {
      top: 12px;
      left: 12px;
      right: 12px;
      max-width: calc(100% - 24px);
      padding: 8px 10px;
    }
    
    .viewing-display {
      padding: 6px 10px;
    }
    
    .viewing-text {
      font-size: 10px;
    }
    
    .calendar-icon {
      width: 14px;
      height: 14px;
    }
    
    .date-text {
      font-size: 12px;
    }
    
    .nav-btn {
      width: 24px;
      height: 24px;
    }
    
    .data-dot {
      width: 5px;
      height: 5px;
    }
  }
</style>