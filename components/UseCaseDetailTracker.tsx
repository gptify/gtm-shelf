'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { GtmBucket } from '@/lib/types';

interface TrackerProps {
  slug: string;
  bucket: GtmBucket;
}

export function UseCaseDetailTracker({ slug, bucket }: TrackerProps) {
  useEffect(() => {
    trackEvent('use_case_viewed', { slug, bucket });
  }, [slug, bucket]);

  return null;
}

interface StackButtonProps {
  slug: string;
  goal: string;
  buckets: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function UseCaseStackButton({
  slug,
  goal,
  buckets,
  className,
  style,
  children,
}: StackButtonProps) {
  return (
    <Link
      href={`/build-my-stack?goal=${goal}&buckets=${buckets}&use_case=${slug}`}
      onClick={() => {
        trackEvent('use_case_stack_started', { slug, goal });
      }}
      className={className}
      style={style}
    >
      {children}
    </Link>
  );
}

interface ToolLinkProps {
  useCaseSlug: string;
  toolSlug: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function UseCaseToolLink({
  useCaseSlug,
  toolSlug,
  className,
  style,
  children,
}: ToolLinkProps) {
  return (
    <Link
      href={`/tools/${toolSlug}`}
      onClick={() => {
        trackEvent('use_case_tool_clicked', { use_case: useCaseSlug, tool: toolSlug });
      }}
      className={className}
      style={style}
    >
      {children}
    </Link>
  );
}
