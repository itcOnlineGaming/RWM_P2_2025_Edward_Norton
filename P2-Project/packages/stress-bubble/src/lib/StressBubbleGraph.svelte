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
    </div>

    <!-- Feature 3: Add Button (FAB) - Positioned relative to graph container -->
    {#if !showAddModal && !selectedStressor && !showCalendar}
      <div class="fab-container">
        <AddStressorButton on:click={openAddModal} />
      </div>
    {/if}
    
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
  
  /* Graph Container */
  .graph-container {
    position: relative;
    flex: 1;
    background: #fef5ee;
    border: 3px solid #e8a87c;
    border-radius: 20px;
    padding: 40px 20px;
    min-height: 500px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    overflow: visible;
    margin-bottom: 20px;
  }
  
  /* FAB Container */
  .fab-container {
    position: absolute;
    bottom: 40px;
    right: 40px;
    z-index: 100;
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
  
  /* Bubbles Container */
  .bubbles-container {
    width: 100%;
    height: 100%;
    padding: 100px 20px 20px; /* Extra padding at top for timeline */
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    align-content: flex-start;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .stress-bubble-graph {
      min-height: 100vh;
    }
    
    .header h1 {
      font-size: 28px;
    }
    
    .graph-container {
      padding: 32px 16px;
      margin-bottom: 16px;
    }
    
    .bubbles-container {
      padding: 120px 16px 16px;
    }
    
    .fab-container {
      bottom: 32px;
      right: 32px;
    }
  }
</style>