import { describe, it, expect } from 'vitest';
import { getVaultStatus, blocksRemaining, blocksToMs } from '../src/types/vault';
import type { Vault } from '../src/types/vault';

const baseVault: Vault = {
  vaultId: 1,
  creator: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ',
  amount: 1_000_000,
  unlockHeight: 1000,
  createdAt: 500,
  isWithdrawn: false,
  beneficiaries: [],
  stackingEnabled: false,
  stackingPool: null,
};

describe('getVaultStatus', () => {
  it('returns "locked" when current block is below unlock height', () => {
    expect(getVaultStatus(baseVault, 999)).toBe('locked');
  });
  it('returns "unlocked" when current block equals unlock height', () => {
    expect(getVaultStatus(baseVault, 1000)).toBe('unlocked');
  });
  it('returns "unlocked" when current block exceeds unlock height', () => {
    expect(getVaultStatus(baseVault, 1001)).toBe('unlocked');
  });
  it('returns "withdrawn" regardless of block height when vault is withdrawn', () => {
    expect(getVaultStatus({ ...baseVault, isWithdrawn: true }, 500)).toBe('withdrawn');
    expect(getVaultStatus({ ...baseVault, isWithdrawn: true }, 1500)).toBe('withdrawn');
  });
});

describe('blocksRemaining', () => {
  it('returns blocks remaining until unlock', () => {
    expect(blocksRemaining(baseVault, 900)).toBe(100);
  });
  it('returns 0 when already at unlock height', () => {
    expect(blocksRemaining(baseVault, 1000)).toBe(0);
  });
  it('returns 0 when past unlock height', () => {
    expect(blocksRemaining(baseVault, 1100)).toBe(0);
  });
  it('returns the full duration at block 0', () => {
    expect(blocksRemaining(baseVault, 0)).toBe(1000);
  });
});

describe('blocksToMs', () => {
  it('converts 1 block to 600_000 ms (10 minutes)', () => {
    expect(blocksToMs(1)).toBe(600_000);
  });
  it('converts 6 blocks to 1 hour in ms', () => {
    expect(blocksToMs(6)).toBe(3_600_000);
  });
  it('converts 0 blocks to 0 ms', () => {
    expect(blocksToMs(0)).toBe(0);
  });
});
