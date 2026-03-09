import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import InputField from '../components/InputField';
import {
  MODES,
  calculateWire,
  calculateSolenoid,
  calculateToroid,
} from '../utils/amperesLaw';
import { colors } from '../theme';

const PRIMARY_COLOR = colors.calculators.amperes;

export default function AmperesLawScreen({ onBack }) {
  const [mode, setMode] = useState('wire');
  const [fields, setFields] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const updateField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setResults(null);
    setError('');
  };

  const handleCalculate = () => {
    Keyboard.dismiss();
    const inputs = {};
    const fieldDefs = getFieldDefs();
    fieldDefs.forEach((f) => {
      inputs[f.key] = fields[f.key] || '';
    });

    let result;
    if (mode === 'wire') result = calculateWire(inputs);
    else if (mode === 'solenoid') result = calculateSolenoid(inputs);
    else result = calculateToroid(inputs);

    if (result.error) {
      setError(result.error);
      setResults(null);
    } else {
      setError('');
      setResults(result);
    }
  };

  const handleReset = () => {
    setFields({});
    setResults(null);
    setError('');
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setFields({});
    setResults(null);
    setError('');
  };

  const getFieldDefs = () => {
    const common = [
      { key: 'magneticField', label: 'Magnetic Field', unit: 'B (Tesla)' },
      { key: 'current', label: 'Current', unit: 'I (Amps)' },
    ];
    if (mode === 'wire') {
      return [...common, { key: 'distance', label: 'Distance', unit: 'r (meters)' }];
    }
    if (mode === 'solenoid') {
      return [
        ...common,
        { key: 'turns', label: 'Number of Turns', unit: 'N' },
        { key: 'length', label: 'Length', unit: 'L (meters)' },
      ];
    }
    // toroid
    return [
      ...common,
      { key: 'turns', label: 'Number of Turns', unit: 'N' },
      { key: 'radius', label: 'Mean Radius', unit: 'r (meters)' },
    ];
  };

  const fieldDefs = getFieldDefs();
  const filledCount = fieldDefs.filter((f) => fields[f.key] && fields[f.key] !== '').length;
  const minRequired = mode === 'wire' ? 2 : 3;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
              <Text style={styles.backText}>{'<'} Back</Text>
            </TouchableOpacity>
          )}
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Ampere's Law</Text>
            <Text style={styles.headerSubtitle}>
              {MODES.find((m) => m.key === mode)?.formula}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Mode selector */}
          <View style={styles.modeRow}>
            {MODES.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[styles.modeButton, mode === m.key && styles.modeButtonActive]}
                onPress={() => handleModeChange(m.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.modeText, mode === m.key && styles.modeTextActive]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.instructions}>
              Enter {minRequired === 2 ? 'any 2' : 'any 3'} values to calculate the rest
            </Text>

            {fieldDefs.map((f) => (
              <InputField
                key={f.key}
                label={f.label}
                unit={f.unit}
                value={
                  results && (!fields[f.key] || fields[f.key] === '')
                    ? results[f.key]
                    : fields[f.key] || ''
                }
                onChangeText={(text) => updateField(f.key, text)}
                isResult={results !== null && (!fields[f.key] || fields[f.key] === '')}
              />
            ))}

            {error !== '' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.calcButton,
                  filledCount < minRequired && styles.calcButtonDisabled,
                ]}
                onPress={handleCalculate}
                disabled={filledCount < minRequired}
                activeOpacity={0.7}
              >
                <Text style={styles.calcButtonText}>Calculate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
                activeOpacity={0.7}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reference card */}
          <View style={styles.refCard}>
            <Text style={styles.refTitle}>Quick Reference</Text>
            <Text style={styles.refConstant}>μ₀ = 4π × 10⁻⁷ T·m/A</Text>
            <View style={styles.refGrid}>
              {MODES.map((m) => (
                <View key={m.key} style={styles.refItem}>
                  <Text style={styles.refLabel}>{m.label}</Text>
                  <Text style={styles.refFormula}>{m.formula}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F5' },
  flex: { flex: 1 },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 54,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start' },
  backButton: { marginRight: 12, paddingTop: 4 },
  backText: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: '600' },
  headerTitleWrap: { flex: 1 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff' },
  headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  modeButtonActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  modeText: { fontSize: 13, fontWeight: '600', color: '#666' },
  modeTextActive: { color: '#fff' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  instructions: { fontSize: 14, color: '#777', textAlign: 'center', marginBottom: 18 },
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { color: '#C62828', fontSize: 14, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  calcButton: {
    flex: 2,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  calcButtonDisabled: { backgroundColor: '#B0BEC5', shadowOpacity: 0, elevation: 0 },
  calcButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  resetButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  resetButtonText: { color: '#666', fontSize: 18, fontWeight: '600' },
  refCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  refTitle: { fontSize: 16, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 6 },
  refConstant: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 14 },
  refGrid: { gap: 8 },
  refItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    borderRadius: 10,
    padding: 12,
  },
  refLabel: { fontSize: 14, fontWeight: '600', color: PRIMARY_COLOR },
  refFormula: { fontSize: 14, color: '#555' },
});
