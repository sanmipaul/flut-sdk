import { describe, it, expect } from 'vitest';
import { microToStx, stxToMicro, truncateAddress, formatStx } from '../src/utils';

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
    expect(result.endsWith('RV9EJ')).toBe(false); // 6 chars from end
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
