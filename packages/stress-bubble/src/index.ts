// Main exports for the package
export { default as StressBubbleGraph } from './lib/StressBubbleGraph.svelte';
export { default as AddStressorButton } from './lib/AddStressorButton.svelte';
export { default as AddStressorModal } from './lib/AddStressorModal.svelte';
export { default as StressBubble } from './lib/StressBubble.svelte';
export { default as BubbleDetailModal } from './lib/BubbleDetailModal.svelte';
export { default as Timeline } from './lib/Timeline.svelte';

// Feature #8: Calendar Components
export { default as CalendarButton } from './lib/CalendarButton.svelte';
export { default as CalendarDay } from './lib/CalendarDay.svelte';
export { default as CalendarMonth } from './lib/CalendarMonth.svelte';

// Export types
export type { Stressor, StressData, BubblePosition } from './types.ts';

// Export stores
export { stressData, currentDate, currentStressors, stressActions } from './lib/stores/stressStore.ts';

// Default export for convenience
export { default } from './lib/StressBubbleGraph.svelte';