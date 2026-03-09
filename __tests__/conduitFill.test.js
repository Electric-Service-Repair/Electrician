const { calculate, recommendConduitSize } = require('../src/utils/conduitFill');

describe('Conduit Fill Calculator', () => {
  // ── Basic calculations ──────────────────────────────────────────────

  describe('calculate', () => {
    test('single 12 AWG THHN in 1/2" EMT', () => {
      const r = calculate({
        conduitType: 'EMT',
        conduitSize: '1/2',
        wires: [{ wireSize: '12', wireType: 'THHN', count: 1 }],
      });
      expect(r.error).toBeUndefined();
      expect(r.totalWireCount).toBe(1);
      expect(r.maxFillPercent).toBe(53); // 1 wire = 53%
      expect(r.compliant).toBe(true);
    });

    test('three 12 AWG THHN in 1/2" EMT — compliant', () => {
      const r = calculate({
        conduitType: 'EMT',
        conduitSize: '1/2',
        wires: [{ wireSize: '12', wireType: 'THHN', count: 3 }],
      });
      expect(r.error).toBeUndefined();
      expect(r.totalWireCount).toBe(3);
      expect(r.maxFillPercent).toBe(40); // 3+ wires = 40%
      // 3 × 0.0133 = 0.0399 sq in, conduit = 0.304, fill = 13.1%
      expect(r.fillPercent).toBeLessThan(40);
      expect(r.compliant).toBe(true);
    });

    test('two wires uses 31% fill limit', () => {
      const r = calculate({
        conduitType: 'EMT',
        conduitSize: '1/2',
        wires: [{ wireSize: '12', wireType: 'THHN', count: 2 }],
      });
      expect(r.maxFillPercent).toBe(31);
    });

    test('overfilled conduit is non-compliant', () => {
      const r = calculate({
        conduitType: 'EMT',
        conduitSize: '1/2',
        wires: [{ wireSize: '4/0', wireType: 'THHN', count: 3 }],
      });
      expect(r.error).toBeUndefined();
      expect(r.compliant).toBe(false);
      expect(r.compliance).toBe('Non-Compliant');
    });

    test('mixed wire sizes', () => {
      const r = calculate({
        conduitType: 'EMT',
        conduitSize: '1',
        wires: [
          { wireSize: '12', wireType: 'THHN', count: 3 },
          { wireSize: '10', wireType: 'THHN', count: 2 },
        ],
      });
      expect(r.error).toBeUndefined();
      expect(r.totalWireCount).toBe(5);
      expect(r.wireDetails).toHaveLength(2);
      expect(r.compliant).toBe(true);
    });

    test('PVC-80 has smaller area than EMT', () => {
      const emt = calculate({
        conduitType: 'EMT',
        conduitSize: '1/2',
        wires: [{ wireSize: '12', wireType: 'THHN', count: 3 }],
      });
      const pvc = calculate({
        conduitType: 'PVC-80',
        conduitSize: '1/2',
        wires: [{ wireSize: '12', wireType: 'THHN', count: 3 }],
      });
      expect(pvc.fillPercent).toBeGreaterThan(emt.fillPercent);
    });
  });

  // ── Recommendations ─────────────────────────────────────────────────

  describe('recommendConduitSize', () => {
    test('recommends correct size for three 12 AWG', () => {
      const r = recommendConduitSize({
        conduitType: 'EMT',
        wires: [{ wireSize: '12', wireType: 'THHN', count: 3 }],
      });
      expect(r.error).toBeUndefined();
      expect(r.recommendedSize).toBe('1/2');
    });

    test('recommends larger conduit for big wires', () => {
      const r = recommendConduitSize({
        conduitType: 'EMT',
        wires: [{ wireSize: '4/0', wireType: 'THHN', count: 4 }],
      });
      expect(r.error).toBeUndefined();
      // 4 × 0.3237 = 1.2948 sq in, need 40% fill, so conduit area >= 3.237
      expect(r.recommendedSize).toBeTruthy();
    });
  });

  // ── Validation ──────────────────────────────────────────────────────

  describe('validation', () => {
    test('invalid conduit type returns error', () => {
      const r = calculate({
        conduitType: 'INVALID',
        conduitSize: '1/2',
        wires: [{ wireSize: '12', wireType: 'THHN', count: 1 }],
      });
      expect(r.error).toMatch(/valid conduit type/);
    });

    test('invalid conduit size returns error', () => {
      const r = calculate({
        conduitType: 'EMT',
        conduitSize: '99',
        wires: [{ wireSize: '12', wireType: 'THHN', count: 1 }],
      });
      expect(r.error).toMatch(/valid conduit size/);
    });

    test('no wires returns error', () => {
      const r = calculate({
        conduitType: 'EMT',
        conduitSize: '1/2',
        wires: [],
      });
      expect(r.error).toMatch(/at least one wire/);
    });

    test('invalid wire type returns error', () => {
      const r = calculate({
        conduitType: 'EMT',
        conduitSize: '1/2',
        wires: [{ wireSize: '12', wireType: 'FAKE', count: 1 }],
      });
      expect(r.error).toMatch(/Unknown wire type/);
    });

    test('invalid wire size returns error', () => {
      const r = calculate({
        conduitType: 'EMT',
        conduitSize: '1/2',
        wires: [{ wireSize: '999', wireType: 'THHN', count: 1 }],
      });
      expect(r.error).toMatch(/Unknown wire size/);
    });
  });
});
