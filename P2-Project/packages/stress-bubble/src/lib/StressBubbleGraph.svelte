<script lang="ts">
  // Main container component - Feature #1: Stress Bubble Graph
  // Feature #7: Compact Timeline Navigation (Top-Right)
  import { onMount } from 'svelte';
  import { stressData as stressDataStore, currentDate as currentDateStore, stressActions } from './stores/stressStore.ts';
  import AddStressorButton from './AddStressorButton.svelte';
  import AddStressorModal from './AddStressorModal.svelte';
  import StressBubble from './StressBubble.svelte';
  import BubbleDetailModal from './BubbleDetailModal.svelte';
  import Timeline from './Timeline.svelte';
  import type { Stressor, StressData } from '../types.ts';
  
  // Props
  export let userId: string | null = null; // For authenticated users
  export let apiEndpoint: string = '/api/stress-data'; // For data persistence
  
  // State
  let showAddModal = false;
  let selectedStressor: Stressor | null = null;
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
</script>

<div class="stress-bubble-graph">
  <!-- Header -->
  <div class="header">
    <h1>You seem stressed</h1>
    <p>Track and manage your stress levels</p>
  </div>
  
  <!-- Main Container -->
  <div class="main-container">
    <!-- Graph Container (Timeline is positioned absolute inside) -->
    <div class="graph-container">
      <!-- Feature #7: Compact Timeline (Top-Right) -->
      <Timeline 
        currentDate={currentDate}
        stressData={stressData}
        on:dateChange={handleDateChange}
      />
      
      {#if isLoading}
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading stress data...</p>
        </div>
      {:else if isEmpty}
        <div class="empty-state">
          <h2>No stressors tracked yet</h2>
          <p>It's important to stay mindful, let's track your stress</p>
          <p>Press the (+) in the bottom right to begin</p>
        </div>
      {:else}
        <!--Feature 4 and & 5, Stress Bubbles-->
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

    <!-- Feature 3: Add Button (FAB) -->
    <AddStressorButton on:click={openAddModal} />
    
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
  </div>
</div>

<style>
  .stress-bubble-graph {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(180deg, #f5e6dc 0%, #e8d4c4 100%);
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
    padding: 0 20px 20px;
  }
  
  /* Graph Container (with relative positioning for absolute timeline) */
  .graph-container {
    position: relative;
    flex: 1;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    padding: 40px 20px;
    min-height: 500px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
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
    margin: 0;
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
    padding-top: 60px; /* Space for timeline at top */
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
    }
    
    .bubbles-container {
      padding-top: 70px; /* More space on mobile for timeline */
    }
  }
</style>