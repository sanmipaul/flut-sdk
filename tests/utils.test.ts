import { describe, it, expect } from 'vitest';
import { microToStx, stxToMicro, truncateAddress, formatStx, formatDuration, validateAddress } from '../src/utils';

describe('microToStx', () => {
  it('converts 1_000_000 micro-STX to 1 STX', () => {
    expect(microToStx(1_000_000)).toBe(1);
  });
  it('converts 0 to 0', () => {
    expect(microToStx(0)).toBe(0);
  });
  it('accepts bigint input', () => {
    expect(microToStx(BigInt(2_000_000))).toBe(2);
  });
  it('handles fractional amounts', () => {
    expect(microToStx(500_000)).toBe(0.5);
  });
});

describe('stxToMicro', () => {
  it('converts 1 STX to 1_000_000 micro-STX', () => {
    expect(stxToMicro(1)).toBe(BigInt(1_000_000));
  });
  it('handles decimal STX amounts', () => {
    expect(stxToMicro(0.5)).toBe(BigInt(500_000));
  });
  it('converts 0 STX to 0 micro-STX', () => {
    expect(stxToMicro(0)).toBe(BigInt(0));
  });
});

describe('truncateAddress', () => {
  const addr = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ';

  it('truncates a long address', () => {
    const result = truncateAddress(addr);
    expect(result).toContain('…');
    expect(result.length).toBeLessThan(addr.length);
  });
  it('returns short addresses unchanged', () => {
    expect(truncateAddress('SP123')).toBe('SP123');
  });
  it('respects custom char count', () => {
    const result = truncateAddress(addr, 4);
    expect(result.startsWith('SP2J')).toBe(true);
    expect(result.endsWith('V9EJ')).toBe(true);
  });
  it('starts and ends with the correct characters', () => {
    const result = truncateAddress(addr, 6);
    expect(result.startsWith('SP2J6Z')).toBe(true);
    // Last 6 chars of the address are 'NRV9EJ'; the truncated string must end with them
    expect(result.endsWith('NRV9EJ')).toBe(true);
  });
});

describe('formatStx', () => {
  it('formats micro-STX as a readable STX string', () => {
    expect(formatStx(1_500_000)).toBe('1.5 STX');
  });
  it('formats 0 micro-STX', () => {
    expect(formatStx(0)).toBe('0 STX');
  });
  it('accepts bigint input', () => {
    expect(formatStx(BigInt(1_000_000))).toBe('1 STX');
  });
});

describe('formatDuration', () => {
  it('returns "0 blocks" for zero blocks', () => {
    expect(formatDuration(0)).toBe('0 blocks');
  });
  it('returns "0 blocks" for negative input', () => {
    expect(formatDuration(-10)).toBe('0 blocks');
  });
  it('formats blocks less than one hour as minutes', () => {
    // 5 blocks × 10 min = 50 minutes
    expect(formatDuration(5)).toBe('50 minutes');
  });
  it('formats exactly 1 hour (6 blocks)', () => {
    expect(formatDuration(6)).toBe('1 hour');
  });
  it('formats plural hours', () => {
    // 12 blocks × 10 min = 120 min = 2 hours
    expect(formatDuration(12)).toBe('2 hours');
  });
  it('formats exactly 1 day (144 blocks)', () => {
    expect(formatDuration(144)).toBe('1 day');
  });
  it('formats plural days', () => {
    // 288 blocks = 2 days
    expect(formatDuration(288)).toBe('2 days');
  });
  it('formats exactly 1 week (1008 blocks)', () => {
    expect(formatDuration(1_008)).toBe('1 week');
  });
  it('formats plural weeks', () => {
    // 2016 blocks = 2 weeks
    expect(formatDuration(2_016)).toBe('2 weeks');
  });
  it('formats months', () => {
    // 4320 blocks ≈ 1 month (30 days)
    expect(formatDuration(4_320)).toBe('1 month');
  });
  it('formats exactly 1 year (52560 blocks)', () => {
    expect(formatDuration(52_560)).toBe('1 year');
  });
  it('formats plural years', () => {
    // 105120 blocks = 2 years
    expect(formatDuration(105_120)).toBe('2 years');
  });
});

describe('validateAddress', () => {
  it('accepts a valid mainnet SP address', () => {
    expect(validateAddress('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ')).toBe(true);
  });
  it('accepts a valid testnet ST address', () => {
    expect(validateAddress('ST2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKPVKG2CE')).toBe(true);
  });
  it('accepts a contract principal (SP…​.name form)', () => {
    expect(validateAddress('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ.my-contract')).toBe(true);
  });
  it('rejects an address with an invalid prefix', () => {
    expect(validateAddress('AB2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ')).toBe(false);
  });
  it('rejects an address that is too short', () => {
    expect(validateAddress('SP123')).toBe(false);
  });
  it('rejects an empty string', () => {
    expect(validateAddress('')).toBe(false);
  });
  it('rejects an address containing invalid base-58 characters', () => {
    // '0', 'O', 'I', 'l' are not in the base-58 alphabet
    expect(validateAddress('SP0000000000000000000000000000000000000000')).toBe(false);
  });
});
