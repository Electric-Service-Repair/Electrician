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
import { calculate } from '../utils/voltageDivider';
import { colors } from '../theme';

const PRIMARY_COLOR = colors.calculators.divider;

export default function VoltageDividerScreen({ onBack }) {
  const [inputVoltage, setInputVoltage] = useState('');
  const [outputVoltage, setOutputVoltage] = useState('');
  const [resistance1, setResistance1] = useState('');
  const [resistance2, setResistance2] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    Keyboard.dismiss();
    const result = calculate({ inputVoltage, outputVoltage, resistance1, resistance2 });
    if (result.error) {
      setError(result.error);
      setResults(null);
    } else {
      setError('');
      setResults(result);
    }
  };

  const handleReset = () => {
    setInputVoltage('');
    setOutputVoltage('');
    setResistance1('');
    setResistance2('');
    setResults(null);
    setError('');
  };

  const filledCount = [inputVoltage, outputVoltage, resistance1, resistance2].filter(
    (v) => v !== ''
  ).length;

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
            <Text style={styles.headerTitle}>Voltage Divider</Text>
            <Text style={styles.headerSubtitle}>Vout = Vin × R2 / (R1 + R2)</Text>
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
          <View style={styles.card}>
            <Text style={styles.instructions}>
              Enter any 3 values to calculate the missing one
            </Text>

            <InputField
              label="Input Voltage"
              unit="Vin (Volts)"
              value={results && inputVoltage === '' ? results.inputVoltage : inputVoltage}
              onChangeText={(text) => {
                setInputVoltage(text);
                setResults(null);
                setError('');
              }}
              isResult={results !== null && inputVoltage === ''}
            />

            <InputField
              label="Output Voltage"
              unit="Vout (Volts)"
              value={results && outputVoltage === '' ? results.outputVoltage : outputVoltage}
              onChangeText={(text) => {
                setOutputVoltage(text);
                setResults(null);
                setError('');
              }}
              isResult={results !== null && outputVoltage === ''}
            />

            <InputField
              label="Resistance 1 (Top)"
              unit="R1 (Ohms)"
              value={results && resistance1 === '' ? results.resistance1 : resistance1}
              onChangeText={(text) => {
                setResistance1(text);
                setResults(null);
                setError('');
              }}
              isResult={results !== null && resistance1 === ''}
            />

            <InputField
              label="Resistance 2 (Bottom)"
              unit="R2 (Ohms)"
              value={results && resistance2 === '' ? results.resistance2 : resistance2}
              onChangeText={(text) => {
                setResistance2(text);
                setResults(null);
                setError('');
              }}
              isResult={results !== null && resistance2 === ''}
            />

            {/* Current through divider — always read-only */}
            {results && results.current && (
              <InputField
                label="Divider Current"
                unit="I (Amps)"
                value={results.current}
                onChangeText={() => {}}
                isResult={true}
                editable={false}
              />
            )}

            {error !== '' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.calcButton,
                  filledCount < 3 && styles.calcButtonDisabled,
                ]}
                onPress={handleCalculate}
                disabled={filledCount < 3}
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

            {/* Circuit diagram */}
            <View style={styles.diagramBox}>
              <Text style={styles.diagramText}>
                {'Vin ──┤R1├──┬──┤R2├── GND\n'}
                {'              │\n'}
                {'             Vout'}
              </Text>
            </View>

            <View style={styles.refGrid}>
              <View style={styles.refItem}>
                <Text style={styles.refLabel}>Output Voltage</Text>
                <Text style={styles.refFormula}>Vin × R2 / (R1 + R2)</Text>
              </View>
              <View style={styles.refItem}>
                <Text style={styles.refLabel}>Input Voltage</Text>
                <Text style={styles.refFormula}>Vout × (R1 + R2) / R2</Text>
              </View>
              <View style={styles.refItem}>
                <Text style={styles.refLabel}>Resistance R1</Text>
                <Text style={styles.refFormula}>R2 × (Vin − Vout) / Vout</Text>
              </View>
              <View style={styles.refItem}>
                <Text style={styles.refLabel}>Resistance R2</Text>
                <Text style={styles.refFormula}>R1 × Vout / (Vin − Vout)</Text>
              </View>
              <View style={styles.refItem}>
                <Text style={styles.refLabel}>Divider Current</Text>
                <Text style={styles.refFormula}>Vin / (R1 + R2)</Text>
              </View>
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
  errorBox: { backgroundColor: '#FFEBEE', borderRadius: 8, padding: 12, marginBottom: 12 },
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
  refTitle: { fontSize: 16, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 10 },
  diagramBox: {
    backgroundColor: '#E0F2F1',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  diagramText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    color: PRIMARY_COLOR,
    lineHeight: 18,
  },
  refGrid: { gap: 8 },
  refItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    borderRadius: 10,
    padding: 12,
  },
  refLabel: { fontSize: 14, fontWeight: '600', color: PRIMARY_COLOR },
  refFormula: { fontSize: 14, color: '#555' },
});
