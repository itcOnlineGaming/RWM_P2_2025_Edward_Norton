<script lang="ts">
    // Main container component - Feature #1: Stress Bubble Graph
  import { onMount } from 'svelte';
  
  // Props
  export let userId: string | null = null; // For authenticated users
  export let apiEndpoint: string = '/api/stress-data'; // For data persistence
  
  // State
  let stressData: StressData = {};
  let currentDate: string = new Date().toISOString().split('T')[0];
  let showAddModal = false;
  let isLoading = false;
  
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
        stressData = JSON.parse(stored);
      }
      return;
    }
    
    // Load from API for authenticated users
    isLoading = true;
    try {
      const response = await fetch(`${apiEndpoint}?userId=${userId}`);
      if (response.ok) {
        stressData = await response.json();
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
    
</script>

<div class="stress-bubble-graph">
  <!-- Header -->
  <div class="header">
    <h1>You seem stressed</h1>
    <p>Track and manage your stress levels</p>
  </div>
  
  <!-- Main Container -->
  <div class="main-container">
    <!-- Timeline -->
    <div class="timeline">
      <span class="date-display">
        {currentDate === new Date().toISOString().split('T')[0] ? 'Today' : currentDate}
      </span>
    </div>
    
    <!-- Graph Container -->
    <div class="graph-container">
      {#if isLoading}
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading stress data...</p>
        </div>
      {:else if isEmpty}
        <div class="empty-state">
          <h2>No stressors tracked yet</h2>
          <p>It's important to stay mindful, let's track your stress</p>
        </div>
      {:else}
        <div class="bubbles-container">
          {#each currentStressors as stressor (stressor.id)}
            <div class="bubble-placeholder">
              {stressor.name} (Level {stressor.level})
            </div>
          {/each}
        </div>
      {/if}
    </div>
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
    max-width: 640px;
    width: 100%;
    margin: 0 auto;
    padding: 0 20px 20px;
  }
  
  /* Timeline */
  .timeline {
    padding: 16px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 12px 12px 0 0;
    text-align: center;
    backdrop-filter: blur(10px);
  }
  
  .date-display {
    font-weight: 600;
    font-size: 16px;
    color: #2c2c2c;
  }
  
  /* Graph Container */
  .graph-container {
    flex: 1;
    position: relative;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 0 0 20px 20px;
    padding: 40px 20px;
    min-height: 400px;
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
  
  .illustration {
    position: relative;
    width: 100%;
    height: 200px;
    margin-bottom: 30px;
    background: linear-gradient(180deg, #d97642 0%, #c85a2d 100%);
    border-radius: 20px;
    overflow: hidden;
  }
  
  .sun {
    position: absolute;
    bottom: 40%;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 80px;
    background: #ffd89b;
    border-radius: 50%;
    box-shadow: 0 0 40px rgba(255, 216, 155, 0.6);
  }
  
  .waves {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 45%;
    background: #5b9dd6;
  }
  
  .wave {
    position: absolute;
    bottom: 0;
    left: -100%;
    width: 300%;
    height: 100%;
    background: rgba(91, 157, 214, 0.4);
    border-radius: 50%;
    animation: wave 8s infinite linear;
  }
  
  .wave:nth-child(2) {
    animation-delay: -2s;
    opacity: 0.7;
  }
  
  .wave:nth-child(3) {
    animation-delay: -4s;
    opacity: 0.5;
  }
  
  @keyframes wave {
    0% {
      transform: translateX(0) translateY(0);
    }
    50% {
      transform: translateX(25%) translateY(-10px);
    }
    100% {
      transform: translateX(50%) translateY(0);
    }
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
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    align-content: flex-start;
  }
  
  .bubble-placeholder {
    display: inline-block;
    padding: 12px 20px;
    background: linear-gradient(135deg, #d97642 0%, #c85a2d 100%);
    color: white;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(217, 118, 66, 0.3);
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .stress-bubble-graph {
      min-height: 100vh;
    }
    
    .header h1 {
      font-size: 28px;
    }
    
    .illustration {
      height: 160px;
    }
    
    .sun {
      width: 60px;
      height: 60px;
    }
  }
</style>