/**
 * Calculates the total service load for a residential dwelling
 * based on the NEC Article 220 standard method.
 *
 * @param {object} inputs - The user-provided values.
 * @param {number} inputs.squareFeet - Total floor area.
 * @param {number} inputs.smallApplianceCircuits - Number of small appliance circuits.
 * @param {boolean} inputs.laundryCircuit - Whether a laundry circuit is present.
 * @param {number} inputs.fixedApplianceVA - Sum of VA ratings for fixed appliances.
 * @returns {object} An object containing the calculated loads and total service amperage.
 */
export function calculateResidentialLoad({
  squareFeet = 0,
  smallApplianceCircuits = 2,
  laundryCircuit = true,
  fixedApplianceVA = 0,
}) {
  const LIGHTING_VA_PER_SQ_FT = 3;
  const SMALL_APPLIANCE_VA = 1500;
  const LAUNDRY_VA = 1500;
  const SERVICE_VOLTAGE = 240;

  // 1. General Lighting & Receptacle Load
  const generalLightingLoad = squareFeet * LIGHTING_VA_PER_SQ_FT;

  // 2. Small Appliance & Laundry Load
  const smallApplianceLoad = smallApplianceCircuits * SMALL_APPLIANCE_VA;
  const laundryLoad = laundryCircuit ? LAUNDRY_VA : 0;
  const totalConnectedLoad = generalLightingLoad + smallApplianceLoad + laundryLoad;

  // 3. Apply Demand Factors (NEC 220.42)
  let netLoad;
  if (totalConnectedLoad <= 3000) {
    netLoad = totalConnectedLoad;
  } else {
    netLoad = 3000 + (totalConnectedLoad - 3000) * 0.35;
  }

  // 4. Add Fixed Appliances
  const totalLoadVA = netLoad + fixedApplianceVA;

  // 5. Calculate Total Service Amperage
  const serviceAmps = totalLoadVA / SERVICE_VOLTAGE;

  return {
    generalLightingLoad: parseFloat(generalLightingLoad.toFixed(2)),
    smallApplianceLoad: parseFloat(smallApplianceLoad.toFixed(2)),
    laundryLoad: parseFloat(laundryLoad.toFixed(2)),
    totalConnectedLoad: parseFloat(totalConnectedLoad.toFixed(2)),
    netLoad: parseFloat(netLoad.toFixed(2)),
    totalLoadVA: parseFloat(totalLoadVA.toFixed(2)),
    serviceAmps: parseFloat(serviceAmps.toFixed(2)),
  };
}
