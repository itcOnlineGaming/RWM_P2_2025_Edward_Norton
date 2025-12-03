<script lang="ts">
  // Feature #4: Stress Bubble Component
  // Feature #5: Bubble Cells
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import type { Stressor } from '../types.ts';
  
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
  $: cellSize = bubbleSize * 0.22; // Task #5: Cell size is 22% of main bubble (slightly bigger)
  
  // Task #5: Cell Bubble Generation
  $: cells = Array.from({ length: stressor.level }, (_, i) => ({
    id: `${stressor.id}-cell-${i}`,
    index: i
  }));
  
  // Task #5: Cell Positioning Algorithm - Uniform with center avoidance
  function getCellPosition(index: number, total: number) {
    const maxRadius = (bubbleSize / 2) - (cellSize / 2) - 6; // Keep cells inside boundary
    const minRadius = bubbleSize * 0.35; // Keep cells away from center (35% from center)
    
    if (total === 1) {
      // Single cell - place at top
      const angle = -Math.PI / 2; // Top position
      const radius = (minRadius + maxRadius) / 2; // Mid-range radius
      const x = (bubbleSize / 2) + (radius * Math.cos(angle));
      const y = (bubbleSize / 2) + (radius * Math.sin(angle));
      return { x, y };
    }
    
    // For multiple cells, distribute evenly around a circle
    // Start from top (-90 degrees) and distribute evenly
    const baseAngle = -Math.PI / 2; // Start from top
    const angleStep = (2 * Math.PI) / total; // Evenly distribute
    const angle = baseAngle + (index * angleStep);
    
    // Use stressor ID to add slight randomness to radius for organic look
    const seed = stressor.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pseudoRandom = (n: number) => {
      const x = Math.sin(seed + n * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    
    // Vary radius slightly between 0.7 and 1.0 of available range for organic look
    const radiusRange = maxRadius - minRadius;
    const radiusVariation = 0.7 + (pseudoRandom(index) * 0.3); // 0.7 to 1.0
    const radius = minRadius + (radiusRange * radiusVariation);
    
    const x = (bubbleSize / 2) + (radius * Math.cos(angle));
    const y = (bubbleSize / 2) + (radius * Math.sin(angle));
    
    return { x, y };
  }
  
  // Task #4: Bubble Click Interaction
  function handleBubbleClick() {
    dispatch('click', stressor);
  }
  
  // Task #5: Cell Removal Interaction
  function handleCellClick(event: MouseEvent, cellIndex: number) {
    event.stopPropagation(); // Don't trigger bubble click
    dispatch('removeCell', { stressorId: stressor.id, cellIndex });
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
  <!-- Task #5: Cell Bubbles -->
  {#each cells as cell (cell.id)}
    {@const pos = getCellPosition(cell.index, cells.length)}
    <div
      class="cell-bubble"
      style="
        width: {cellSize}px;
        height: {cellSize}px;
        left: {pos.x - cellSize / 2}px;
        top: {pos.y - cellSize / 2}px;
      "
      on:click={(e) => handleCellClick(e, cell.index)}
      on:keydown={(e) => e.key === 'Enter' && handleCellClick(e, cell.index)}
      role="button"
      tabindex="0"
      aria-label="Remove cell {cell.index + 1}"
      transition:scale={{ duration: 300 }}
    >
      <span class="cell-remove-icon">×</span>
    </div>
  {/each}
  
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
  
  /* Task #5: Cell Bubble Styling */
  .cell-bubble {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
  
  /* Task #5: Cell Removal Interaction - Hover */
  .cell-bubble:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.15);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .cell-remove-icon {
    opacity: 0;
    font-size: 14px;
    font-weight: bold;
    color: #d97642;
    transition: opacity 0.2s ease;
  }
  
  .cell-bubble:hover .cell-remove-icon {
    opacity: 1;
  }
  
  /* Mobile touch optimization */
  @media (max-width: 768px) {
    .cell-remove-icon {
      opacity: 0.5;
    }
    
    .cell-bubble:active .cell-remove-icon {
      opacity: 1;
    }
  }
</style>