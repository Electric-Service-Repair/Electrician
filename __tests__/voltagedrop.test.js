const { calculate } = require('../src/utils/voltageDrop');

describe('Voltage Drop Utility', () => {
  test('calculates single-phase copper drop correctly', () => {
    const inputs = {
      phase: '1',
      material: 'copper',
      length: '100',
      current: '20',
      wireSize: '12',
      voltage: '120'
    };

    const result = calculate(inputs);
    
    // (2 * 12.9 * 100 * 20) / 6530 = 7.90
    expect(result.voltageDrop).toBe('7.90');
    expect(result.percentDrop).toBe('6.58');
    expect(result.isSafe).toBe(false); // Over 3%
  });

  test('calculates 3-phase aluminum drop correctly', () => {
    const inputs = {
      phase: '3',
      material: 'aluminum',
      length: '150',
      current: '50',
      wireSize: '2',
      voltage: '480'
    };

    const result = calculate(inputs);
    
    // (1.732 * 21.2 * 150 * 50) / 66360 = 4.15
    expect(result.voltageDrop).toBe('4.15');
    expect(result.isSafe).toBe(true); // Under 3%
  });

  test('returns error for missing fields', () => {
    const result = calculate({ length: '', current: '20' });
    expect(result.error).toBeDefined();
  });

  test('returns error for invalid wire size', () => {
    const result = calculate({ 
      length: '100', 
      current: '20', 
      voltage: '120', 
      wireSize: '999' 
    });
    expect(result.error).toBe('Invalid wire size selected');
  });
});
