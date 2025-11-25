<script lang="ts">
  import StressBubbleGraph from 'stress-bubble';
  
  // Simulated user ID
  let userId: string | null = 'demo-user-123';
</script>

<svelte:head>
  <title>Stress Bubble Demo</title>
</svelte:head>

<main>
  <div class="demo-header">
    <h1>Stress Bubble Graph</h1>
    <p>Track and visualize your stress levels over time</p>
  </div>
  
  <div class="demo-container">
    <StressBubbleGraph {userId} apiEndpoint="/api/stress-data" />
  </div>
  
  <div class="demo-instructions">
    <h3>How to use:</h3>
    <ol>
      <li>Click the <strong>+</strong> button to add a new stressor</li>
      <li>Enter the stressor name and select intensity (1-5)</li>
      <li>Optionally add notes for context</li>
      <li>Your stress bubbles will appear on the graph</li>
    </ol>
  </div>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  
  .demo-header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .demo-header h1 {
    font-size: 48px;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #000000 0%, #ea7434 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .demo-header p {
    font-size: 18px;
    color: #666;
  }
  
  .demo-container {
    margin-bottom: 40px;
  }
  
  .demo-instructions {
    background: #f8f9fa;
    padding: 24px;
    border-radius: 12px;
    border-left: 4px solid #d97642;
  }
  
  .demo-instructions h3 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #333;
  }
  
  .demo-instructions ol {
    margin: 0;
    padding-left: 24px;
  }
  
  .demo-instructions li {
    margin-bottom: 8px;
    color: #555;
  }
</style>