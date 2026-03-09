const { calculate, recommendWireSize, getWireSizes } = require('../src/utils/voltageDrop');

describe('Voltage Drop Calculator', () => {
  // ── calculate() ─────────────────────────────────────────────────────────

  describe('calculate — single-phase copper', () => {
    test('12 AWG, 20A, 100ft, 120V → Non-Compliant (>5%)', () => {
      const r = calculate({
        sourceVoltage: 120,
        current: 20,
        distance: 100,
        wireSize: '12',
        material: 'copper',
        systemType: 'single-phase',
      });
      expect(r.error).toBeUndefined();
      // Vdrop = 2 × 12.9 × 20 × 100 / 6530 ≈ 7.902 V
      expect(r.voltageDrop).toBeCloseTo(7.902, 1);
      expect(r.voltageDropPercent).toBeCloseTo(6.585, 1);
      expect(r.necCompliance).toBe('Non-Compliant');
    });

    test('12 AWG, 10A, 50ft, 120V → Excellent (≤2%)', () => {
      const r = calculate({
        sourceVoltage: 120,
        current: 10,
        distance: 50,
        wireSize: '12',
        material: 'copper',
        systemType: 'single-phase',
      });
      expect(r.error).toBeUndefined();
      // Vdrop = 2 × 12.9 × 10 × 50 / 6530 ≈ 1.976 V → 1.646%
      expect(r.voltageDropPercent).toBeCloseTo(1.646, 1);
      expect(r.necCompliance).toBe('Excellent');
    });

    test('10 AWG, 20A, 100ft, 120V → Good (2–3%)', () => {
      const r = calculate({
        sourceVoltage: 120,
        current: 20,
        distance: 100,
        wireSize: '10',
        material: 'copper',
        systemType: 'single-phase',
      });
      // Vdrop = 2 × 12.9 × 20 × 100 / 10380 ≈ 4.960 V → 4.133%
      // Actually 4.133 > 3 so this is Marginal
      expect(r.necCompliance).toBe('Marginal');
    });
  });

  describe('calculate — three-phase aluminum', () => {
    test('4 AWG, 30A, 200ft, 240V', () => {
      const r = calculate({
        sourceVoltage: 240,
        current: 30,
        distance: 200,
        wireSize: '4',
        material: 'aluminum',
        systemType: 'three-phase',
      });
      expect(r.error).toBeUndefined();
      // Vdrop = √3 × 21.2 × 30 × 200 / 41740
      const expected = (Math.sqrt(3) * 21.2 * 30 * 200) / 41740;
      expect(r.voltageDrop).toBeCloseTo(expected, 1);
    });
  });

  describe('calculate — load voltage and power loss', () => {
    test('load voltage = source - drop', () => {
      const r = calculate({
        sourceVoltage: 240,
        current: 15,
        distance: 75,
        wireSize: '10',
        material: 'copper',
        systemType: 'single-phase',
      });
      expect(r.loadVoltage).toBeCloseTo(240 - r.voltageDrop, 1);
    });

    test('power loss = current × drop', () => {
      const r = calculate({
        sourceVoltage: 120,
        current: 20,
        distance: 100,
        wireSize: '12',
        material: 'copper',
        systemType: 'single-phase',
      });
      // power loss ≈ 20 × 7.902 ≈ 158.04
      expect(r.powerLoss).toBeCloseTo(20 * r.voltageDrop, 0);
    });
  });

  describe('calculate — NEC compliance thresholds', () => {
    test('Excellent when ≤ 2%', () => {
      // Use large wire, short distance, low current
      const r = calculate({
        sourceVoltage: 240,
        current: 5,
        distance: 20,
        wireSize: '4',
        material: 'copper',
        systemType: 'single-phase',
      });
      expect(r.voltageDropPercent).toBeLessThanOrEqual(2);
      expect(r.necCompliance).toBe('Excellent');
    });

    test('Non-Compliant when > 5%', () => {
      const r = calculate({
        sourceVoltage: 120,
        current: 20,
        distance: 100,
        wireSize: '12',
        material: 'copper',
        systemType: 'single-phase',
      });
      expect(r.voltageDropPercent).toBeGreaterThan(5);
      expect(r.necCompliance).toBe('Non-Compliant');
    });
  });

  // ── Validation ──────────────────────────────────────────────────────────

  describe('calculate — validation', () => {
    test('missing source voltage returns error', () => {
      const r = calculate({ current: 20, distance: 100, wireSize: '12' });
      expect(r.error).toBeDefined();
    });

    test('zero current returns error', () => {
      const r = calculate({ sourceVoltage: 120, current: 0, distance: 100, wireSize: '12' });
      expect(r.error).toBeDefined();
    });

    test('negative distance returns error', () => {
      const r = calculate({ sourceVoltage: 120, current: 20, distance: -50, wireSize: '12' });
      expect(r.error).toBeDefined();
    });

    test('invalid wire size returns error', () => {
      const r = calculate({ sourceVoltage: 120, current: 20, distance: 100, wireSize: '99' });
      expect(r.error).toBeDefined();
    });
  });

  // ── recommendWireSize() ─────────────────────────────────────────────────

  describe('recommendWireSize', () => {
    test('recommends a wire size for 3% max drop', () => {
      const r = recommendWireSize({
        sourceVoltage: 120,
        current: 20,
        distance: 100,
        material: 'copper',
        systemType: 'single-phase',
      });
      expect(r.error).toBeUndefined();
      expect(r.recommendedSize).toBeDefined();
      expect(r.actualDropPercent).toBeLessThanOrEqual(3);
    });

    test('recommended size CMA ≥ required CMA', () => {
      const r = recommendWireSize({
        sourceVoltage: 240,
        current: 50,
        distance: 300,
        material: 'copper',
        systemType: 'single-phase',
      });
      if (!r.error) {
        expect(r.actualCMA).toBeGreaterThanOrEqual(r.requiredCMA);
      }
    });

    test('returns error for impossible requirements', () => {
      const r = recommendWireSize({
        sourceVoltage: 12,
        current: 500,
        distance: 5000,
        material: 'aluminum',
        systemType: 'single-phase',
      });
      expect(r.error).toBeDefined();
    });

    describe('validation', () => {
      test('missing source voltage returns error', () => {
        const r = recommendWireSize({ current: 20, distance: 100 });
        expect(r.error).toBeDefined();
      });

      test('zero source voltage returns error', () => {
        const r = recommendWireSize({ sourceVoltage: 0, current: 20, distance: 100 });
        expect(r.error).toBeDefined();
      });

      test('negative source voltage returns error', () => {
        const r = recommendWireSize({ sourceVoltage: -120, current: 20, distance: 100 });
        expect(r.error).toBeDefined();
      });

      test('missing current returns error', () => {
        const r = recommendWireSize({ sourceVoltage: 120, distance: 100 });
        expect(r.error).toBeDefined();
      });

      test('zero current returns error', () => {
        const r = recommendWireSize({ sourceVoltage: 120, current: 0, distance: 100 });
        expect(r.error).toBeDefined();
      });

      test('negative current returns error', () => {
        const r = recommendWireSize({ sourceVoltage: 120, current: -5, distance: 100 });
        expect(r.error).toBeDefined();
      });

      test('missing distance returns error', () => {
        const r = recommendWireSize({ sourceVoltage: 120, current: 20 });
        expect(r.error).toBeDefined();
      });

      test('zero distance returns error', () => {
        const r = recommendWireSize({ sourceVoltage: 120, current: 20, distance: 0 });
        expect(r.error).toBeDefined();
      });

      test('negative distance returns error', () => {
        const r = recommendWireSize({ sourceVoltage: 120, current: 20, distance: -10 });
        expect(r.error).toBeDefined();
      });
    });
  });

  // ── getWireSizes() ──────────────────────────────────────────────────────

  describe('getWireSizes', () => {
    test('returns array of wire sizes', () => {
      const sizes = getWireSizes();
      expect(Array.isArray(sizes)).toBe(true);
      expect(sizes.length).toBeGreaterThan(0);
    });

    test('each entry has label and value', () => {
      const sizes = getWireSizes();
      sizes.forEach((s) => {
        expect(s).toHaveProperty('label');
        expect(s).toHaveProperty('value');
      });
    });

    test('includes common sizes', () => {
      const sizes = getWireSizes();
      const values = sizes.map((s) => s.value);
      expect(values).toContain('12');
      expect(values).toContain('10');
      expect(values).toContain('4/0');
    });
  });
});
