<script lang="ts">
  // Feature #4: Stress Bubble Component
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import type { Stressor } from '../types';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let stressor: Stressor;
  
  // Task #4: Bubble Color Mapping
  const colorMap: Record<number, string> = {
    1: '#9ACD32', // Yellow-green (low stress)
    2: '#FFD700', // Gold
    3: '#FFA500', // Orange
    4: '#FF69B4', // Hot pink
    5: '#E91E63'  // Deep pink (high stress)
  };
  
  // Task #4: Bubble Size Calculation
  const sizeMap: Record<number, number> = {
    1: 80,   // 80px diameter
    2: 100,  // 100px diameter
    3: 120,  // 120px diameter
    4: 140,  // 140px diameter
    5: 160   // 160px diameter
  };
  
  $: bubbleColor = colorMap[stressor.level];
  $: bubbleSize = sizeMap[stressor.level];
  
  // Task #4: Bubble Click Interaction
  function handleBubbleClick() {
    dispatch('click', stressor);
  }

</script>

<!-- Task #4: Bubble Visual Design -->
<div 
  class="stress-bubble"
  style="
    width: {bubbleSize}px;
    height: {bubbleSize}px;
    background: {bubbleColor};
    box-shadow: 0 4px 12px {bubbleColor}40;
  "
  on:click={handleBubbleClick}
  on:keydown={(e) => e.key === 'Enter' && handleBubbleClick()}
  role="button"
  tabindex="0"
  aria-label="Stressor: {stressor.name}, Level {stressor.level}"
  transition:scale={{ duration: 300, start: 0 }}
>
  
  <!-- Stressor Label -->
  <div class="bubble-label">
    <span class="bubble-name">{stressor.name}</span>
    <span class="bubble-level">Lv {stressor.level}</span>
  </div>
</div>

<style>
  /* Task #4: Bubble Visual Styling */
  .stress-bubble {
    position: relative;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 12px;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  /* Task #4: Bubble Click Interaction - Hover Effect */
  .stress-bubble:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
  }
  
  .stress-bubble:active {
    transform: scale(0.98);
  }
  
  .bubble-label {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 4px;
    pointer-events: none;
  }
  
  .bubble-name {
    font-weight: 700;
    font-size: 14px;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    word-wrap: break-word;
    max-width: 100%;
  }
  
  .bubble-level {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
</style>