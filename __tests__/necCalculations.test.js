const { calculateResidentialLoad } = require('../src/utils/necCalculations');

describe('Residential Load Calculator (NEC Article 220)', () => {
  // ── Default values ────────────────────────────────────────────────────────

  describe('default inputs', () => {
    test('zero square feet with defaults returns base small-appliance + laundry load', () => {
      const r = calculateResidentialLoad({ squareFeet: 0 });
      // 2 circuits * 1500 = 3000 + 1500 laundry = 4500 total connected
      // Demand: 3000 + (4500 - 3000) * 0.35 = 3000 + 525 = 3525
      expect(r.generalLightingLoad).toBe(0);
      expect(r.smallApplianceLoad).toBe(3000);
      expect(r.laundryLoad).toBe(1500);
      expect(r.totalConnectedLoad).toBe(4500);
      expect(r.netLoad).toBe(3525);
      expect(r.totalLoadVA).toBe(3525);
      expect(r.serviceAmps).toBeCloseTo(14.69, 2);
    });
  });

  // ── Demand factor application ─────────────────────────────────────────────

  describe('demand factor thresholds', () => {
    test('total connected load at exactly 3000 VA uses 100% demand', () => {
      // Need: lighting + small appliance + laundry = 3000
      // 2 circuits = 3000, laundry = 1500 → that's 4500. Too much.
      // Use 0 sqft, 1 circuit, no laundry → 1500 VA (under 3000)
      const r = calculateResidentialLoad({
        squareFeet: 0,
        smallApplianceCircuits: 2,
        laundryCircuit: false,
      });
      // 0 + 3000 + 0 = 3000 → exactly at threshold
      expect(r.totalConnectedLoad).toBe(3000);
      expect(r.netLoad).toBe(3000);
    });

    test('total connected load above 3000 VA applies 35% demand on excess', () => {
      const r = calculateResidentialLoad({
        squareFeet: 1000,
        smallApplianceCircuits: 2,
        laundryCircuit: true,
      });
      // Lighting: 1000 * 3 = 3000
      // Small appliance: 2 * 1500 = 3000
      // Laundry: 1500
      // Total: 7500
      // Demand: 3000 + (7500 - 3000) * 0.35 = 3000 + 1575 = 4575
      expect(r.totalConnectedLoad).toBe(7500);
      expect(r.netLoad).toBe(4575);
    });
  });

  // ── Lighting load ─────────────────────────────────────────────────────────

  describe('general lighting load', () => {
    test('calculates at 3 VA per square foot', () => {
      const r = calculateResidentialLoad({ squareFeet: 2000 });
      expect(r.generalLightingLoad).toBe(6000);
    });
  });

  // ── Small appliance circuits ──────────────────────────────────────────────

  describe('small appliance circuits', () => {
    test('each circuit adds 1500 VA', () => {
      const r3 = calculateResidentialLoad({ squareFeet: 0, smallApplianceCircuits: 3 });
      expect(r3.smallApplianceLoad).toBe(4500);
    });
  });

  // ── Laundry circuit ───────────────────────────────────────────────────────

  describe('laundry circuit', () => {
    test('laundry circuit adds 1500 VA when true', () => {
      const r = calculateResidentialLoad({ squareFeet: 0, laundryCircuit: true });
      expect(r.laundryLoad).toBe(1500);
    });

    test('laundry circuit adds 0 VA when false', () => {
      const r = calculateResidentialLoad({ squareFeet: 0, laundryCircuit: false });
      expect(r.laundryLoad).toBe(0);
    });
  });

  // ── Fixed appliance load ──────────────────────────────────────────────────

  describe('fixed appliance load', () => {
    test('fixed appliance VA is added after demand factors', () => {
      const withoutAppliances = calculateResidentialLoad({ squareFeet: 1500 });
      const withAppliances = calculateResidentialLoad({
        squareFeet: 1500,
        fixedApplianceVA: 5000,
      });
      expect(withAppliances.totalLoadVA).toBe(withoutAppliances.netLoad + 5000);
    });
  });

  // ── Service amperage ──────────────────────────────────────────────────────

  describe('service amperage', () => {
    test('service amps is total load divided by 240V', () => {
      const r = calculateResidentialLoad({
        squareFeet: 1500,
        fixedApplianceVA: 10000,
      });
      expect(r.serviceAmps).toBeCloseTo(r.totalLoadVA / 240, 2);
    });

    test('typical 2000 sq ft home calculation', () => {
      const r = calculateResidentialLoad({
        squareFeet: 2000,
        smallApplianceCircuits: 2,
        laundryCircuit: true,
        fixedApplianceVA: 12000,
      });
      // Lighting: 6000, SA: 3000, Laundry: 1500 → 10500
      // Demand: 3000 + (10500 - 3000) * 0.35 = 3000 + 2625 = 5625
      // + Fixed: 5625 + 12000 = 17625
      // Amps: 17625 / 240 = 73.4375
      expect(r.totalLoadVA).toBe(17625);
      expect(r.serviceAmps).toBeCloseTo(73.44, 2);
    });
  });
});
