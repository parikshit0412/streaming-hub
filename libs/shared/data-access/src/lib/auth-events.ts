import { AuthPayload, AuthMessageEventData } from './models';

export const AUTH_EVENT_TYPE = 'STREAMHUB_AUTH';

/**
 * Dispatch authentication payload to all window listeners and iframe targets
 */
export function dispatchAuthEvent(targetWindow: Window, payload: AuthPayload): void {
  const message: AuthMessageEventData = {
    type: AUTH_EVENT_TYPE,
    payload
  };
  targetWindow.postMessage(message, '*');
}

/**
 * Check if current window is embedded within host context (iframe or custom element)
 */
export function isEmbeddedInHost(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).__POWERED_BY_HOST__ || window.parent !== window;
}
