/**
 * Voltage Divider Calculator
 *
 * Core formula:
 *   Vout = Vin × R2 / (R1 + R2)
 *
 * Derived:
 *   Vin  = Vout × (R1 + R2) / R2
 *   R1   = R2 × (Vin - Vout) / Vout
 *   R2   = R1 × Vout / (Vin - Vout)
 *
 * Also computes:
 *   I = Vin / (R1 + R2)   (current through the divider)
 */

export function calculate(inputs) {
  const { inputVoltage, outputVoltage, resistance1, resistance2 } = inputs;

  const vin = inputVoltage !== '' ? parseFloat(inputVoltage) : null;
  const vout = outputVoltage !== '' ? parseFloat(outputVoltage) : null;
  const r1 = resistance1 !== '' ? parseFloat(resistance1) : null;
  const r2 = resistance2 !== '' ? parseFloat(resistance2) : null;

  const filled = [vin, vout, r1, r2].filter((x) => x !== null && !isNaN(x));
  if (filled.length < 3) {
    return { error: 'Enter at least 3 values to calculate.' };
  }

  // Validation
  if (vin !== null && vin < 0) return { error: 'Input voltage cannot be negative.' };
  if (vout !== null && vout < 0) return { error: 'Output voltage cannot be negative.' };
  if (r1 !== null && r1 <= 0) return { error: 'R1 must be greater than zero.' };
  if (r2 !== null && r2 <= 0) return { error: 'R2 must be greater than zero.' };

  let calcVin = vin;
  let calcVout = vout;
  let calcR1 = r1;
  let calcR2 = r2;

  // Solve based on which three are provided
  if (calcVin !== null && calcR1 !== null && calcR2 !== null) {
    // Vout = Vin × R2 / (R1 + R2)
    if (calcVout === null) calcVout = calcVin * calcR2 / (calcR1 + calcR2);
  } else if (calcVout !== null && calcR1 !== null && calcR2 !== null) {
    // Vin = Vout × (R1 + R2) / R2
    if (calcVin === null) calcVin = calcR2 !== 0 ? calcVout * (calcR1 + calcR2) / calcR2 : Infinity;
  } else if (calcVin !== null && calcVout !== null && calcR2 !== null) {
    // R1 = R2 × (Vin - Vout) / Vout
    if (calcR1 === null) calcR1 = calcVout !== 0 ? calcR2 * (calcVin - calcVout) / calcVout : Infinity;
  } else if (calcVin !== null && calcVout !== null && calcR1 !== null) {
    // R2 = R1 × Vout / (Vin - Vout)
    if (calcR2 === null) {
      const diff = calcVin - calcVout;
      calcR2 = diff !== 0 ? calcR1 * calcVout / diff : Infinity;
    }
  }

  // Validate physical constraint: Vout <= Vin for a passive divider
  if (calcVin !== null && calcVout !== null && isFinite(calcVout) && isFinite(calcVin)) {
    if (calcVout > calcVin) {
      return { error: 'Output voltage cannot exceed input voltage in a passive divider.' };
    }
  }

  // Validate derived resistance is positive
  if (calcR1 !== null && isFinite(calcR1) && calcR1 <= 0) {
    return { error: 'Calculated R1 is not physically valid. Check your inputs.' };
  }
  if (calcR2 !== null && isFinite(calcR2) && calcR2 <= 0) {
    return { error: 'Calculated R2 is not physically valid. Check your inputs.' };
  }

  // Compute current through the divider
  let calcCurrent = null;
  if (calcVin !== null && calcR1 !== null && calcR2 !== null) {
    const totalR = calcR1 + calcR2;
    calcCurrent = totalR !== 0 ? calcVin / totalR : Infinity;
  }

  return {
    inputVoltage: formatResult(calcVin),
    outputVoltage: formatResult(calcVout),
    resistance1: formatResult(calcR1),
    resistance2: formatResult(calcR2),
    current: formatResult(calcCurrent),
  };
}

function formatResult(value) {
  if (value === null || value === undefined || !isFinite(value)) return '—';
  if (value === 0) return '0';
  if (Math.abs(value) >= 1e6) return value.toExponential(4);
  if (Math.abs(value) < 0.001 && value !== 0) return value.toExponential(4);
  // Up to 6 significant digits
  return parseFloat(value.toPrecision(6)).toString();
}
