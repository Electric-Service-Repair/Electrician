/**
 * Conduit Fill Calculator
 *
 * Calculates conduit fill percentage based on NEC Chapter 9, Table 1:
 *   - 1 wire: 53% max fill
 *   - 2 wires: 31% max fill
 *   - 3+ wires: 40% max fill
 *
 * Supports conduit types: EMT, IMC, RMC, PVC (Schedule 40/80)
 * Wire types: THHN/THWN-2, XHHW, USE-2
 *
 * NEC References:
 *   - Chapter 9, Table 1 — Percent fill
 *   - Chapter 9, Table 4 — Conduit dimensions
 *   - Chapter 9, Table 5 — Wire dimensions
 */

// Conduit internal areas in square inches — NEC Chapter 9, Table 4
const CONDUIT_AREA = {
  EMT: {
    '1/2': 0.304, '3/4': 0.533, '1': 0.864, '1-1/4': 1.496,
    '1-1/2': 2.036, '2': 3.356, '2-1/2': 5.858, '3': 8.846,
    '3-1/2': 11.545, '4': 14.753,
  },
  IMC: {
    '1/2': 0.342, '3/4': 0.586, '1': 0.959, '1-1/4': 1.647,
    '1-1/2': 2.225, '2': 3.630, '2-1/2': 5.135, '3': 8.085,
    '3-1/2': 10.584, '4': 13.631,
  },
  RMC: {
    '1/2': 0.314, '3/4': 0.549, '1': 0.887, '1-1/4': 1.526,
    '1-1/2': 2.071, '2': 3.408, '2-1/2': 4.866, '3': 7.499,
    '3-1/2': 9.521, '4': 12.554,
  },
  'PVC-40': {
    '1/2': 0.285, '3/4': 0.508, '1': 0.832, '1-1/4': 1.453,
    '1-1/2': 1.986, '2': 3.291, '2-1/2': 4.695, '3': 7.268,
    '3-1/2': 9.737, '4': 12.554,
  },
  'PVC-80': {
    '1/2': 0.217, '3/4': 0.409, '1': 0.688, '1-1/4': 1.237,
    '1-1/2': 1.711, '2': 2.874, '2-1/2': 4.119, '3': 6.442,
    '3-1/2': 8.688, '4': 11.258,
  },
};

// Wire cross-sectional areas in square inches — NEC Chapter 9, Table 5
// THHN/THWN-2 (most common)
const WIRE_AREA = {
  'THHN': {
    '14': 0.0097, '12': 0.0133, '10': 0.0211, '8': 0.0366,
    '6': 0.0507, '4': 0.0824, '3': 0.0973, '2': 0.1158,
    '1': 0.1562, '1/0': 0.1855, '2/0': 0.2223, '3/0': 0.2679,
    '4/0': 0.3237, '250': 0.3970, '300': 0.4608, '350': 0.5242,
    '400': 0.5863, '500': 0.7073, '600': 0.8676, '750': 1.0496,
  },
  'XHHW': {
    '14': 0.0097, '12': 0.0133, '10': 0.0211, '8': 0.0437,
    '6': 0.0590, '4': 0.0814, '3': 0.0962, '2': 0.1146,
    '1': 0.1534, '1/0': 0.1825, '2/0': 0.2190, '3/0': 0.2642,
    '4/0': 0.3197, '250': 0.3904, '300': 0.4536, '350': 0.5166,
    '400': 0.5782, '500': 0.6984, '600': 0.8709, '750': 1.0532,
  },
};

// Max fill percentages per NEC Chapter 9, Table 1
function getMaxFillPercent(wireCount) {
  if (wireCount === 1) return 53;
  if (wireCount === 2) return 31;
  return 40;
}

/**
 * Calculate conduit fill
 * @param {object} inputs
 * @param {string} inputs.conduitType - EMT, IMC, RMC, PVC-40, PVC-80
 * @param {string} inputs.conduitSize - Trade size (e.g., '1/2', '3/4', '1')
 * @param {Array} inputs.wires - Array of { wireSize, wireType, count }
 * @returns {object} Fill results
 */
export function calculate(inputs) {
  const { conduitType, conduitSize, wires } = inputs;

  if (!conduitType || !CONDUIT_AREA[conduitType]) {
    return { error: 'Please select a valid conduit type (EMT, IMC, RMC, PVC-40, PVC-80)' };
  }

  if (!conduitSize || !CONDUIT_AREA[conduitType][conduitSize]) {
    return { error: 'Please select a valid conduit size' };
  }

  if (!wires || !Array.isArray(wires) || wires.length === 0) {
    return { error: 'Please add at least one wire' };
  }

  const conduitArea = CONDUIT_AREA[conduitType][conduitSize];
  let totalWireArea = 0;
  let totalWireCount = 0;
  const wireDetails = [];

  for (const wire of wires) {
    const { wireSize, wireType = 'THHN', count = 1 } = wire;
    const wireTable = WIRE_AREA[wireType];

    if (!wireTable) {
      return { error: `Unknown wire type: ${wireType}. Use THHN or XHHW.` };
    }

    if (!wireTable[wireSize]) {
      return { error: `Unknown wire size: ${wireSize} AWG for ${wireType}` };
    }

    const areaPerWire = wireTable[wireSize];
    const wireCount = parseInt(count, 10) || 1;
    const totalArea = areaPerWire * wireCount;

    totalWireArea += totalArea;
    totalWireCount += wireCount;

    wireDetails.push({
      wireSize,
      wireType,
      count: wireCount,
      areaPerWire: round(areaPerWire, 4),
      totalArea: round(totalArea, 4),
    });
  }

  const maxFillPercent = getMaxFillPercent(totalWireCount);
  const allowableArea = conduitArea * (maxFillPercent / 100);
  const fillPercent = (totalWireArea / conduitArea) * 100;
  const compliant = fillPercent <= maxFillPercent;

  let compliance;
  if (fillPercent <= maxFillPercent * 0.75) {
    compliance = 'Excellent';
  } else if (fillPercent <= maxFillPercent) {
    compliance = 'Compliant';
  } else {
    compliance = 'Non-Compliant';
  }

  return {
    conduitType,
    conduitSize,
    conduitArea: round(conduitArea, 4),
    totalWireArea: round(totalWireArea, 4),
    totalWireCount,
    fillPercent: round(fillPercent, 1),
    maxFillPercent,
    allowableArea: round(allowableArea, 4),
    remainingArea: round(allowableArea - totalWireArea, 4),
    compliant,
    compliance,
    wireDetails,
  };
}

/**
 * Recommend smallest conduit size for given wires
 * @param {object} inputs
 * @param {string} inputs.conduitType - Conduit type
 * @param {Array} inputs.wires - Array of { wireSize, wireType, count }
 * @returns {object} Recommended conduit size
 */
export function recommendConduitSize(inputs) {
  const { conduitType, wires } = inputs;

  if (!conduitType || !CONDUIT_AREA[conduitType]) {
    return { error: 'Please select a valid conduit type' };
  }

  if (!wires || !Array.isArray(wires) || wires.length === 0) {
    return { error: 'Please add at least one wire' };
  }

  const sizes = Object.keys(CONDUIT_AREA[conduitType]);

  for (const size of sizes) {
    const result = calculate({ conduitType, conduitSize: size, wires });
    if (!result.error && result.compliant) {
      return {
        recommendedSize: size,
        conduitType,
        fillPercent: result.fillPercent,
        maxFillPercent: result.maxFillPercent,
      };
    }
  }

  return { error: 'No standard conduit size is large enough. Consider splitting into multiple conduits.' };
}

export function getConduitTypes() {
  return Object.keys(CONDUIT_AREA);
}

export function getConduitSizes(conduitType) {
  return CONDUIT_AREA[conduitType] ? Object.keys(CONDUIT_AREA[conduitType]) : [];
}

export function getWireTypes() {
  return Object.keys(WIRE_AREA);
}

export function getWireSizes(wireType = 'THHN') {
  return WIRE_AREA[wireType] ? Object.keys(WIRE_AREA[wireType]) : [];
}

function round(value, decimals) {
  return parseFloat(value.toFixed(decimals));
}
