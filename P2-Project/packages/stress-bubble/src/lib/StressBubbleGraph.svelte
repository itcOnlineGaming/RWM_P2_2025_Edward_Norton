<script lang="ts">
  // Main container component - Feature #1: Stress Bubble Graph
  // Feature #7: Compact Timeline Navigation (Top-Left)
  // Feature #8: Calendar Modal
  import { onMount } from 'svelte';
  import { stressData as stressDataStore, currentDate as currentDateStore, stressActions } from './stores/stressStore.ts';
  import AddStressorButton from './AddStressorButton.svelte';
  import AddStressorModal from './AddStressorModal.svelte';
  import StressBubble from './StressBubble.svelte';
  import BubbleDetailModal from './BubbleDetailModal.svelte';
  import Timeline from './Timeline.svelte';
  import CalendarMonth from './CalendarMonth.svelte';
  import type { Stressor, StressData } from '../types.ts';
  
  // Props
  export let userId: string | null = null; // For authenticated users
  export let apiEndpoint: string = '/api/stress-data'; // For data persistence
  
  // State
  let showAddModal = false;
  let selectedStressor: Stressor | null = null;
  let showCalendar = false;
  let isLoading = false;
  let showMaxWarning = false;
  
  // Constants
  const MAX_STRESSORS_PER_DAY = 5;
  
  // Subscribe to stores
  let stressData: StressData;
  let currentDate: string;
  
  stressDataStore.subscribe(value => {
    stressData = value;
  });
  
  currentDateStore.subscribe(value => {
    currentDate = value;
  });
  
  // Computed
  $: currentStressors = stressData[currentDate] || [];
  $: isEmpty = currentStressors.length === 0;
  $: isAtMaxCapacity = currentStressors.length >= MAX_STRESSORS_PER_DAY;
  
  onMount(() => {
    loadStressData();
  });
  
  async function loadStressData() {
    if (!userId) {
      // Load from localStorage for non-authenticated users
      const stored = localStorage.getItem('stress-bubble-data');
      if (stored) {
        stressActions.loadData(JSON.parse(stored));
      }
      return;
    }
    
    // Load from API for authenticated users
    isLoading = true;
    try {
      const response = await fetch(`${apiEndpoint}?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        stressActions.loadData(data);
      }
    } catch (error) {
      console.error('Failed to load stress data:', error);
    } finally {
      isLoading = false;
    }
  }
  
  async function saveStressData() {
    if (!userId) {
      // Save to localStorage
      localStorage.setItem('stress-bubble-data', JSON.stringify(stressData));
      return;
    }
    
    // Save to API
    try {
      await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, data: stressData })
      });
    } catch (error) {
      console.error('Failed to save stress data:', error);
    }
  }
  
  // Handle adding a new stressor
  function handleAddStressor(event: CustomEvent<Omit<Stressor, 'id' | 'createdAt'>>) {
    const newStressor: Stressor = {
      ...event.detail,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    
    stressActions.addStressor(currentDate, newStressor);
    saveStressData();
    showAddModal = false;
  }

  function handleBubbleClick(event: CustomEvent<Stressor>) {
    selectedStressor = event.detail;
  }

  // Feature #7: Timeline date change
  function handleDateChange(event: CustomEvent<string>) {
    stressActions.setDate(event.detail);
  }

  // Remove cell from bubble
  function handleRemoveCell(event: CustomEvent<{ stressorId: string; cellIndex: number }>) {
    const { stressorId } = event.detail;
    const stressor = currentStressors.find(s => s.id === stressorId);
    
    if (!stressor) return;
    
    if (stressor.level === 1) {
      // Delete entire stressor when last cell removed
      handleDeleteStressor(stressorId);
      return;
    }
    
    // Reduce level by 1
    const newLevel = Math.max(1, stressor.level - 1) as 1 | 2 | 3 | 4 | 5;
    handleUpdateLevel({ detail: { id: stressorId, level: newLevel } } as CustomEvent);
  }

  // Update stress level
  function handleUpdateLevel(event: CustomEvent<{ id: string; level: 1 | 2 | 3 | 4 | 5 }>) {
    const { id, level } = event.detail;
    
    stressActions.updateStressor(currentDate, id, { level });
    saveStressData();
    
    // Update selected stressor if it's the one being edited
    if (selectedStressor?.id === id) {
      selectedStressor = { ...selectedStressor, level };
    }
  }

  // Update notes
  function handleUpdateNotes(event: CustomEvent<{ id: string; notes?: string }>) {
    const { id, notes } = event.detail;
    
    stressActions.updateStressor(currentDate, id, { notes });
    saveStressData();
    
    // Update selected stressor if it's the one being edited
    if (selectedStressor?.id === id) {
      selectedStressor = { ...selectedStressor, notes };
    }
  }
  
  // Delete stressor
  function handleDeleteStressor(stressorId: string) {
    stressActions.deleteStressor(currentDate, stressorId);
    saveStressData();
    selectedStressor = null;
  }
  
  // Show/Hide Add Modal
  function openAddModal() {
    if (isAtMaxCapacity) {
      showMaxWarning = true;
      return;
    }
    showAddModal = true;
  }
  
  function closeAddModal() {
    showAddModal = false;
  }

  // Close Detail Modal
  function closeDetailModal() {
    selectedStressor = null;
  }
  
  // Feature #8: Calendar Modal
  function openCalendar() {
    showCalendar = true;
  }
  
  function closeCalendar() {
    showCalendar = false;
  }
  
  function handleCalendarDateSelect(event: CustomEvent<string>) {
    stressActions.setDate(event.detail);
    closeCalendar();
  }
  
  function handleClearMonth(event: CustomEvent<{ year: number; month: number }>) {
    const { year, month } = event.detail;
    
    // Clear all dates in the specified month
    const updates = { ...stressData };
    Object.keys(updates).forEach(dateStr => {
      const date = new Date(dateStr);
      if (date.getFullYear() === year && date.getMonth() === month) {
        delete updates[dateStr];
      }
    });
    
    stressDataStore.set(updates);
    saveStressData();
  }
</script>

<div class="stress-bubble-graph">
  <!-- Header -->
  <div class="header">
    <h1>Stress Bubble Tracker</h1>
    <p>Track and manage your stress levels over time</p>
  </div>
  
  <!-- Main Container -->
  <div class="main-container">
    <!-- Graph Container (Timeline is positioned absolute inside) -->
    <div class="graph-container">
      <!-- Feature #7: Compact Timeline (Top-Left) -->
      <Timeline 
        currentDate={currentDate}
        stressData={stressData}
        on:dateChange={handleDateChange}
        on:openCalendar={openCalendar}
      />
      
      <!-- Max Stressors Warning Modal -->
      {#if showMaxWarning}
        <div class="warning-modal-overlay" on:click={() => showMaxWarning = false}>
          <div class="warning-modal" on:click|stopPropagation>
            <div class="warning-icon">⚠️</div>
            <h3>Maximum Stressors Reached</h3>
            <p>You can only track up to 5 stressors per day.</p>
            <p>Please remove an existing stressor to add a new one.</p>
            <button class="btn-warning-ok" on:click={() => showMaxWarning = false} type="button">
              Got it
            </button>
          </div>
        </div>
      {/if}
      
      {#if isLoading}
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading stress data...</p>
        </div>
      {:else if isEmpty}
        <div class="empty-state">
          <h2>No stressors tracked yet</h2>
          <p>Start tracking your stress levels by adding your first stressor</p>
          <p>Click the (+) button to begin</p>
        </div>
      {:else}
        <div class="bubbles-container">
          {#each currentStressors as stressor (stressor.id)}
            <StressBubble 
              {stressor}
              on:click={handleBubbleClick}
              on:removeCell={handleRemoveCell}
            />
          {/each}
        </div>
      {/if}
      
      <!-- FAB MOVED INSIDE GRAPH CONTAINER -->
      {#if !showAddModal && !selectedStressor && !showCalendar}
        <AddStressorButton 
          disabled={isAtMaxCapacity}
          on:click={openAddModal} 
        />
      {/if}
    </div>
    
    <!-- Feature 4: Add Stressor Modal -->
    {#if showAddModal}
      <AddStressorModal 
        on:submit={handleAddStressor}
        on:cancel={closeAddModal}
      />
    {/if}

    <!-- Feature #6: Bubble Detail Modal -->
    {#if selectedStressor}
      <BubbleDetailModal 
        stressor={selectedStressor}
        on:updateLevel={handleUpdateLevel}
        on:updateNotes={handleUpdateNotes}
        on:delete={(e) => handleDeleteStressor(e.detail)}
        on:close={closeDetailModal}
      />
    {/if}
    
    <!-- Feature #8: Calendar Modal -->
    {#if showCalendar}
      <CalendarMonth
        currentDate={currentDate}
        stressData={stressData}
        on:selectDate={handleCalendarDateSelect}
        on:clearMonth={handleClearMonth}
        on:close={closeCalendar}
      />
    {/if}
  </div>
</div>

<style>
  .stress-bubble-graph {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #f5e6dc;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  /* Header */
  .header {
    text-align: center;
    padding: 40px 20px 20px;
    background: transparent;
  }
  
  .header h1 {
    font-size: 32px;
    font-weight: 700;
    color: #2c2c2c;
    margin: 0 0 8px 0;
  }
  
  .header p {
    font-size: 16px;
    color: #5c5c5c;
    margin: 0;
  }
  
  /* Main Container */
  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 20px 40px;
    box-sizing: border-box;
  }
  
  /* Graph Container - FIXED: Contains FAB inside */
  .graph-container {
    position: relative;
    flex: 1;
    background: #fef5ee;
    border: 3px solid #e8a87c;
    border-radius: 20px;
    padding: 40px 20px;
    min-height: 600px; /* Increased min-height */
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden; /* Changed from visible to hidden to contain FAB */
    margin-bottom: 20px;
  }
  
  /* Warning Modal */
  .warning-modal-overlay {
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
    backdrop-filter: blur(4px);
  }
  
  .warning-modal {
    background: linear-gradient(180deg, #fff5f0 0%, #ffe6dc 100%);
    border: 3px solid #ff8c42;
    border-radius: 20px;
    padding: 32px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  }
  
  .warning-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .warning-modal h3 {
    margin: 0 0 16px 0;
    font-size: 22px;
    font-weight: 700;
    color: #d97642;
  }
  
  .warning-modal p {
    margin: 0 0 12px 0;
    font-size: 15px;
    color: #5c5c5c;
    line-height: 1.6;
  }
  
  .warning-modal p:last-of-type {
    margin-bottom: 24px;
  }
  
  .btn-warning-ok {
    background: linear-gradient(135deg, #d97642 0%, #c85a2d 100%);
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(217, 118, 66, 0.3);
  }
  
  .btn-warning-ok:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(217, 118, 66, 0.4);
  }
  
  /* Empty State */
  .empty-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 90%;
    max-width: 400px;
  }
  
  .empty-state h2 {
    font-size: 24px;
    font-weight: 600;
    color: #2c2c2c;
    margin: 0 0 12px 0;
  }
  
  .empty-state p {
    font-size: 16px;
    color: #666;
    margin: 0 0 8px 0;
    line-height: 1.5;
  }
  
  /* Loading State */
  .loading-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #d97642;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Bubbles Container - FIXED: Better centering and spacing */
  .bubbles-container {
    width: 100%;
    height: 100%;
    padding: 140px 20px 100px; /* More top padding for timeline, more bottom for FAB */
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    align-content: center;
    min-height: 500px;
  }
  
  /* Responsive - MOBILE FIXES */
  @media (max-width: 768px) {
    .header h1 {
      font-size: 24px;
    }
    
    .header p {
      font-size: 14px;
    }
    
    .main-container {
      padding: 0 12px 24px;
    }
    
    .graph-container {
      padding: 24px 12px;
      min-height: calc(100vh - 200px);
      margin-bottom: 16px;
    }
    
    .bubbles-container {
      padding: 180px 12px 100px; /* More padding on mobile for timeline */
      gap: 16px;
    }
  }
  
  /* Extra small devices */
  @media (max-width: 480px) {
    .header {
      padding: 24px 16px 16px;
    }
    
    .header h1 {
      font-size: 22px;
    }
    
    .header p {
      font-size: 13px;
    }
    
    .graph-container {
      padding: 20px 10px;
      border-radius: 16px;
    }
    
    .bubbles-container {
      padding: 200px 8px 100px;
      gap: 12px;
    }
  }
</style>