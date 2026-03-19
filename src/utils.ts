/** Convert micro-STX to STX */
export function microToStx(micro: number | bigint): number {
  return Number(micro) / 1_000_000;
}

/** Convert STX to micro-STX */
export function stxToMicro(stx: number): bigint {
  return BigInt(Math.round(stx * 1_000_000));
}

/**
 * Truncate a Stacks principal address for display.
 * e.g. "SP2J6Z…V9EJ"
 */
export function truncateAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}

/**
 * Format a micro-STX amount as a human-readable STX string.
 * e.g. 1_500_000 → "1.5 STX"
 */
export function formatStx(micro: number | bigint, decimals = 6): string {
  const stx = microToStx(micro);
  return `${parseFloat(stx.toFixed(decimals))} STX`;
}
