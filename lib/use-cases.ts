import useCasesData from '@/data/use-cases.json';
import { UseCase, GtmBucket } from '@/lib/types';

export function getAllUseCases(): UseCase[] {
  return useCasesData as UseCase[];
}

export function getUseCaseBySlug(slug: string): UseCase | undefined {
  return (useCasesData as UseCase[]).find((uc) => uc.slug === slug);
}

export function getUseCasesByBucket(bucket: GtmBucket): UseCase[] {
  return (useCasesData as UseCase[]).filter((uc) => uc.bucket === bucket);
}

export function getUseCasesForTool(toolSlug: string): UseCase[] {
  return (useCasesData as UseCase[]).filter(
    (uc) =>
      uc.primary_tool_slugs.includes(toolSlug) ||
      uc.alternative_tool_slugs.includes(toolSlug)
  );
}
