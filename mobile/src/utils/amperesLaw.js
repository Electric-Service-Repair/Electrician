/**
 * Ampere's Law Calculator
 *
 * Configurations:
 *   1. Straight Wire:  B = μ₀ × I / (2π × r)
 *   2. Solenoid:       B = μ₀ × (N / L) × I
 *   3. Toroid:         B = μ₀ × N × I / (2π × r)
 *
 * Where:
 *   B  = Magnetic field (Tesla)
 *   I  = Current (Amps)
 *   r  = Distance from wire / mean radius (meters)
 *   N  = Number of turns
 *   L  = Length of solenoid (meters)
 *   μ₀ = 4π × 10⁻⁷ T·m/A (permeability of free space)
 */

const MU_0 = 4 * Math.PI * 1e-7; // T·m/A

export const MODES = [
  { key: 'wire', label: 'Straight Wire', formula: 'B = μ₀I / 2πr' },
  { key: 'solenoid', label: 'Solenoid', formula: 'B = μ₀nI' },
  { key: 'toroid', label: 'Toroid', formula: 'B = μ₀NI / 2πr' },
];

export function calculateWire(inputs) {
  const { magneticField, current, distance } = inputs;
  const B = magneticField !== '' ? parseFloat(magneticField) : null;
  const I = current !== '' ? parseFloat(current) : null;
  const r = distance !== '' ? parseFloat(distance) : null;

  const filled = [B, I, r].filter((x) => x !== null && !isNaN(x));
  if (filled.length < 2) return { error: 'Enter at least 2 values to calculate.' };

  if (r !== null && r <= 0) return { error: 'Distance must be greater than zero.' };
  if (I !== null && I < 0) return { error: 'Current cannot be negative.' };
  if (B !== null && B < 0) return { error: 'Magnetic field cannot be negative.' };

  let calcB = B, calcI = I, calcR = r;

  // B = μ₀ * I / (2π * r)
  if (calcB === null && calcI !== null && calcR !== null) {
    calcB = (MU_0 * calcI) / (2 * Math.PI * calcR);
  } else if (calcI === null && calcB !== null && calcR !== null) {
    calcI = (calcB * 2 * Math.PI * calcR) / MU_0;
  } else if (calcR === null && calcB !== null && calcI !== null) {
    calcR = calcB !== 0 ? (MU_0 * calcI) / (2 * Math.PI * calcB) : Infinity;
  }

  return {
    magneticField: formatResult(calcB),
    current: formatResult(calcI),
    distance: formatResult(calcR),
  };
}

export function calculateSolenoid(inputs) {
  const { magneticField, current, turns, length } = inputs;
  const B = magneticField !== '' ? parseFloat(magneticField) : null;
  const I = current !== '' ? parseFloat(current) : null;
  const N = turns !== '' ? parseFloat(turns) : null;
  const L = length !== '' ? parseFloat(length) : null;

  const filled = [B, I, N, L].filter((x) => x !== null && !isNaN(x));
  if (filled.length < 3) return { error: 'Enter at least 3 values to calculate.' };

  if (L !== null && L <= 0) return { error: 'Length must be greater than zero.' };
  if (N !== null && N <= 0) return { error: 'Number of turns must be greater than zero.' };
  if (I !== null && I < 0) return { error: 'Current cannot be negative.' };
  if (B !== null && B < 0) return { error: 'Magnetic field cannot be negative.' };

  let calcB = B, calcI = I, calcN = N, calcL = L;

  // B = μ₀ * (N/L) * I
  if (calcB === null && calcI !== null && calcN !== null && calcL !== null) {
    calcB = MU_0 * (calcN / calcL) * calcI;
  } else if (calcI === null && calcB !== null && calcN !== null && calcL !== null) {
    calcI = (calcB * calcL) / (MU_0 * calcN);
  } else if (calcN === null && calcB !== null && calcI !== null && calcL !== null) {
    calcN = calcI !== 0 ? (calcB * calcL) / (MU_0 * calcI) : Infinity;
  } else if (calcL === null && calcB !== null && calcI !== null && calcN !== null) {
    calcL = calcB !== 0 ? (MU_0 * calcN * calcI) / calcB : Infinity;
  }

  return {
    magneticField: formatResult(calcB),
    current: formatResult(calcI),
    turns: formatResult(calcN),
    length: formatResult(calcL),
  };
}

export function calculateToroid(inputs) {
  const { magneticField, current, turns, radius } = inputs;
  const B = magneticField !== '' ? parseFloat(magneticField) : null;
  const I = current !== '' ? parseFloat(current) : null;
  const N = turns !== '' ? parseFloat(turns) : null;
  const r = radius !== '' ? parseFloat(radius) : null;

  const filled = [B, I, N, r].filter((x) => x !== null && !isNaN(x));
  if (filled.length < 3) return { error: 'Enter at least 3 values to calculate.' };

  if (r !== null && r <= 0) return { error: 'Radius must be greater than zero.' };
  if (N !== null && N <= 0) return { error: 'Number of turns must be greater than zero.' };
  if (I !== null && I < 0) return { error: 'Current cannot be negative.' };
  if (B !== null && B < 0) return { error: 'Magnetic field cannot be negative.' };

  let calcB = B, calcI = I, calcN = N, calcR = r;

  // B = μ₀ * N * I / (2π * r)
  if (calcB === null && calcI !== null && calcN !== null && calcR !== null) {
    calcB = (MU_0 * calcN * calcI) / (2 * Math.PI * calcR);
  } else if (calcI === null && calcB !== null && calcN !== null && calcR !== null) {
    calcI = (calcB * 2 * Math.PI * calcR) / (MU_0 * calcN);
  } else if (calcN === null && calcB !== null && calcI !== null && calcR !== null) {
    calcN = calcI !== 0 ? (calcB * 2 * Math.PI * calcR) / (MU_0 * calcI) : Infinity;
  } else if (calcR === null && calcB !== null && calcI !== null && calcN !== null) {
    calcR = calcB !== 0 ? (MU_0 * calcN * calcI) / (2 * Math.PI * calcB) : Infinity;
  }

  return {
    magneticField: formatResult(calcB),
    current: formatResult(calcI),
    turns: formatResult(calcN),
    radius: formatResult(calcR),
  };
}

function formatResult(value) {
  if (value === null || value === undefined || !isFinite(value)) return '—';
  if (value === 0) return '0';
  if (Math.abs(value) >= 1e6) return value.toExponential(4);
  if (Math.abs(value) < 0.001 && value !== 0) return value.toExponential(4);
  return parseFloat(value.toPrecision(6)).toString();
}
