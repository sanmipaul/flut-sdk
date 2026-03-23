import { MS_PER_BLOCK } from '../constants';

export interface Vault {
  vaultId: number;
  creator: string;
  /** Amount in micro-STX */
  amount: number;
  unlockHeight: number;
  createdAt: number;
  isWithdrawn: boolean;
  beneficiaries: string[];
  stackingEnabled: boolean;
  stackingPool: string | null;
  /** Optional local label */
  label?: string;
}

export type VaultStatus = 'locked' | 'unlocked' | 'withdrawn';

export function getVaultStatus(vault: Vault, currentBlock: number): VaultStatus {
  if (vault.isWithdrawn) return 'withdrawn';
  if (currentBlock >= vault.unlockHeight) return 'unlocked';
  return 'locked';
}

export function blocksRemaining(vault: Vault, currentBlock: number): number {
  return Math.max(0, vault.unlockHeight - currentBlock);
}

/** Convert a block count to milliseconds using the canonical MS_PER_BLOCK constant. */
export function blocksToMs(blocks: number): number {
  return blocks * MS_PER_BLOCK;
}
