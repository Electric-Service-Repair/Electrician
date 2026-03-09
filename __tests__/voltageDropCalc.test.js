const { calculate, recommendWireSize, getWireSizes } = require('../src/utils/voltageDrop');

describe('Voltage Drop Calculator', () => {
  // ── Single-phase copper ─────────────────────────────────────────────

  describe('single-phase copper', () => {
    test('120V, 20A, 100ft, 12 AWG copper', () => {
      const r = calculate({
        sourceVoltage: 120,
        current: 20,
        distance: 100,
        wireSize: '12',
        material: 'copper',
        systemType: 'single-phase',
      });
      expect(r.error).toBeUndefined();
      // Vdrop = 2 × 12.9 × 20 × 100 / 6530 = 7.894
      expect(r.voltageDrop).toBeCloseTo(7.894, 1);
      expect(r.voltageDropPercent).toBeCloseTo(6.578, 0);
      expect(r.necCompliance).toBe('Non-Compliant');
    });

    test('240V, 30A, 50ft, 10 AWG copper', () => {
      const r = calculate({
        sourceVoltage: 240,
        current: 30,
        distance: 50,
        wireSize: '10',
        material: 'copper',
        systemType: 'single-phase',
      });
      expect(r.error).toBeUndefined();
      // Vdrop = 2 × 12.9 × 30 × 50 / 10380 = 3.728
      expect(r.voltageDrop).toBeCloseTo(3.728, 1);
      expect(r.necCompliance).toBe('Excellent');
    });
  });

  // ── Three-phase ─────────────────────────────────────────────────────

  describe('three-phase', () => {
    test('480V, 100A, 200ft, 1/0 AWG copper', () => {
      const r = calculate({
        sourceVoltage: 480,
        current: 100,
        distance: 200,
        wireSize: '1/0',
        material: 'copper',
        systemType: 'three-phase',
      });
      expect(r.error).toBeUndefined();
      // Vdrop = sqrt(3) × 12.9 × 100 × 200 / 105600 = 4.229
      expect(r.voltageDrop).toBeCloseTo(4.229, 0);
    });
  });

  // ── Aluminum ────────────────────────────────────────────────────────

  describe('aluminum conductors', () => {
    test('aluminum has higher voltage drop than copper for same size', () => {
      const copper = calculate({
        sourceVoltage: 120, current: 20, distance: 100,
        wireSize: '12', material: 'copper', systemType: 'single-phase',
      });
      const aluminum = calculate({
        sourceVoltage: 120, current: 20, distance: 100,
        wireSize: '12', material: 'aluminum', systemType: 'single-phase',
      });
      expect(aluminum.voltageDrop).toBeGreaterThan(copper.voltageDrop);
    });
  });

  // ── NEC compliance levels ───────────────────────────────────────────

  describe('NEC compliance', () => {
    test('< 2% is Excellent', () => {
      const r = calculate({
        sourceVoltage: 480, current: 10, distance: 50,
        wireSize: '4/0', material: 'copper', systemType: 'single-phase',
      });
      expect(r.voltageDropPercent).toBeLessThan(2);
      expect(r.necCompliance).toBe('Excellent');
    });

    test('> 5% is Non-Compliant', () => {
      const r = calculate({
        sourceVoltage: 120, current: 20, distance: 100,
        wireSize: '12', material: 'copper', systemType: 'single-phase',
      });
      expect(r.voltageDropPercent).toBeGreaterThan(5);
      expect(r.necCompliance).toBe('Non-Compliant');
    });
  });

  // ── Wire size recommendation ────────────────────────────────────────

  describe('recommendWireSize', () => {
    test('recommends wire for 3% drop target', () => {
      const r = recommendWireSize({
        sourceVoltage: 120, current: 20, distance: 100,
        material: 'copper', systemType: 'single-phase',
      }, 3);
      expect(r.error).toBeUndefined();
      expect(r.recommendedSize).toBeTruthy();
      expect(r.actualDropPercent).toBeLessThanOrEqual(3);
    });

    test('returns error for impossible requirements', () => {
      const r = recommendWireSize({
        sourceVoltage: 12, current: 1000, distance: 10000,
        material: 'copper', systemType: 'single-phase',
      }, 1);
      expect(r.error).toBeTruthy();
    });
  });

  // ── Utility functions ───────────────────────────────────────────────

  describe('getWireSizes', () => {
    test('returns array of wire sizes', () => {
      const sizes = getWireSizes();
      expect(Array.isArray(sizes)).toBe(true);
      expect(sizes.length).toBeGreaterThan(10);
      expect(sizes[0]).toHaveProperty('label');
      expect(sizes[0]).toHaveProperty('value');
    });
  });

  // ── Validation ──────────────────────────────────────────────────────

  describe('validation', () => {
    test('zero voltage returns error', () => {
      const r = calculate({
        sourceVoltage: 0, current: 20, distance: 100,
        wireSize: '12', material: 'copper', systemType: 'single-phase',
      });
      expect(r.error).toMatch(/voltage/i);
    });

    test('negative current returns error', () => {
      const r = calculate({
        sourceVoltage: 120, current: -5, distance: 100,
        wireSize: '12', material: 'copper', systemType: 'single-phase',
      });
      expect(r.error).toMatch(/current/i);
    });

    test('invalid wire size returns error', () => {
      const r = calculate({
        sourceVoltage: 120, current: 20, distance: 100,
        wireSize: '99', material: 'copper', systemType: 'single-phase',
      });
      expect(r.error).toMatch(/wire size/i);
    });
  });
});
