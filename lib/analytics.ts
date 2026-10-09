// Privacy-first, cookieless analytics helper for GTM Shelf
// Compliant with Section 11 of docs/01_BUILD_BRIEF.md

export type AnalyticsEvent =
  | 'finder_started'
  | 'finder_completed'
  | 'finder_custom_click'
  | 'tool_detail_open'
  | 'tool_visit'
  | 'guide_view'
  | 'submit_tool'
  | 'custom_request'
  | 'lead_confirmed';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

export function trackEvent(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.plausible === 'function') {
      window.plausible(event, { props });
      return;
    }

    // In local development or when Plausible is not connected, log in debug mode
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[Analytics Event]', event, props);
    }
  } catch {
    // Fail silently so user interactions are never blocked
  }
}
