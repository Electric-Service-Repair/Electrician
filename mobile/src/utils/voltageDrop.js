/**
 * Voltage Drop Calculator
 *
 * Calculates voltage drop in electrical conductors based on:
 * - Circuit current (A)
 * - One-way distance (ft)
 * - Wire size (AWG)
 * - Wire material (copper/aluminum)
 * - System type (single-phase/three-phase)
 *
 * Formulas:
 * Single-phase: Vdrop = 2 × K × I × D / CMA
 * Three-phase:  Vdrop = √3 × K × I × D / CMA
 *
 * Where:
 *   K = Resistivity constant (12.9 for Cu, 21.2 for Al)
 *   I = Current in amps
 *   D = One-way distance in feet
 *   CMA = Circular mil area of conductor
 *
 * NEC Guidelines:
 * - Branch circuits: 3% max recommended
 * - Feeders: 2% max recommended
 * - Total: 5% max recommended
 */

// Wire data: AWG size → Circular Mil Area (CMA)
const WIRE_CMA = {
  '14': 4110,
  '12': 6530,
  '10': 10380,
  '8': 16510,
  '6': 26240,
  '4': 41740,
  '3': 52620,
  '2': 66360,
  '1': 83690,
  '1/0': 105600,
  '2/0': 133100,
  '3/0': 167800,
  '4/0': 211600,
  '250': 250000,
  '300': 300000,
  '350': 350000,
  '400': 400000,
  '500': 500000,
  '600': 600000,
  '750': 750000,
  '1000': 1000000,
};

// Material resistivity constants (ohm-cmil/ft)
const RESISTIVITY = {
  copper: 12.9,
  aluminum: 21.2,
};

// System type multipliers
const SYSTEM_MULTIPLIER = {
  'single-phase': 2,
  'three-phase': Math.sqrt(3),
};

/**
 * Calculate voltage drop
 * @param {object} inputs - Calculation inputs
 * @returns {object} Results with voltage drop, percentage, and wire recommendations
 */
export function calculate(inputs) {
  const {
    sourceVoltage,
    current,
    distance,
    wireSize,
    material = 'copper',
    systemType = 'single-phase',
  } = inputs;

  // Validation
  if (!sourceVoltage || sourceVoltage <= 0) {
    return { error: 'Please enter a valid source voltage greater than 0' };
  }

  if (!current || current <= 0) {
    return { error: 'Please enter a valid current greater than 0' };
  }

  if (!distance || distance <= 0) {
    return { error: 'Please enter a valid distance greater than 0' };
  }

  if (!wireSize || !WIRE_CMA[wireSize]) {
    return { error: 'Please select a valid wire size' };
  }

  // Get values
  const K = RESISTIVITY[material];
  const CMA = WIRE_CMA[wireSize];
  const multiplier = SYSTEM_MULTIPLIER[systemType];

  // Calculate voltage drop
  // Vdrop = (2 or √3) × K × I × D / CMA
  const voltageDrop = (multiplier * K * current * distance) / CMA;

  // Calculate percentage
  const voltageDropPercent = (voltageDrop / sourceVoltage) * 100;

  // Calculate voltage at load
  const loadVoltage = sourceVoltage - voltageDrop;

  // Calculate power loss in conductors
  // P = I × Vdrop
  const powerLoss = current * voltageDrop;

  // Calculate resistance of conductor
  // R = K × D / CMA (for one conductor)
  const resistance = (K * distance) / CMA;
  const totalResistance = multiplier === 2 ? resistance * 2 : resistance * Math.sqrt(3);

  // NEC compliance check
  let necCompliance = 'Excellent';
  let necMessage = 'Voltage drop is within NEC recommendations';

  if (voltageDropPercent > 5) {
    necCompliance = 'Non-Compliant';
    necMessage = 'Exceeds NEC 5% total system recommendation';
  } else if (voltageDropPercent > 3) {
    necCompliance = 'Marginal';
    necMessage = 'Exceeds NEC 3% branch circuit recommendation';
  } else if (voltageDropPercent > 2) {
    necCompliance = 'Good';
    necMessage = 'Within NEC guidelines, above 2% feeder recommendation';
  }

  return {
    sourceVoltage: formatResult(sourceVoltage),
    current: formatResult(current),
    distance: formatResult(distance),
    wireSize,
    material,
    systemType,

    // Results
    voltageDrop: formatResult(voltageDrop),
    voltageDropPercent: formatResult(voltageDropPercent),
    loadVoltage: formatResult(loadVoltage),
    powerLoss: formatResult(powerLoss),
    resistance: formatResult(resistance),
    totalResistance: formatResult(totalResistance),

    // NEC compliance
    necCompliance,
    necMessage,
  };
}

/**
 * Recommend minimum wire size for acceptable voltage drop
 * @param {object} inputs - Calculation inputs
 * @param {number} maxDropPercent - Maximum acceptable voltage drop percentage (default 3%)
 * @returns {object} Recommended wire size and results
 */
export function recommendWireSize(inputs, maxDropPercent = 3) {
  const {
    sourceVoltage,
    current,
    distance,
    material = 'copper',
    systemType = 'single-phase',
  } = inputs;

  // Validation
  if (!sourceVoltage || sourceVoltage <= 0 || !current || current <= 0 || !distance || distance <= 0) {
    return { error: 'Please provide valid voltage, current, and distance' };
  }

  const K = RESISTIVITY[material];
  const multiplier = SYSTEM_MULTIPLIER[systemType];
  const maxVoltageDrop = (maxDropPercent / 100) * sourceVoltage;

  // Calculate required CMA
  // CMA = (2 or √3) × K × I × D / Vdrop
  const requiredCMA = (multiplier * K * current * distance) / maxVoltageDrop;

  // Find smallest wire size that meets requirement
  const wireSizes = Object.keys(WIRE_CMA);
  let recommendedSize = null;

  for (const size of wireSizes) {
    if (WIRE_CMA[size] >= requiredCMA) {
      recommendedSize = size;
      break;
    }
  }

  if (!recommendedSize) {
    return {
      error: 'Required conductor size exceeds available wire sizes. Consider reducing distance or current, or using parallel conductors.',
      requiredCMA: formatResult(requiredCMA),
    };
  }

  // Calculate actual drop with recommended size
  const actualVoltageDrop = (multiplier * K * current * distance) / WIRE_CMA[recommendedSize];
  const actualDropPercent = (actualVoltageDrop / sourceVoltage) * 100;

  return {
    recommendedSize,
    requiredCMA: formatResult(requiredCMA),
    actualCMA: WIRE_CMA[recommendedSize],
    actualVoltageDrop: formatResult(actualVoltageDrop),
    actualDropPercent: formatResult(actualDropPercent),
    maxDropPercent,
  };
}

/**
 * Get available wire sizes
 * @returns {Array} Array of wire size objects with label and value
 */
export function getWireSizes() {
  return Object.keys(WIRE_CMA).map(size => ({
    label: `${size} AWG`,
    value: size,
  }));
}

/**
 * Format result to appropriate precision
 */
function formatResult(value) {
  if (value == null || isNaN(value)) return null;
  if (!isFinite(value)) return 'Infinity';

  // Use appropriate precision
  if (Math.abs(value) < 0.01) {
    return value.toExponential(3);
  }

  // Round to 4 significant figures
  return parseFloat(value.toPrecision(4));
}

export default {
  calculate,
  recommendWireSize,
  getWireSizes,
  WIRE_CMA,
  RESISTIVITY,
  SYSTEM_MULTIPLIER,
};
