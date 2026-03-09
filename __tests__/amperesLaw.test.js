const {
  calculateWire,
  calculateSolenoid,
  calculateToroid,
  MODES,
} = require('../src/utils/amperesLaw');

const MU_0 = 4 * Math.PI * 1e-7;

describe("Ampere's Law Calculator", () => {
  // ── MODES constant ──────────────────────────────────────────────────────

  describe('MODES', () => {
    test('has 3 modes: wire, solenoid, toroid', () => {
      expect(MODES).toHaveLength(3);
      expect(MODES.map((m) => m.key)).toEqual(['wire', 'solenoid', 'toroid']);
    });
  });

  // ── Straight Wire ───────────────────────────────────────────────────────

  describe('calculateWire', () => {
    test('given I and r → calculates B', () => {
      const r = calculateWire({ magneticField: '', current: '10', distance: '0.05' });
      const expected = (MU_0 * 10) / (2 * Math.PI * 0.05);
      expect(parseFloat(r.magneticField)).toBeCloseTo(expected, 8);
    });

    test('given B and r → calculates I', () => {
      const B = (MU_0 * 10) / (2 * Math.PI * 0.05);
      const r = calculateWire({ magneticField: String(B), current: '', distance: '0.05' });
      expect(parseFloat(r.current)).toBeCloseTo(10, 4);
    });

    test('given B and I → calculates r', () => {
      const B = (MU_0 * 10) / (2 * Math.PI * 0.05);
      const r = calculateWire({ magneticField: String(B), current: '10', distance: '' });
      expect(parseFloat(r.distance)).toBeCloseTo(0.05, 6);
    });

    test('fewer than 2 values returns error', () => {
      const r = calculateWire({ magneticField: '', current: '10', distance: '' });
      expect(r.error).toBe('Enter at least 2 values to calculate.');
    });

    test('negative current returns error', () => {
      const r = calculateWire({ magneticField: '', current: '-5', distance: '0.1' });
      expect(r.error).toBe('Current cannot be negative.');
    });

    test('zero distance returns error', () => {
      const r = calculateWire({ magneticField: '', current: '5', distance: '0' });
      expect(r.error).toBe('Distance must be greater than zero.');
    });
  });

  // ── Solenoid ────────────────────────────────────────────────────────────

  describe('calculateSolenoid', () => {
    test('given I, N, L → calculates B', () => {
      const r = calculateSolenoid({
        magneticField: '', current: '2', turns: '500', length: '0.5',
      });
      const expected = MU_0 * (500 / 0.5) * 2;
      expect(parseFloat(r.magneticField)).toBeCloseTo(expected, 8);
    });

    test('given B, N, L → calculates I', () => {
      const B = MU_0 * (500 / 0.5) * 2;
      const r = calculateSolenoid({
        magneticField: String(B), current: '', turns: '500', length: '0.5',
      });
      expect(parseFloat(r.current)).toBeCloseTo(2, 4);
    });

    test('fewer than 3 values returns error', () => {
      const r = calculateSolenoid({
        magneticField: '', current: '2', turns: '', length: '',
      });
      expect(r.error).toBe('Enter at least 3 values to calculate.');
    });

    test('zero length returns error', () => {
      const r = calculateSolenoid({
        magneticField: '', current: '2', turns: '500', length: '0',
      });
      expect(r.error).toBe('Length must be greater than zero.');
    });
  });

  // ── Toroid ──────────────────────────────────────────────────────────────

  describe('calculateToroid', () => {
    test('given I, N, r → calculates B', () => {
      const r = calculateToroid({
        magneticField: '', current: '3', turns: '200', radius: '0.1',
      });
      const expected = (MU_0 * 200 * 3) / (2 * Math.PI * 0.1);
      expect(parseFloat(r.magneticField)).toBeCloseTo(expected, 8);
    });

    test('given B, N, r → calculates I', () => {
      const B = (MU_0 * 200 * 3) / (2 * Math.PI * 0.1);
      const r = calculateToroid({
        magneticField: String(B), current: '', turns: '200', radius: '0.1',
      });
      expect(parseFloat(r.current)).toBeCloseTo(3, 4);
    });

    test('fewer than 3 values returns error', () => {
      const r = calculateToroid({
        magneticField: '', current: '3', turns: '', radius: '',
      });
      expect(r.error).toBe('Enter at least 3 values to calculate.');
    });

    test('zero radius returns error', () => {
      const r = calculateToroid({
        magneticField: '', current: '3', turns: '200', radius: '0',
      });
      expect(r.error).toBe('Radius must be greater than zero.');
    });

    test('negative turns returns error', () => {
      const r = calculateToroid({
        magneticField: '', current: '3', turns: '-10', radius: '0.1',
      });
      expect(r.error).toBe('Number of turns must be greater than zero.');
    });
  });
});
