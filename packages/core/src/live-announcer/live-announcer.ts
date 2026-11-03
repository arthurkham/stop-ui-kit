const ANNOUNCE_DELAY_MS = 100;

let region: HTMLElement | null = null;
let pendingTimer: number | undefined;

function getRegion(): HTMLElement {
  if (region?.isConnected) {
    return region;
  }

  region = document.createElement('div');
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  region.setAttribute('data-sui-live-announcer', '');
  // Visually hidden but still exposed to assistive technology.
  Object.assign(region.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: '0',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    border: '0',
  });
  document.body.append(region);
  return region;
}

/**
 * Announces a message to screen reader users through a shared polite live region.
 *
 * The region is created on first use and kept in the document, because screen readers
 * ignore live regions that appear at the same time as their content. Clearing the text
 * first ensures that repeating the same message is announced again.
 */
export function announce(message: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  const element = getRegion();
  element.textContent = '';
  window.clearTimeout(pendingTimer);
  pendingTimer = window.setTimeout(() => {
    element.textContent = message;
  }, ANNOUNCE_DELAY_MS);
}
