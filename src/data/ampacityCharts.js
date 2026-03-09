// NEC Table 310.16 — Allowable Ampacities of Insulated Conductors
// Rated up to 2000 Volts, 60°C Through 90°C
// Not More Than 3 Current-Carrying Conductors in Raceway, Cable, or Earth

export const copperAmpacity = [
  { awg: '14', temp60: 15, temp75: 20, temp90: 25 },
  { awg: '12', temp60: 20, temp75: 25, temp90: 30 },
  { awg: '10', temp60: 30, temp75: 35, temp90: 40 },
  { awg: '8', temp60: 40, temp75: 50, temp90: 55 },
  { awg: '6', temp60: 55, temp75: 65, temp90: 75 },
  { awg: '4', temp60: 70, temp75: 85, temp90: 95 },
  { awg: '3', temp60: 85, temp75: 100, temp90: 115 },
  { awg: '2', temp60: 95, temp75: 115, temp90: 130 },
  { awg: '1', temp60: 110, temp75: 130, temp90: 145 },
  { awg: '1/0', temp60: 125, temp75: 150, temp90: 170 },
  { awg: '2/0', temp60: 145, temp75: 175, temp90: 195 },
  { awg: '3/0', temp60: 165, temp75: 200, temp90: 225 },
  { awg: '4/0', temp60: 195, temp75: 230, temp90: 260 },
];

export const aluminumAmpacity = [
  { awg: '12', temp60: 15, temp75: 20, temp90: 25 },
  { awg: '10', temp60: 25, temp75: 30, temp90: 35 },
  { awg: '8', temp60: 30, temp75: 40, temp90: 45 },
  { awg: '6', temp60: 40, temp75: 50, temp90: 60 },
  { awg: '4', temp60: 55, temp75: 65, temp90: 75 },
  { awg: '3', temp60: 65, temp75: 75, temp90: 85 },
  { awg: '2', temp60: 75, temp75: 90, temp90: 100 },
  { awg: '1', temp60: 85, temp75: 100, temp90: 115 },
  { awg: '1/0', temp60: 100, temp75: 120, temp90: 135 },
  { awg: '2/0', temp60: 115, temp75: 135, temp90: 150 },
  { awg: '3/0', temp60: 130, temp75: 155, temp90: 175 },
  { awg: '4/0', temp60: 150, temp75: 180, temp90: 205 },
];
