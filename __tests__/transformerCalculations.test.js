const { calculate } = require('../src/utils/transformerCalculations');

describe('Transformer Calculator', () => {
  // ── Voltage from turns ratio ──────────────────────────────────────────

  describe('given V1, N1, N2 → calculates V2', () => {
    test('V1=240, N1=100, N2=50 → V2=120 (step-down)', () => {
      const r = calculate({ primaryVoltage: '240', secondaryVoltage: '', primaryTurns: '100', secondaryTurns: '50', primaryCurrent: '' });
      expect(parseFloat(r.secondaryVoltage)).toBeCloseTo(120, 4);
      expect(parseFloat(r.turnsRatio)).toBeCloseTo(2, 4);
    });

    test('V1=120, N1=100, N2=200 → V2=240 (step-up)', () => {
      const r = calculate({ primaryVoltage: '120', secondaryVoltage: '', primaryTurns: '100', secondaryTurns: '200', primaryCurrent: '' });
      expect(parseFloat(r.secondaryVoltage)).toBeCloseTo(240, 4);
      expect(parseFloat(r.turnsRatio)).toBeCloseTo(0.5, 4);
    });

    test('V1=480, N1=400, N2=100 → V2=120', () => {
      const r = calculate({ primaryVoltage: '480', secondaryVoltage: '', primaryTurns: '400', secondaryTurns: '100', primaryCurrent: '' });
      expect(parseFloat(r.secondaryVoltage)).toBeCloseTo(120, 4);
    });
  });

  // ── Primary voltage from V2, N1, N2 ──────────────────────────────────

  describe('given V2, N1, N2 → calculates V1', () => {
    test('V2=120, N1=100, N2=50 → V1=240', () => {
      const r = calculate({ primaryVoltage: '', secondaryVoltage: '120', primaryTurns: '100', secondaryTurns: '50', primaryCurrent: '' });
      expect(parseFloat(r.primaryVoltage)).toBeCloseTo(240, 4);
    });
  });

  // ── Turns from voltages ───────────────────────────────────────────────

  describe('given V1, V2, N2 → calculates N1', () => {
    test('V1=240, V2=120, N2=50 → N1=100', () => {
      const r = calculate({ primaryVoltage: '240', secondaryVoltage: '120', primaryTurns: '', secondaryTurns: '50', primaryCurrent: '' });
      expect(parseFloat(r.primaryTurns)).toBeCloseTo(100, 4);
    });
  });

  describe('given V1, V2, N1 → calculates N2', () => {
    test('V1=240, V2=120, N1=100 → N2=50', () => {
      const r = calculate({ primaryVoltage: '240', secondaryVoltage: '120', primaryTurns: '100', secondaryTurns: '', primaryCurrent: '' });
      expect(parseFloat(r.secondaryTurns)).toBeCloseTo(50, 4);
    });
  });

  // ── Current calculations ──────────────────────────────────────────────

  describe('given I1, N1, N2 → calculates I2', () => {
    test('I1=5, N1=100, N2=50 → I2=10 (step-down: current goes up)', () => {
      const r = calculate({ primaryVoltage: '', secondaryVoltage: '', primaryTurns: '100', secondaryTurns: '50', primaryCurrent: '5' });
      expect(parseFloat(r.secondaryCurrent)).toBeCloseTo(10, 4);
    });

    test('I1=10, N1=50, N2=200 → I2=2.5 (step-up: current goes down)', () => {
      const r = calculate({ primaryVoltage: '', secondaryVoltage: '', primaryTurns: '50', secondaryTurns: '200', primaryCurrent: '10' });
      expect(parseFloat(r.secondaryCurrent)).toBeCloseTo(2.5, 4);
    });
  });

  // ── Power calculations ────────────────────────────────────────────────

  describe('power and kVA', () => {
    test('V1=240, N1=100, N2=50, I1=10 → Pin=2400W, Pout=2400W, kVA=2.4', () => {
      const r = calculate({ primaryVoltage: '240', secondaryVoltage: '', primaryTurns: '100', secondaryTurns: '50', primaryCurrent: '10' });
      expect(parseFloat(r.powerIn)).toBeCloseTo(2400, 4);
      expect(parseFloat(r.powerOut)).toBeCloseTo(2400, 4);
      expect(parseFloat(r.kvaRating)).toBeCloseTo(2.4, 4);
    });

    test('ideal transformer has 100% efficiency', () => {
      const r = calculate({ primaryVoltage: '480', secondaryVoltage: '', primaryTurns: '200', secondaryTurns: '100', primaryCurrent: '5' });
      expect(parseFloat(r.efficiency)).toBeCloseTo(100, 4);
    });
  });

  // ── Full solve: V1 + V2 + I1 ─────────────────────────────────────────

  describe('given V1, V2, I1 → calculates I2 from voltage ratio', () => {
    test('V1=240, V2=120, I1=5 → I2=10', () => {
      const r = calculate({ primaryVoltage: '240', secondaryVoltage: '120', primaryTurns: '', secondaryTurns: '', primaryCurrent: '5' });
      expect(parseFloat(r.secondaryCurrent)).toBeCloseTo(10, 4);
      expect(parseFloat(r.powerIn)).toBeCloseTo(1200, 4);
      expect(parseFloat(r.powerOut)).toBeCloseTo(1200, 4);
    });
  });

  // ── Validation ────────────────────────────────────────────────────────

  describe('validation', () => {
    test('fewer than 2 values returns error', () => {
      const r = calculate({ primaryVoltage: '240', secondaryVoltage: '', primaryTurns: '', secondaryTurns: '', primaryCurrent: '' });
      expect(r.error).toBe('Enter at least 2 values to calculate.');
    });

    test('all empty returns error', () => {
      const r = calculate({ primaryVoltage: '', secondaryVoltage: '', primaryTurns: '', secondaryTurns: '', primaryCurrent: '' });
      expect(r.error).toBe('Enter at least 2 values to calculate.');
    });

    test('negative primary voltage returns error', () => {
      const r = calculate({ primaryVoltage: '-240', secondaryVoltage: '120', primaryTurns: '', secondaryTurns: '', primaryCurrent: '' });
      expect(r.error).toBe('Primary voltage cannot be negative.');
    });

    test('negative secondary voltage returns error', () => {
      const r = calculate({ primaryVoltage: '240', secondaryVoltage: '-120', primaryTurns: '', secondaryTurns: '', primaryCurrent: '' });
      expect(r.error).toBe('Secondary voltage cannot be negative.');
    });

    test('zero primary turns returns error', () => {
      const r = calculate({ primaryVoltage: '240', secondaryVoltage: '', primaryTurns: '0', secondaryTurns: '50', primaryCurrent: '' });
      expect(r.error).toBe('Primary turns must be greater than zero.');
    });

    test('negative secondary turns returns error', () => {
      const r = calculate({ primaryVoltage: '240', secondaryVoltage: '', primaryTurns: '100', secondaryTurns: '-50', primaryCurrent: '' });
      expect(r.error).toBe('Secondary turns must be greater than zero.');
    });

    test('negative primary current returns error', () => {
      const r = calculate({ primaryVoltage: '', secondaryVoltage: '', primaryTurns: '100', secondaryTurns: '50', primaryCurrent: '-5' });
      expect(r.error).toBe('Primary current cannot be negative.');
    });
  });

  // ── Edge cases ────────────────────────────────────────────────────────

  describe('edge cases', () => {
    test('1:1 isolation transformer', () => {
      const r = calculate({ primaryVoltage: '120', secondaryVoltage: '', primaryTurns: '100', secondaryTurns: '100', primaryCurrent: '10' });
      expect(parseFloat(r.secondaryVoltage)).toBeCloseTo(120, 4);
      expect(parseFloat(r.secondaryCurrent)).toBeCloseTo(10, 4);
      expect(parseFloat(r.turnsRatio)).toBeCloseTo(1, 4);
    });

    test('large step-down (480V to 24V)', () => {
      const r = calculate({ primaryVoltage: '480', secondaryVoltage: '', primaryTurns: '1000', secondaryTurns: '50', primaryCurrent: '1' });
      expect(parseFloat(r.secondaryVoltage)).toBeCloseTo(24, 4);
      expect(parseFloat(r.secondaryCurrent)).toBeCloseTo(20, 4);
    });

    test('zero voltage primary with turns', () => {
      const r = calculate({ primaryVoltage: '0', secondaryVoltage: '', primaryTurns: '100', secondaryTurns: '50', primaryCurrent: '' });
      expect(r.secondaryVoltage).toBe('0');
    });
  });
});
