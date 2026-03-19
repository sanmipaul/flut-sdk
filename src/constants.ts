/** Preset lock durations expressed in Stacks blocks (~10 min/block) */
export const DURATION_PRESETS: { label: string; blocks: number }[] = [
  { label: '1 week', blocks: 1_008 },
  { label: '1 month', blocks: 4_320 },
  { label: '3 months', blocks: 12_960 },
  { label: '6 months', blocks: 25_920 },
  { label: '1 year', blocks: 52_560 },
];

/** Minimum lock duration — approximately 1 day */
export const MIN_LOCK_BLOCKS = 144;

/** Maximum lock duration — approximately 5 years */
export const MAX_LOCK_BLOCKS = 262_800;

/** Minimum vault deposit in STX */
export const MIN_AMOUNT_STX = 1;

/** Maximum vault deposit in STX (contract limit per transaction) */
export const MAX_AMOUNT_STX = 1_000;

/** Milliseconds per Stacks block (~10 minutes, anchored to Bitcoin) */
export const MS_PER_BLOCK = 10 * 60 * 1_000;
