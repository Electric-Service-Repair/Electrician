const { calculate } = require('../src/utils/voltageDivider');

describe('Voltage Divider Calculator', () => {
  // ── Core calculations: Given 3 known values, solve for the 4th ──────────

  describe('given Vin, R1, R2 → calculates Vout', () => {
    test('basic divider: 10V, 1kΩ, 1kΩ → 5V', () => {
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '',
        resistance1: '1000',
        resistance2: '1000',
      });
      expect(result.error).toBeUndefined();
      expect(parseFloat(result.outputVoltage)).toBeCloseTo(5, 4);
    });

    test('unequal divider: 12V, 8kΩ, 4kΩ → 4V', () => {
      const result = calculate({
        inputVoltage: '12',
        outputVoltage: '',
        resistance1: '8000',
        resistance2: '4000',
      });
      expect(parseFloat(result.outputVoltage)).toBeCloseTo(4, 4);
    });

    test('large ratio: 5V, 99kΩ, 1kΩ → 0.05V', () => {
      const result = calculate({
        inputVoltage: '5',
        outputVoltage: '',
        resistance1: '99000',
        resistance2: '1000',
      });
      expect(parseFloat(result.outputVoltage)).toBeCloseTo(0.05, 4);
    });

    test('zero input voltage produces zero output', () => {
      const result = calculate({
        inputVoltage: '0',
        outputVoltage: '',
        resistance1: '1000',
        resistance2: '1000',
      });
      expect(result.outputVoltage).toBe('0');
    });
  });

  describe('given Vout, R1, R2 → calculates Vin', () => {
    test('basic: Vout=5V, R1=1kΩ, R2=1kΩ → Vin=10V', () => {
      const result = calculate({
        inputVoltage: '',
        outputVoltage: '5',
        resistance1: '1000',
        resistance2: '1000',
      });
      expect(parseFloat(result.inputVoltage)).toBeCloseTo(10, 4);
    });

    test('Vout=4V, R1=8kΩ, R2=4kΩ → Vin=12V', () => {
      const result = calculate({
        inputVoltage: '',
        outputVoltage: '4',
        resistance1: '8000',
        resistance2: '4000',
      });
      expect(parseFloat(result.inputVoltage)).toBeCloseTo(12, 4);
    });
  });

  describe('given Vin, Vout, R2 → calculates R1', () => {
    test('basic: 10V→5V with R2=1kΩ → R1=1kΩ', () => {
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '5',
        resistance1: '',
        resistance2: '1000',
      });
      expect(parseFloat(result.resistance1)).toBeCloseTo(1000, 2);
    });

    test('12V→4V with R2=4kΩ → R1=8kΩ', () => {
      const result = calculate({
        inputVoltage: '12',
        outputVoltage: '4',
        resistance1: '',
        resistance2: '4000',
      });
      expect(parseFloat(result.resistance1)).toBeCloseTo(8000, 2);
    });
  });

  describe('given Vin, Vout, R1 → calculates R2', () => {
    test('basic: 10V→5V with R1=1kΩ → R2=1kΩ', () => {
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '5',
        resistance1: '1000',
        resistance2: '',
      });
      expect(parseFloat(result.resistance2)).toBeCloseTo(1000, 2);
    });

    test('12V→4V with R1=8kΩ → R2=4kΩ', () => {
      const result = calculate({
        inputVoltage: '12',
        outputVoltage: '4',
        resistance1: '8000',
        resistance2: '',
      });
      expect(parseFloat(result.resistance2)).toBeCloseTo(4000, 2);
    });
  });

  // ── Current calculation ─────────────────────────────────────────────────

  describe('divider current', () => {
    test('computes I = Vin / (R1 + R2)', () => {
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '',
        resistance1: '1000',
        resistance2: '1000',
      });
      // I = 10 / 2000 = 0.005 A
      expect(parseFloat(result.current)).toBeCloseTo(0.005, 6);
    });

    test('current with known Vin=12V, R1=8kΩ, R2=4kΩ', () => {
      const result = calculate({
        inputVoltage: '12',
        outputVoltage: '',
        resistance1: '8000',
        resistance2: '4000',
      });
      // I = 12 / 12000 = 0.001 A
      expect(parseFloat(result.current)).toBeCloseTo(0.001, 6);
    });
  });

  // ── Input validation ────────────────────────────────────────────────────

  describe('validation errors', () => {
    test('fewer than 3 values returns error', () => {
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '',
        resistance1: '1000',
        resistance2: '',
      });
      expect(result.error).toBe('Enter at least 3 values to calculate.');
    });

    test('single value returns error', () => {
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '',
        resistance1: '',
        resistance2: '',
      });
      expect(result.error).toBe('Enter at least 3 values to calculate.');
    });

    test('all empty returns error', () => {
      const result = calculate({
        inputVoltage: '',
        outputVoltage: '',
        resistance1: '',
        resistance2: '',
      });
      expect(result.error).toBe('Enter at least 3 values to calculate.');
    });

    test('negative input voltage returns error', () => {
      const result = calculate({
        inputVoltage: '-5',
        outputVoltage: '',
        resistance1: '1000',
        resistance2: '1000',
      });
      expect(result.error).toBe('Input voltage cannot be negative.');
    });

    test('negative output voltage returns error', () => {
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '-3',
        resistance1: '1000',
        resistance2: '',
      });
      expect(result.error).toBe('Output voltage cannot be negative.');
    });

    test('zero R1 returns error', () => {
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '',
        resistance1: '0',
        resistance2: '1000',
      });
      expect(result.error).toBe('R1 must be greater than zero.');
    });

    test('negative R1 returns error', () => {
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '',
        resistance1: '-100',
        resistance2: '1000',
      });
      expect(result.error).toBe('R1 must be greater than zero.');
    });

    test('zero R2 returns error', () => {
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '',
        resistance1: '1000',
        resistance2: '0',
      });
      expect(result.error).toBe('R2 must be greater than zero.');
    });

    test('negative R2 returns error', () => {
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '',
        resistance1: '1000',
        resistance2: '-500',
      });
      expect(result.error).toBe('R2 must be greater than zero.');
    });

    test('Vout > Vin returns physical constraint error', () => {
      const result = calculate({
        inputVoltage: '5',
        outputVoltage: '10',
        resistance1: '1000',
        resistance2: '',
      });
      expect(result.error).toMatch(/cannot exceed input voltage/);
    });
  });

  // ── Edge cases ──────────────────────────────────────────────────────────

  describe('edge cases', () => {
    test('NaN input is treated as empty', () => {
      const result = calculate({
        inputVoltage: 'abc',
        outputVoltage: '',
        resistance1: '1000',
        resistance2: '1000',
      });
      expect(result.error).toBe('Enter at least 3 values to calculate.');
    });

    test('very large resistance values', () => {
      const result = calculate({
        inputVoltage: '5',
        outputVoltage: '',
        resistance1: '10000000',
        resistance2: '10000000',
      });
      expect(parseFloat(result.outputVoltage)).toBeCloseTo(2.5, 4);
    });

    test('very small resistance values', () => {
      const result = calculate({
        inputVoltage: '3.3',
        outputVoltage: '',
        resistance1: '0.001',
        resistance2: '0.001',
      });
      expect(parseFloat(result.outputVoltage)).toBeCloseTo(1.65, 4);
    });

    test('all four values provided still calculates current', () => {
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '5',
        resistance1: '1000',
        resistance2: '1000',
      });
      expect(result.error).toBeUndefined();
      expect(parseFloat(result.current)).toBeCloseTo(0.005, 6);
    });

    test('Vout equal to Vin (R1=0 scenario) via 3 given values', () => {
      // If Vout=Vin=10 and R2=1000, then R1 = R2*(Vin-Vout)/Vout = 0
      // This should fail validation since R1 must be > 0
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '10',
        resistance1: '',
        resistance2: '1000',
      });
      expect(result.error).toMatch(/not physically valid/);
    });

    test('Vout = 0 (R2 = 0 scenario)', () => {
      // Vin=10, Vout=0, R1=1000 → R2 = R1*0/(10-0) = 0 → invalid
      const result = calculate({
        inputVoltage: '10',
        outputVoltage: '0',
        resistance1: '1000',
        resistance2: '',
      });
      expect(result.error).toMatch(/not physically valid/);
    });

    test('formatResult: large values use exponential notation', () => {
      const result = calculate({
        inputVoltage: '5000000',
        outputVoltage: '',
        resistance1: '1000',
        resistance2: '1000',
      });
      expect(result.inputVoltage).toMatch(/e\+/);
      expect(parseFloat(result.outputVoltage)).toBeCloseTo(2500000, 0);
    });

    test('formatResult: very small values use exponential notation', () => {
      const result = calculate({
        inputVoltage: '0.0001',
        outputVoltage: '',
        resistance1: '1000',
        resistance2: '1000',
      });
      expect(result.inputVoltage).toMatch(/e/);
    });
  });

  // ── Consistency checks (round-trip) ─────────────────────────────────────

  describe('round-trip consistency', () => {
    test('Vout from Vin,R1,R2 → Vin from Vout,R1,R2 matches', () => {
      const forward = calculate({
        inputVoltage: '24',
        outputVoltage: '',
        resistance1: '4700',
        resistance2: '10000',
      });
      const vout = forward.outputVoltage;

      const reverse = calculate({
        inputVoltage: '',
        outputVoltage: vout,
        resistance1: '4700',
        resistance2: '10000',
      });
      expect(parseFloat(reverse.inputVoltage)).toBeCloseTo(24, 2);
    });

    test('R1 from Vin,Vout,R2 → Vout from Vin,R1,R2 matches', () => {
      const step1 = calculate({
        inputVoltage: '12',
        outputVoltage: '3',
        resistance1: '',
        resistance2: '2200',
      });
      const r1 = step1.resistance1;

      const step2 = calculate({
        inputVoltage: '12',
        outputVoltage: '',
        resistance1: r1,
        resistance2: '2200',
      });
      expect(parseFloat(step2.outputVoltage)).toBeCloseTo(3, 2);
    });
  });
});
