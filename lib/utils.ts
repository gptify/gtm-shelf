import { PricingModel } from '@/lib/types';

export function hue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 360;
  }
  return h;
}

export function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

export function setupLabel(setup?: number | null): string {
  if (setup === 1) return 'Quick to start';
  if (setup === 2) return 'Some setup';
  if (setup === 3) return 'Needs admin or technical help';
  return 'Not rated';
}

export function setupShort(setup?: number | null): string {
  if (setup === 1) return 'Quick start';
  if (setup === 2) return 'Some setup';
  if (setup === 3) return 'Needs admin';
  return 'Not rated';
}

export function pricingLabel(pricing: PricingModel | string): string {
  if (pricing === 'free_plan' || pricing === 'Free plan') return 'Free plan';
  if (pricing === 'paid' || pricing === 'Paid') return 'Paid';
  return 'Custom quote';
}
