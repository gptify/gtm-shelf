// Privacy-first, cookieless analytics helper for GTMShelf
// Supports Plausible Analytics and event attribution via non-sensitive UTMs

export type AnalyticsEvent =
  | 'stack_started'
  | 'stack_completed'
  | 'tool_viewed'
  | 'vendor_clicked'
  | 'affiliate_clicked'
  | 'comparison_viewed'
  | 'newsletter_cta_clicked'
  | 'stack_shared'
  | 'intro_requested'
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
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void;
  }
}

/**
 * Extracts non-sensitive campaign UTM parameters safely from current URL.
 * Never captures personal data or free-text fields.
 */
export function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    const allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    allowed.forEach((key) => {
      const val = params.get(key);
      if (val && val.length < 100) {
        utm[key] = val;
      }
    });
    return utm;
  } catch {
    return {};
  }
}

/**
 * Tracks an analytics event with non-sensitive metadata and UTM attribution.
 */
export function trackEvent(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined') return;

  try {
    const utms = getUtmParams();
    const mergedProps = {
      ...utms,
      ...props,
    };

    if (typeof window.plausible === 'function') {
      window.plausible(event, { props: mergedProps });
      return;
    }

    // In local development or fallback mode, log for verification
    if (process.env.NODE_ENV === 'development' || typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.debug(`[Analytics Event: ${event}]`, mergedProps);
    }
  } catch {
    // Fail silently so UI interactions are never blocked
  }
}
