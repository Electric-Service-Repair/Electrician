const { simulate, getOutputs, MOTOR_CONTROL_CIRCUIT } = require('../src/utils/ladderLogic');

const circuit = MOTOR_CONTROL_CIRCUIT;

// Helper: default all inputs off
const off = () => ({ Start_Btn: false, Stop_Btn: false, OL_Sensor: false });

describe('Ladder Logic Simulator', () => {
  // ── Motor Start ─────────────────────────────────────────────────────────

  describe('motor start', () => {
    test('motor starts when Start is pressed', () => {
      const inputs = { ...off(), Start_Btn: true };
      const result = simulate(circuit, inputs);
      expect(result.Motor_Coil).toBe(true);
      expect(result.Run_Light).toBe(true);
    });

    test('motor does not start with all inputs off', () => {
      const result = simulate(circuit, off());
      expect(result.Motor_Coil).toBe(false);
      expect(result.Run_Light).toBe(false);
    });
  });

  // ── Seal-in (Latching) ─────────────────────────────────────────────────

  describe('seal-in circuit', () => {
    test('motor stays running after Start is released (seal-in)', () => {
      // First: start the motor
      const startResult = simulate(circuit, { ...off(), Start_Btn: true });
      expect(startResult.Motor_Coil).toBe(true);

      // Then: release Start, but feed back Motor_Coil state
      const holdInputs = { ...off(), Motor_Coil: true };
      const holdResult = simulate(circuit, holdInputs);
      expect(holdResult.Motor_Coil).toBe(true);
      expect(holdResult.Run_Light).toBe(true);
    });
  });

  // ── Motor Stop ──────────────────────────────────────────────────────────

  describe('motor stop', () => {
    test('motor stops when Stop is pressed', () => {
      // Motor running (sealed in)
      const inputs = { ...off(), Motor_Coil: true, Stop_Btn: true };
      const result = simulate(circuit, inputs);
      expect(result.Motor_Coil).toBe(false);
      expect(result.Run_Light).toBe(false);
    });

    test('motor cannot start while Stop is pressed', () => {
      const inputs = { ...off(), Start_Btn: true, Stop_Btn: true };
      const result = simulate(circuit, inputs);
      expect(result.Motor_Coil).toBe(false);
    });
  });

  // ── Overload Fault ──────────────────────────────────────────────────────

  describe('overload fault', () => {
    test('motor stops on overload', () => {
      const inputs = { ...off(), Motor_Coil: true, OL_Sensor: true };
      const result = simulate(circuit, inputs);
      expect(result.Motor_Coil).toBe(false);
    });

    test('fault light activates on overload', () => {
      const inputs = { ...off(), OL_Sensor: true };
      const result = simulate(circuit, inputs);
      expect(result.Fault_Light).toBe(true);
    });

    test('fault light is off when no overload', () => {
      const result = simulate(circuit, off());
      expect(result.Fault_Light).toBe(false);
    });

    test('motor cannot start during overload', () => {
      const inputs = { ...off(), Start_Btn: true, OL_Sensor: true };
      const result = simulate(circuit, inputs);
      expect(result.Motor_Coil).toBe(false);
      expect(result.Fault_Light).toBe(true);
    });
  });

  // ── Run Light ───────────────────────────────────────────────────────────

  describe('run light', () => {
    test('run light follows motor state', () => {
      const onResult = simulate(circuit, { ...off(), Start_Btn: true });
      expect(onResult.Run_Light).toBe(true);

      const offResult = simulate(circuit, off());
      expect(offResult.Run_Light).toBe(false);
    });
  });

  // ── getOutputs ──────────────────────────────────────────────────────────

  describe('getOutputs', () => {
    test('returns only output tags', () => {
      const simResult = simulate(circuit, { ...off(), Start_Btn: true });
      const outputs = getOutputs(circuit, simResult);

      expect(outputs).toHaveProperty('Motor_Coil');
      expect(outputs).toHaveProperty('Run_Light');
      expect(outputs).toHaveProperty('Fault_Light');
      expect(outputs).not.toHaveProperty('Start_Btn');
      expect(outputs).not.toHaveProperty('Stop_Btn');
    });
  });

  // ── Validation ──────────────────────────────────────────────────────────

  describe('validation', () => {
    test('invalid circuit returns error', () => {
      const result = simulate(null, {});
      expect(result.error).toBeDefined();
    });

    test('empty rungs array works', () => {
      const result = simulate({ rungs: [] }, { foo: true });
      expect(result.foo).toBe(true);
    });
  });
});
