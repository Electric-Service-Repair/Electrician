/**
 * Transformer Calculator
 *
 * Core formulas (ideal transformer):
 *   V1 / V2 = N1 / N2 = I2 / I1
 *
 * Derived:
 *   V2 = V1 × (N2 / N1)
 *   I2 = I1 × (N1 / N2)
 *   Turns ratio a = N1 / N2
 *
 * Power & efficiency:
 *   Pin  = V1 × I1
 *   Pout = V2 × I2
 *   Efficiency η = (Pout / Pin) × 100
 *   kVA = V × I / 1000
 */

export function calculate(inputs) {
  const { primaryVoltage, secondaryVoltage, primaryTurns, secondaryTurns, primaryCurrent } = inputs;

  const v1 = primaryVoltage !== '' ? parseFloat(primaryVoltage) : null;
  const v2 = secondaryVoltage !== '' ? parseFloat(secondaryVoltage) : null;
  const n1 = primaryTurns !== '' ? parseFloat(primaryTurns) : null;
  const n2 = secondaryTurns !== '' ? parseFloat(secondaryTurns) : null;
  const i1 = primaryCurrent !== '' ? parseFloat(primaryCurrent) : null;

  const filled = [v1, v2, n1, n2, i1].filter((x) => x !== null && !isNaN(x));
  if (filled.length < 2) {
    return { error: 'Enter at least 2 values to calculate.' };
  }

  // Validation
  if (v1 !== null && v1 < 0) return { error: 'Primary voltage cannot be negative.' };
  if (v2 !== null && v2 < 0) return { error: 'Secondary voltage cannot be negative.' };
  if (n1 !== null && n1 <= 0) return { error: 'Primary turns must be greater than zero.' };
  if (n2 !== null && n2 <= 0) return { error: 'Secondary turns must be greater than zero.' };
  if (i1 !== null && i1 < 0) return { error: 'Primary current cannot be negative.' };

  let calcV1 = v1;
  let calcV2 = v2;
  let calcN1 = n1;
  let calcN2 = n2;
  let calcI1 = i1;
  let calcI2 = null;

  // Solve turns ratio from voltages if both voltages known
  if (calcV1 !== null && calcV2 !== null && calcN1 === null && calcN2 !== null) {
    calcN1 = calcV2 !== 0 ? calcN2 * calcV1 / calcV2 : Infinity;
  }
  if (calcV1 !== null && calcV2 !== null && calcN2 === null && calcN1 !== null) {
    calcN2 = calcV1 !== 0 ? calcN1 * calcV2 / calcV1 : Infinity;
  }

  // Solve voltages from turns ratio
  if (calcV1 !== null && calcV2 === null && calcN1 !== null && calcN2 !== null) {
    calcV2 = calcN1 !== 0 ? calcV1 * calcN2 / calcN1 : Infinity;
  }
  if (calcV2 !== null && calcV1 === null && calcN1 !== null && calcN2 !== null) {
    calcV1 = calcN2 !== 0 ? calcV2 * calcN1 / calcN2 : Infinity;
  }

  // Solve current (ideal transformer: V1*I1 = V2*I2, so I2 = I1*N1/N2)
  if (calcI1 !== null && calcN1 !== null && calcN2 !== null) {
    calcI2 = calcN2 !== 0 ? calcI1 * calcN1 / calcN2 : Infinity;
  } else if (calcI1 !== null && calcV1 !== null && calcV2 !== null) {
    calcI2 = calcV2 !== 0 ? calcI1 * calcV1 / calcV2 : Infinity;
  }

  // Compute power values
  let pin = null;
  let pout = null;
  let efficiency = null;
  let kvaRating = null;

  if (calcV1 !== null && calcI1 !== null && isFinite(calcV1) && isFinite(calcI1)) {
    pin = calcV1 * calcI1;
    kvaRating = pin / 1000;
  }
  if (calcV2 !== null && calcI2 !== null && isFinite(calcV2) && isFinite(calcI2)) {
    pout = calcV2 * calcI2;
  }
  if (pin !== null && pout !== null && pin !== 0) {
    efficiency = (pout / pin) * 100;
  }

  // Compute turns ratio
  let turnsRatio = null;
  if (calcN1 !== null && calcN2 !== null && calcN2 !== 0 && isFinite(calcN1) && isFinite(calcN2)) {
    turnsRatio = calcN1 / calcN2;
  }

  return {
    primaryVoltage: formatResult(calcV1),
    secondaryVoltage: formatResult(calcV2),
    primaryTurns: formatResult(calcN1),
    secondaryTurns: formatResult(calcN2),
    primaryCurrent: formatResult(calcI1),
    secondaryCurrent: formatResult(calcI2),
    turnsRatio: formatResult(turnsRatio),
    powerIn: formatResult(pin),
    powerOut: formatResult(pout),
    efficiency: formatResult(efficiency),
    kvaRating: formatResult(kvaRating),
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
