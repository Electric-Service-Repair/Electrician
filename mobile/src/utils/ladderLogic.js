/**
 * PLC Ladder Logic Simulator
 *
 * Simulates basic ladder logic circuits used in motor control.
 * Supports NO/NC contacts, coils, parallel branches, series elements,
 * and seal-in (latching) circuits.
 *
 * Contact types:
 *   NO (Normally Open)  — passes power when tag state is TRUE
 *   NC (Normally Closed) — passes power when tag state is FALSE
 *
 * A rung evaluates as:
 *   (any parallel branch passes) AND (all series elements pass) → output energized
 */

/**
 * Evaluate a single contact against current states
 */
function evaluateContact(contact, states) {
  const state = !!states[contact.tag];
  return contact.type === 'NC' ? !state : state;
}

/**
 * Evaluate a single rung
 * Parallel branches: at least one must pass (OR)
 * Series elements: all must pass (AND)
 */
function evaluateRung(rung, states) {
  const branchResult = rung.branches.some((branch) =>
    branch.every((contact) => evaluateContact(contact, states))
  );

  const seriesResult = rung.series.every((contact) =>
    evaluateContact(contact, states)
  );

  return branchResult && seriesResult;
}

/**
 * Simulate a ladder logic circuit
 *
 * Iterates until outputs stabilize (handles feedback like seal-in circuits).
 *
 * @param {object} circuit - Circuit definition with rungs array
 * @param {object} inputs - Input tag states { tag: boolean }
 * @returns {object} All tag states after simulation (inputs + computed outputs)
 */
export function simulate(circuit, inputs) {
  if (!circuit || !circuit.rungs || !Array.isArray(circuit.rungs)) {
    return { error: 'Invalid circuit definition' };
  }

  let states = { ...inputs };

  // Iterate to handle feedback loops (max 10 to prevent infinite loops)
  for (let i = 0; i < 10; i++) {
    const prevStates = { ...states };

    for (const rung of circuit.rungs) {
      states[rung.output.tag] = evaluateRung(rung, states);
    }

    // Check if stable
    let stable = true;
    for (const key of Object.keys(states)) {
      if (states[key] !== prevStates[key]) {
        stable = false;
        break;
      }
    }
    if (stable) break;
  }

  return states;
}

/**
 * Get output states only (filter out input tags)
 */
export function getOutputs(circuit, simulationResult) {
  const result = {};
  for (const rung of circuit.rungs) {
    const tag = rung.output.tag;
    result[tag] = !!simulationResult[tag];
  }
  return result;
}

/**
 * Default motor control circuit
 *
 * Rung 1: Start/Stop with seal-in
 *   (Start OR Motor_Coil) AND NOT Stop AND NOT Overload → Motor_Coil
 *
 * Rung 2: Run indicator
 *   Motor_Coil → Run_Light
 *
 * Rung 3: Fault indicator
 *   Overload → Fault_Light
 */
export const MOTOR_CONTROL_CIRCUIT = {
  name: 'Basic Motor Control',
  description: 'Standard 3-rung motor start/stop with seal-in and fault handling',
  inputs: [
    { tag: 'Start_Btn', label: 'Start', momentary: true },
    { tag: 'Stop_Btn', label: 'Stop', momentary: false },
    { tag: 'OL_Sensor', label: 'Overload', momentary: false },
  ],
  outputs: [
    { tag: 'Motor_Coil', label: 'Motor' },
    { tag: 'Run_Light', label: 'Run Light' },
    { tag: 'Fault_Light', label: 'Fault' },
  ],
  rungs: [
    {
      id: 'rung_1',
      comment: 'Motor Start/Stop & Seal-in',
      branches: [
        [{ type: 'NO', tag: 'Start_Btn', label: 'Start' }],
        [{ type: 'NO', tag: 'Motor_Coil', label: 'Seal-in' }],
      ],
      series: [
        { type: 'NC', tag: 'Stop_Btn', label: 'Stop' },
        { type: 'NC', tag: 'OL_Sensor', label: 'Overload' },
      ],
      output: { tag: 'Motor_Coil', label: 'Motor Contactor' },
    },
    {
      id: 'rung_2',
      comment: 'Run Indicator Light',
      branches: [
        [{ type: 'NO', tag: 'Motor_Coil', label: 'Motor Running' }],
      ],
      series: [],
      output: { tag: 'Run_Light', label: 'Run Light' },
    },
    {
      id: 'rung_3',
      comment: 'Fault Handling',
      branches: [
        [{ type: 'NO', tag: 'OL_Sensor', label: 'Overload' }],
      ],
      series: [],
      output: { tag: 'Fault_Light', label: 'Fault Light' },
    },
  ],
};

/**
 * Generate ASCII representation of a rung
 */
export function rungToAscii(rung) {
  const branchLabels = rung.branches.map((branch) =>
    branch.map((c) => {
      const symbol = c.type === 'NC' ? '|/|' : '| |';
      return `${c.label} ${symbol}`;
    }).join('──')
  );

  const seriesLabels = rung.series.map((c) => {
    const symbol = c.type === 'NC' ? '|/|' : '| |';
    return `${c.label} ${symbol}`;
  });

  const outputLabel = `(${rung.output.label})`;
  const lines = [];

  if (branchLabels.length === 1) {
    const contacts = [...branchLabels, ...seriesLabels].join('──');
    lines.push(`──${contacts}──${outputLabel}──`);
  } else {
    lines.push(`──┬─${branchLabels[0]}─┬─${seriesLabels.join('──')}──${outputLabel}──`);
    for (let i = 1; i < branchLabels.length; i++) {
      const connector = i === branchLabels.length - 1 ? '└' : '├';
      lines.push(`  ${connector}─${branchLabels[i]}─┘`);
    }
  }

  return lines;
}

export default {
  simulate,
  getOutputs,
  rungToAscii,
  MOTOR_CONTROL_CIRCUIT,
};
