<script lang="ts">
  // Task #8.3: Calendar Month Component
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import CalendarDay from './CalendarDay.svelte';
  
  const dispatch = createEventDispatcher();
  
  export let currentDate: string; // ISO date string
  export let stressData: Record<string, any[]> = {};
  
  let viewDate = new Date(currentDate);
  let selectedDateObj = new Date(currentDate);
  
  $: year = viewDate.getFullYear();
  $: month = viewDate.getMonth();
  
  $: monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Generate calendar days
  $: calendarDays = generateCalendarDays(year, month);
  
  function generateCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      days.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        hasData: hasStressData(date)
      });
    }
    
    // Current month days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const todayStr = today.toISOString().split('T')[0];
      const selectedStr = selectedDateObj.toISOString().split('T')[0];
      
      days.push({
        day,
        date,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedStr,
        hasData: hasStressData(date)
      });
    }
    
    // Next month days to fill grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        hasData: hasStressData(date)
      });
    }
    
    return days;
  }
  
  function hasStressData(date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return !!(stressData[dateStr] && stressData[dateStr].length > 0);
  }
  
  function previousMonth() {
    viewDate = new Date(year, month - 1, 1);
  }
  
  function nextMonth() {
    viewDate = new Date(year, month + 1, 1);
  }
  
  function goToToday() {
    viewDate = new Date();
    selectedDateObj = new Date();
    const dateStr = selectedDateObj.toISOString().split('T')[0];
    dispatch('selectDate', dateStr);
  }
  
  function clearMonth() {
    if (confirm('Clear all stress data for this month?')) {
      dispatch('clearMonth', { year, month });
    }
  }
  
  function handleDaySelect(event: CustomEvent<Date>) {
    const date = event.detail;
    selectedDateObj = date;
    const dateStr = date.toISOString().split('T')[0];
    dispatch('selectDate', dateStr);
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
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<svelte:window on:keydown={handleKeydown} />

<div 
  class="calendar-overlay"
  on:click={handleOverlayClick}
  on:keydown={handleKeydown}
  role="dialog"
  aria-modal="true"
  aria-labelledby="calendar-title"
  transition:fade={{ duration: 200 }}
>
  <div class="calendar-modal" transition:scale={{ duration: 200, start: 0.95 }}>
    <div class="calendar-header">
      <h2 id="calendar-title">{monthName}</h2>
      <button 
        class="close-btn" 
        on:click={handleClose}
        aria-label="Close calendar"
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    
    <div class="calendar-nav">
      <button 
        class="nav-btn-large" 
        on:click={previousMonth}
        aria-label="Previous month"
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      
      <div class="action-buttons">
        <button class="action-btn today-btn" on:click={goToToday} type="button">
          Today
        </button>
        <button class="action-btn clear-btn" on:click={clearMonth} type="button">
          Clear Month
        </button>
      </div>
      
      <button 
        class="nav-btn-large" 
        on:click={nextMonth}
        aria-label="Next month"
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    
    <div class="calendar-grid">
      <div class="weekday-headers">
        {#each weekDays as day}
          <div class="weekday-header">{day}</div>
        {/each}
      </div>
      
      <div class="days-grid">
        {#each calendarDays as dayData (dayData.date.getTime())}
          <CalendarDay
            day={dayData.day}
            date={dayData.date}
            isCurrentMonth={dayData.isCurrentMonth}
            isToday={dayData.isToday}
            isSelected={dayData.isSelected}
            hasData={dayData.hasData}
            on:select={handleDaySelect}
          />
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .calendar-overlay {
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
  
  .calendar-modal {
    background: linear-gradient(180deg, #fef5ee 0%, #f5e6dc 100%);
    border: 3px solid #e8a87c;
    border-radius: 20px;
    padding: 32px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .calendar-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #2c2c2c;
  }
  
  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    color: #666;
    transition: all 0.2s;
    border-radius: 50%;
  }
  
  .close-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #2c2c2c;
  }
  
  .calendar-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .nav-btn-large {
    width: 40px;
    height: 40px;
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
  }
  
  .nav-btn-large:hover {
    background: #d97642;
    color: white;
    border-color: #d97642;
    transform: scale(1.05);
  }
  
  .action-buttons {
    display: flex;
    gap: 12px;
  }
  
  .action-btn {
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid rgba(232, 168, 124, 0.4);
  }
  
  .today-btn {
    background: white;
    color: #d97642;
  }
  
  .today-btn:hover {
    background: #d97642;
    color: white;
    border-color: #d97642;
  }
  
  .clear-btn {
    background: white;
    color: #e74c3c;
    border-color: rgba(231, 76, 60, 0.4);
  }
  
  .clear-btn:hover {
    background: #e74c3c;
    color: white;
    border-color: #e74c3c;
  }
  
  .calendar-grid {
    background: white;
    border-radius: 12px;
    padding: 16px;
    border: 2px solid rgba(232, 168, 124, 0.3);
  }
  
  .weekday-headers {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 12px;
  }
  
  .weekday-header {
    text-align: center;
    font-weight: 700;
    font-size: 12px;
    color: #666;
    padding: 8px 0;
  }
  
  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }
  
  @media (max-width: 768px) {
    .calendar-modal {
      padding: 24px;
    }
    
    .calendar-header h2 {
      font-size: 20px;
    }
    
    .action-buttons {
      flex-direction: column;
      gap: 8px;
    }
    
    .action-btn {
      padding: 6px 12px;
      font-size: 12px;
    }
    
    .weekday-header {
      font-size: 10px;
    }
  }
</style>