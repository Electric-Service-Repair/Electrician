/**
 * Ohm's Law Calculator
 *
 * Core formulas:
 *   V = I * R
 *   P = V * I
 *
 * Derived:
 *   V = I * R       | V = P / I     | V = sqrt(P * R)
 *   I = V / R       | I = P / V     | I = sqrt(P / R)
 *   R = V / I       | R = V^2 / P   | R = P / I^2
 *   P = V * I       | P = V^2 / R   | P = I^2 * R
 */

export function calculate(inputs) {
  const { voltage, current, resistance, power } = inputs;

  const v = voltage !== '' ? parseFloat(voltage) : null;
  const i = current !== '' ? parseFloat(current) : null;
  const r = resistance !== '' ? parseFloat(resistance) : null;
  const p = power !== '' ? parseFloat(power) : null;

  const filled = [v, i, r, p].filter((x) => x !== null && !isNaN(x));
  if (filled.length < 2) {
    return { error: 'Enter at least 2 values to calculate.' };
  }

  // Check for zero/negative values where they don't make physical sense
  if (v !== null && v < 0) return { error: 'Voltage cannot be negative.' };
  if (i !== null && i < 0) return { error: 'Current cannot be negative.' };
  if (r !== null && r <= 0) return { error: 'Resistance must be greater than zero.' };
  if (p !== null && p < 0) return { error: 'Power cannot be negative.' };

  let calcV = v;
  let calcI = i;
  let calcR = r;
  let calcP = p;

  // Solve based on which two are provided
  if (calcV !== null && calcI !== null) {
    if (calcR === null) calcR = calcI !== 0 ? calcV / calcI : Infinity;
    if (calcP === null) calcP = calcV * calcI;
  } else if (calcV !== null && calcR !== null) {
    if (calcI === null) calcI = calcV / calcR;
    if (calcP === null) calcP = (calcV * calcV) / calcR;
  } else if (calcV !== null && calcP !== null) {
    if (calcI === null) calcI = calcV !== 0 ? calcP / calcV : Infinity;
    if (calcR === null) calcR = calcP !== 0 ? (calcV * calcV) / calcP : Infinity;
  } else if (calcI !== null && calcR !== null) {
    if (calcV === null) calcV = calcI * calcR;
    if (calcP === null) calcP = calcI * calcI * calcR;
  } else if (calcI !== null && calcP !== null) {
    if (calcV === null) calcV = calcI !== 0 ? calcP / calcI : Infinity;
    if (calcR === null) calcR = calcI !== 0 ? calcP / (calcI * calcI) : Infinity;
  } else if (calcR !== null && calcP !== null) {
    if (calcV === null) calcV = Math.sqrt(calcP * calcR);
    if (calcI === null) calcI = Math.sqrt(calcP / calcR);
  }

  return {
    voltage: formatResult(calcV),
    current: formatResult(calcI),
    resistance: formatResult(calcR),
    power: formatResult(calcP),
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
