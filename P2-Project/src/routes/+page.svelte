<script lang="ts">
  import StressBubbleGraph from 'stress-bubble';
  
  // Simulated user ID
  let userId: string | null = 'demo-user-123';
  
  // State for collapsible instructions
  let showInstructions = false;
  
  function toggleInstructions() {
    showInstructions = !showInstructions;
  }
</script>

<svelte:head>
  <title>Stress Bubble Demo</title>
</svelte:head>

<div class="page-container">
<main>
  <div class="demo-container">
    <StressBubbleGraph {userId} apiEndpoint="/api/stress-data" />
  </div>
  
  <!-- Collapsible Instructions -->
  <div class="instructions-wrapper">
    <button class="instructions-toggle" on:click={toggleInstructions} type="button">
      <span class="toggle-icon" class:expanded={showInstructions}>▶</span>
      How to use this tracker
    </button>
    
    {#if showInstructions}
      <div class="demo-instructions">
        <h3>Getting Started</h3>
        <ol>
          <li>Click the <strong>+</strong> button in the bottom right to add a new stressor</li>
          <li>Enter what's stressing you and select the intensity level (1-5)</li>
          <li>Optionally add notes for context</li>
          <li>Your stress bubbles will appear on the graph</li>
          <li>Click bubbles to view details or adjust stress levels</li>
          <li>Use the timeline to navigate between different dates</li>
          <li>Click the calendar icon to jump to any date</li>
        </ol>
        
        <h3>Tips</h3>
        <ul>
          <li>The size and color of each bubble represents the stress intensity</li>
          <li>Small cells on bubbles can be clicked to reduce stress levels</li>
          <li>Track your stress patterns over time using the calendar view</li>
          <li>Data is saved automatically as you make changes</li>
        </ul>
      </div>
    {/if}
  </div>
</main>
</div>

<style>
  main {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0;
    background: #f5e6dc;
  }

  .page-container {
		min-height: 100vh;
		padding: 2rem;
		background: #e8a87c;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
		position: relative;
	}
  
  .demo-container {
    width: 100%;
  }
  
  .instructions-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px 40px;
  }
  
  .instructions-toggle {
    width: 100%;
    background: white;
    border: 2px solid #e8a87c;
    border-radius: 12px;
    padding: 16px 20px;
    font-size: 16px;
    font-weight: 600;
    color: #2c2c2c;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s ease;
    margin-bottom: 16px;
  }
  
  .instructions-toggle:hover {
    background: rgba(232, 168, 124, 0.1);
    border-color: #d97642;
  }
  
  .toggle-icon {
    font-size: 12px;
    color: #d97642;
    transition: transform 0.2s ease;
    display: inline-block;
  }
  
  .toggle-icon.expanded {
    transform: rotate(90deg);
  }
  
  .demo-instructions {
    background: white;
    padding: 24px;
    border-radius: 12px;
    border: 2px solid #e8a87c;
    animation: slideDown 0.3s ease;
    font-family: BlinkMacSystemFont, -apple-system, sans-serif;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .demo-instructions h3 {
    margin: 0 0 16px 0;
    color: #2c2c2c;
    font-size: 18px;
    font-weight: 700;
  }
  
  .demo-instructions h3:not(:first-child) {
    margin-top: 24px;
  }
  
  .demo-instructions ol,
  .demo-instructions ul {
    margin: 0;
    padding-left: 24px;
  }
  
  .demo-instructions li {
    margin-bottom: 8px;
    color: #555;
    line-height: 1.6;
  }
  
  .demo-instructions li:last-child {
    margin-bottom: 0;
  }
  
  .demo-instructions strong {
    color: #d97642;
    font-weight: 700;
  }
  
  @media (max-width: 768px) {
    .instructions-toggle {
      padding: 14px 16px;
      font-size: 14px;
    }
    
    .demo-instructions {
      padding: 20px;
    }
    
    .demo-instructions h3 {
      font-size: 16px;
    }
    
    .demo-instructions li {
      font-size: 14px;
    }
  }
</style>