const { calculate } = require('../src/utils/ohmsLaw');

describe("Ohm's Law Calculator", () => {
  // ── V and I given ───────────────────────────────────────────────────────

  describe('given V and I → calculates R and P', () => {
    test('V=10, I=2 → R=5, P=20', () => {
      const r = calculate({ voltage: '10', current: '2', resistance: '', power: '' });
      expect(parseFloat(r.resistance)).toBeCloseTo(5, 4);
      expect(parseFloat(r.power)).toBeCloseTo(20, 4);
    });

    test('V=0, I=5 → R=0, P=0', () => {
      const r = calculate({ voltage: '0', current: '5', resistance: '', power: '' });
      expect(r.resistance).toBe('0');
      expect(r.power).toBe('0');
    });
  });

  // ── V and R given ───────────────────────────────────────────────────────

  describe('given V and R → calculates I and P', () => {
    test('V=12, R=4 → I=3, P=36', () => {
      const r = calculate({ voltage: '12', current: '', resistance: '4', power: '' });
      expect(parseFloat(r.current)).toBeCloseTo(3, 4);
      expect(parseFloat(r.power)).toBeCloseTo(36, 4);
    });
  });

  // ── V and P given ───────────────────────────────────────────────────────

  describe('given V and P → calculates I and R', () => {
    test('V=10, P=50 → I=5, R=2', () => {
      const r = calculate({ voltage: '10', current: '', resistance: '', power: '50' });
      expect(parseFloat(r.current)).toBeCloseTo(5, 4);
      expect(parseFloat(r.resistance)).toBeCloseTo(2, 4);
    });
  });

  // ── I and R given ───────────────────────────────────────────────────────

  describe('given I and R → calculates V and P', () => {
    test('I=3, R=4 → V=12, P=36', () => {
      const r = calculate({ voltage: '', current: '3', resistance: '4', power: '' });
      expect(parseFloat(r.voltage)).toBeCloseTo(12, 4);
      expect(parseFloat(r.power)).toBeCloseTo(36, 4);
    });
  });

  // ── I and P given ───────────────────────────────────────────────────────

  describe('given I and P → calculates V and R', () => {
    test('I=2, P=20 → V=10, R=5', () => {
      const r = calculate({ voltage: '', current: '2', resistance: '', power: '20' });
      expect(parseFloat(r.voltage)).toBeCloseTo(10, 4);
      expect(parseFloat(r.resistance)).toBeCloseTo(5, 4);
    });
  });

  // ── R and P given ───────────────────────────────────────────────────────

  describe('given R and P → calculates V and I', () => {
    test('R=5, P=20 → V=10, I=2', () => {
      const r = calculate({ voltage: '', current: '', resistance: '5', power: '20' });
      expect(parseFloat(r.voltage)).toBeCloseTo(10, 4);
      expect(parseFloat(r.current)).toBeCloseTo(2, 4);
    });
  });

  // ── Validation ──────────────────────────────────────────────────────────

  describe('validation', () => {
    test('fewer than 2 values returns error', () => {
      const r = calculate({ voltage: '10', current: '', resistance: '', power: '' });
      expect(r.error).toBe('Enter at least 2 values to calculate.');
    });

    test('negative voltage returns error', () => {
      const r = calculate({ voltage: '-1', current: '2', resistance: '', power: '' });
      expect(r.error).toBe('Voltage cannot be negative.');
    });

    test('negative current returns error', () => {
      const r = calculate({ voltage: '10', current: '-2', resistance: '', power: '' });
      expect(r.error).toBe('Current cannot be negative.');
    });

    test('zero resistance returns error', () => {
      const r = calculate({ voltage: '10', current: '', resistance: '0', power: '' });
      expect(r.error).toBe('Resistance must be greater than zero.');
    });

    test('negative power returns error', () => {
      const r = calculate({ voltage: '10', current: '', resistance: '', power: '-5' });
      expect(r.error).toBe('Power cannot be negative.');
    });

    test('all empty returns error', () => {
      const r = calculate({ voltage: '', current: '', resistance: '', power: '' });
      expect(r.error).toBe('Enter at least 2 values to calculate.');
    });
  });
});
