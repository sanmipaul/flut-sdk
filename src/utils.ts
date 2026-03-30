import { MS_PER_BLOCK } from './constants';

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

/**
 * Convert a Stacks block count to a human-readable duration string.
 * Uses the largest applicable unit (years → months → weeks → days → hours → minutes).
 * e.g. 52_560 → "1 year", 1_008 → "1 week", 6 → "1 hour"
 */
export function formatDuration(blocks: number): string {
  if (blocks <= 0) return '0 blocks';

  const totalMinutes = Math.floor((blocks * MS_PER_BLOCK) / 60_000);
  const totalHours   = Math.floor(totalMinutes / 60);
  const totalDays    = Math.floor(totalHours   / 24);
  const totalWeeks   = Math.floor(totalDays    / 7);
  const totalMonths  = Math.floor(totalDays    / 30);
  const totalYears   = Math.floor(totalDays    / 365);

  if (totalYears  >= 1) return `${totalYears} year${totalYears > 1 ? 's' : ''}`;
  if (totalMonths >= 1) return `${totalMonths} month${totalMonths > 1 ? 's' : ''}`;
  if (totalWeeks  >= 1) return `${totalWeeks} week${totalWeeks > 1 ? 's' : ''}`;
  if (totalDays   >= 1) return `${totalDays} day${totalDays > 1 ? 's' : ''}`;
  if (totalHours  >= 1) return `${totalHours} hour${totalHours > 1 ? 's' : ''}`;
  return `${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}`;
}

/**
 * Validate a Stacks principal address (standard or contract).
 * Accepts mainnet (SP, SM) and testnet (ST, SN) prefixes.
 * Contract principals in the form "SP...contract-name" are also accepted.
 */
export function validateAddress(address: string): boolean {
  if (typeof address !== 'string' || address.length === 0) return false;

  // Strip optional contract suffix, e.g. "SP123.my-contract"
  const principal = address.split('.')[0];

  const VALID_PREFIXES = ['SP', 'SM', 'ST', 'SN'];
  if (!VALID_PREFIXES.some((prefix) => principal.startsWith(prefix))) return false;

  // The body after the 2-char prefix must be 20–50 base-58 characters
  const body = principal.slice(2);
  const BASE58_RE = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{20,50}$/;
  return BASE58_RE.test(body);
}
