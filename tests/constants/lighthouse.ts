import { desktopConfig } from 'lighthouse'

export const LIGHTHOUSE_PORT = 9222

export const LIGHTHOUSE_THRESHOLDS = {
  performance: 20,
  accessibility: 80,
  'best-practices': 90,
  seo: 80,
  pwa: undefined,
}

export const LIGHTHOUSE_CONFIGS = {
  ...desktopConfig,
}
