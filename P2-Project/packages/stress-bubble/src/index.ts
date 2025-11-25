// Main exports for the package
export { default as StressBubbleGraph } from './lib/StressBubbleGraph.svelte';
export { default as AddStressorButton } from './lib/AddStressorButton.svelte';
export { default as AddStressorModal } from './lib/AddStressorModal.svelte';
export { default as StressBubble } from './lib/StressBubble.svelte';

// Export types
export type { Stressor, StressData, BubblePosition } from './types';

// Default export for convenience
export { default } from './lib/StressBubbleGraph.svelte';