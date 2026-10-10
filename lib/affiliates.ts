// Centralized Affiliate & Outbound Link Management for GTMShelf
// Governs vendor destination URLs, partner links, approval status, and disclosures.

export interface AffiliateRecord {
  toolId: string;
  toolSlug: string;
  vendorName: string;
  destinationUrl: string; // Direct official vendor website
  affiliateUrl?: string; // Approved partner URL
  programStatus: 'active' | 'pending' | 'direct' | 'inactive';
  approvedForGTMShelf: boolean; // Confirmed approval for GTMShelf as promotional property
  lastVerifiedDate: string; // YYYY-MM-DD
  disclosureRequired: boolean;
  notes?: string;
}

export const STANDARD_AFFILIATE_DISCLOSURE =
  'Some links may be affiliate links. GTM Shelf may earn a commission from qualifying purchases at no additional cost to you. Commercial relationships do not determine our independent recommendations.';

export const AFFILIATE_REGISTRY: Record<string, AffiliateRecord> = {
  'adcreative-ai': {
    toolId: 'adcreative-ai',
    toolSlug: 'adcreative-ai',
    vendorName: 'AdCreative.ai',
    destinationUrl: 'https://adcreative.ai',
    affiliateUrl: 'https://free-trial.adcreative.ai/jb870cr6hwhe',
    programStatus: 'active',
    approvedForGTMShelf: true,
    lastVerifiedDate: '2026-10-09',
    disclosureRequired: true,
  },
  'seamless-ai': {
    toolId: 'seamless-ai',
    toolSlug: 'seamless-ai',
    vendorName: 'Seamless.AI',
    destinationUrl: 'https://seamless.ai',
    affiliateUrl: 'https://get.seamless.ai/wxur32uh7xzb',
    programStatus: 'active',
    approvedForGTMShelf: true,
    lastVerifiedDate: '2026-10-09',
    disclosureRequired: true,
  },
  'lemlist': {
    toolId: 'lemlist',
    toolSlug: 'lemlist',
    vendorName: 'lemlist',
    destinationUrl: 'https://lemlist.com',
    affiliateUrl: 'https://get.lemlist.com/9wfnrv5mceyj',
    programStatus: 'active',
    approvedForGTMShelf: true,
    lastVerifiedDate: '2026-10-09',
    disclosureRequired: true,
  },
  'instantly': {
    toolId: 'instantly',
    toolSlug: 'instantly',
    vendorName: 'Instantly',
    destinationUrl: 'https://instantly.ai',
    affiliateUrl: 'https://refer.instantly.ai/7pwwq1hkoudw',
    programStatus: 'active',
    approvedForGTMShelf: true,
    lastVerifiedDate: '2026-10-09',
    disclosureRequired: true,
  },
  'apollo': {
    toolId: 'apollo',
    toolSlug: 'apollo',
    vendorName: 'Apollo.io',
    destinationUrl: 'https://apollo.io',
    affiliateUrl: 'https://get.apollo.io/yy5q6cfw7xi5',
    programStatus: 'active',
    approvedForGTMShelf: true,
    lastVerifiedDate: '2026-10-09',
    disclosureRequired: true,
  },
  'meetgeek': {
    toolId: 'meetgeek',
    toolSlug: 'meetgeek',
    vendorName: 'MeetGeek',
    destinationUrl: 'https://meetgeek.ai',
    affiliateUrl: 'https://get.meetgeek.ai/uy8dxc8l9prm',
    programStatus: 'active',
    approvedForGTMShelf: true,
    lastVerifiedDate: '2026-10-09',
    disclosureRequired: true,
  },
  'manychat': {
    toolId: 'manychat',
    toolSlug: 'manychat',
    vendorName: 'Manychat',
    destinationUrl: 'https://manychat.com',
    affiliateUrl: 'https://manychat.partnerlinks.io/gopygbhk9cau',
    programStatus: 'active',
    approvedForGTMShelf: true,
    lastVerifiedDate: '2026-10-09',
    disclosureRequired: true,
  },
  'gamma': {
    toolId: 'gamma',
    toolSlug: 'gamma',
    vendorName: 'Gamma',
    destinationUrl: 'https://gamma.app',
    affiliateUrl: 'https://try.gamma.app/phx9znt88tpu',
    programStatus: 'active',
    approvedForGTMShelf: true,
    lastVerifiedDate: '2026-10-09',
    disclosureRequired: true,
  },
  'descript': {
    toolId: 'descript',
    toolSlug: 'descript',
    vendorName: 'Descript',
    destinationUrl: 'https://descript.com',
    affiliateUrl: 'https://get.descript.com/turigheoz1eq',
    programStatus: 'active',
    approvedForGTMShelf: true,
    lastVerifiedDate: '2026-10-09',
    disclosureRequired: true,
  },
  'beautiful-ai': {
    toolId: 'beautiful-ai',
    toolSlug: 'beautiful-ai',
    vendorName: 'Beautiful.ai',
    destinationUrl: 'https://beautiful.ai',
    affiliateUrl: 'https://beautifulai.partnerlinks.io/rvvr8zuu35ig',
    programStatus: 'active',
    approvedForGTMShelf: true,
    lastVerifiedDate: '2026-10-09',
    disclosureRequired: true,
  },
  'mindstudio': {
    toolId: 'mindstudio',
    toolSlug: 'mindstudio',
    vendorName: 'MindStudio',
    destinationUrl: 'https://mindstudio.ai',
    affiliateUrl: 'https://get.mindstudio.ai/1eqeupsiig0i',
    programStatus: 'active',
    approvedForGTMShelf: true,
    lastVerifiedDate: '2026-10-09',
    disclosureRequired: true,
  },
  'lindy': {
    toolId: 'lindy',
    toolSlug: 'lindy',
    vendorName: 'Lindy',
    destinationUrl: 'https://lindy.ai',
    affiliateUrl: 'https://try.lindy.ai/9jnuq63xr11e',
    programStatus: 'active',
    approvedForGTMShelf: true,
    lastVerifiedDate: '2026-10-09',
    disclosureRequired: true,
  },
  'calilio': {
    toolId: 'calilio',
    toolSlug: 'calilio',
    vendorName: 'Calilio',
    destinationUrl: 'https://calilio.com',
    affiliateUrl: 'https://try.calilio.com/yvlkop2jok4w',
    programStatus: 'active',
    approvedForGTMShelf: true,
    lastVerifiedDate: '2026-10-09',
    disclosureRequired: true,
  },
};

export interface OutboundLinkInfo {
  targetUrl: string;
  isAffiliate: boolean;
  rel: string;
  vendorName: string;
  disclosureRequired: boolean;
}

/**
 * Resolves the outbound link for a given tool.
 * Only returns affiliate URL if GTMShelf approval is confirmed and status is active.
 */
export function getOutboundLinkInfo(toolSlug: string, fallbackUrl?: string): OutboundLinkInfo {
  const record = AFFILIATE_REGISTRY[toolSlug];

  if (record && record.approvedForGTMShelf && record.programStatus === 'active' && record.affiliateUrl) {
    return {
      targetUrl: record.affiliateUrl,
      isAffiliate: true,
      rel: 'sponsored noopener noreferrer',
      vendorName: record.vendorName,
      disclosureRequired: record.disclosureRequired,
    };
  }

  // Fallback to normal clean vendor website
  const target = record?.destinationUrl || fallbackUrl || `https://${toolSlug}.com`;
  return {
    targetUrl: target,
    isAffiliate: false,
    rel: 'noopener noreferrer',
    vendorName: record?.vendorName || toolSlug,
    disclosureRequired: false,
  };
}
