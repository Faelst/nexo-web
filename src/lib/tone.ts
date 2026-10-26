import type { Tone } from '@/models/entities/tone'

/** Classes Tailwind de cada tom semântico. Strings completas para o scanner do Tailwind. */
export const toneStyles: Record<Tone, { dot: string; text: string; soft: string }> = {
  warning: { dot: 'bg-warning', text: 'text-warning-text', soft: 'bg-warning-soft' },
  primary: { dot: 'bg-primary', text: 'text-primary-text', soft: 'bg-primary-soft' },
  cta: { dot: 'bg-cta', text: 'text-primary-text', soft: 'bg-primary-soft' },
  success: { dot: 'bg-success', text: 'text-success-text', soft: 'bg-success-soft' },
  danger: { dot: 'bg-danger', text: 'text-danger-text', soft: 'bg-danger-soft' },
  neutral: { dot: 'bg-muted-dot', text: 'text-ink-3', soft: 'bg-desk' },
}
