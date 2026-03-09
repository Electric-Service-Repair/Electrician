/**
 * Voltage Drop Utility
 * Formula: VD = (2 * K * L * I) / CM
 * K = Resistance of wire (12.9 for Copper, 21.2 for Aluminum)
 * L = Length in feet
 * I = Current in Amps
 * CM = Circular Mils of the wire
 */

const K_CONSTANTS = {
  copper: 12.9,
  aluminum: 21.2,
};

// Simplified CM table for common sizes
const CM_TABLE = {
  '14': 4110,
  '12': 6530,
  '10': 10380,
  '8': 16510,
  '6': 26240,
  '4': 41740,
  '2': 66360,
  '1/0': 105600,
  '2/0': 133100,
};

export const calculate = (inputs) => {
  const { phase, material, length, current, wireSize, voltage } = inputs;

  // Validation
  if (!length || !current || !voltage) {
    return { error: 'Please fill in all required fields' };
  }

  const L = parseFloat(length);
  const I = parseFloat(current);
  const V = parseFloat(voltage);
  const K = K_CONSTANTS[material] || K_CONSTANTS.copper;
  const CM = CM_TABLE[wireSize];

  if (isNaN(L) || isNaN(I) || isNaN(V)) {
    return { error: 'Please enter valid numeric values' };
  }

  if (!CM) {
    return { error: 'Invalid wire size selected' };
  }

  // Calculate Voltage Drop
  // For 3-phase, the multiplier is 1.732 instead of 2
  const multiplier = phase === '3' ? 1.732 : 2;
  const voltageDrop = (multiplier * K * L * I) / CM;
  const percentDrop = (voltageDrop / V) * 100;

  return {
    voltageDrop: voltageDrop.toFixed(2),
    percentDrop: percentDrop.toFixed(2),
    actualVoltage: (V - voltageDrop).toFixed(2),
    isSafe: percentDrop <= 3, // NEC recommendation
  };
};
