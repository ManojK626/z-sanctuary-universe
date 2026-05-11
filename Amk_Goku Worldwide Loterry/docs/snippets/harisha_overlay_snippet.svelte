<div id="harishaAutomationOverlay" class="z-harisha-overlay" aria-live="polite">
  Harisha initializing…
</div>
<script>
  import { onMount } from 'svelte';
  import { harishaAutomation } from '../../stores/harishaAutomationStore.js';

  let overlayEl;

  const updateOverlay = (state) => {
    if (overlayEl) {
      overlayEl.textContent = `Harisha ${state}…`;
    }
  };

  onMount(() => {
    const unsubscribe = harishaAutomation.subscribe((state) => {
      updateOverlay(state);
    });

    return () => {
      unsubscribe();
    };
  });