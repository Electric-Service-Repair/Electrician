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
import { calculate } from '../utils/ohmsLaw';
import { colors } from '../theme';

const PRIMARY_COLOR = colors.calculators.ohms;

export default function OhmsLawScreen({ onBack }) {
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [resistance, setResistance] = useState('');
  const [power, setPower] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    Keyboard.dismiss();
    const result = calculate({ voltage, current, resistance, power });
    if (result.error) {
      setError(result.error);
      setResults(null);
    } else {
      setError('');
      setResults(result);
    }
  };

  const handleReset = () => {
    setVoltage('');
    setCurrent('');
    setResistance('');
    setPower('');
    setResults(null);
    setError('');
  };

  const filledCount = [voltage, current, resistance, power].filter(
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
            <Text style={styles.headerTitle}>Ohm's Law</Text>
            <Text style={styles.headerSubtitle}>V = I × R</Text>
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
              Enter any 2 values to calculate the rest
            </Text>

            <InputField
              label="Voltage"
              unit="V (Volts)"
              value={results && voltage === '' ? results.voltage : voltage}
              onChangeText={(text) => {
                setVoltage(text);
                setResults(null);
                setError('');
              }}
              isResult={results !== null && voltage === ''}
            />

            <InputField
              label="Current"
              unit="I (Amps)"
              value={results && current === '' ? results.current : current}
              onChangeText={(text) => {
                setCurrent(text);
                setResults(null);
                setError('');
              }}
              isResult={results !== null && current === ''}
            />

            <InputField
              label="Resistance"
              unit="R (Ohms)"
              value={
                results && resistance === '' ? results.resistance : resistance
              }
              onChangeText={(text) => {
                setResistance(text);
                setResults(null);
                setError('');
              }}
              isResult={results !== null && resistance === ''}
            />

            <InputField
              label="Power"
              unit="P (Watts)"
              value={results && power === '' ? results.power : power}
              onChangeText={(text) => {
                setPower(text);
                setResults(null);
                setError('');
              }}
              isResult={results !== null && power === ''}
            />

            {error !== '' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.calcButton,
                  filledCount < 2 && styles.calcButtonDisabled,
                ]}
                onPress={handleCalculate}
                disabled={filledCount < 2}
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

          {/* Full Power Wheel — all 12 formulas */}
          <View style={styles.wheelCard}>
            <Text style={styles.wheelTitle}>Power Wheel — All 12 Formulas</Text>

            {/* Voltage section */}
            <View style={[styles.wheelSection, { backgroundColor: '#E3F2FD' }]}>
              <Text style={[styles.wheelSectionLabel, { color: '#1565C0' }]}>
                Voltage (V)
              </Text>
              <View style={styles.wheelFormulas}>
                <Text style={styles.wheelFormula}>I × R</Text>
                <Text style={styles.wheelFormula}>P / I</Text>
                <Text style={styles.wheelFormula}>√(P × R)</Text>
              </View>
            </View>

            {/* Current section */}
            <View style={[styles.wheelSection, { backgroundColor: '#FFF3E0' }]}>
              <Text style={[styles.wheelSectionLabel, { color: '#E65100' }]}>
                Current (I)
              </Text>
              <View style={styles.wheelFormulas}>
                <Text style={styles.wheelFormula}>V / R</Text>
                <Text style={styles.wheelFormula}>P / V</Text>
                <Text style={styles.wheelFormula}>√(P / R)</Text>
              </View>
            </View>

            {/* Resistance section */}
            <View style={[styles.wheelSection, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.wheelSectionLabel, { color: '#2E7D32' }]}>
                Resistance (R)
              </Text>
              <View style={styles.wheelFormulas}>
                <Text style={styles.wheelFormula}>V / I</Text>
                <Text style={styles.wheelFormula}>V² / P</Text>
                <Text style={styles.wheelFormula}>P / I²</Text>
              </View>
            </View>

            {/* Power section */}
            <View style={[styles.wheelSection, { backgroundColor: '#FCE4EC' }]}>
              <Text style={[styles.wheelSectionLabel, { color: '#C62828' }]}>
                Power (P)
              </Text>
              <View style={styles.wheelFormulas}>
                <Text style={styles.wheelFormula}>V × I</Text>
                <Text style={styles.wheelFormula}>V² / R</Text>
                <Text style={styles.wheelFormula}>I² × R</Text>
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

  // Power Wheel styles
  wheelCard: {
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
  wheelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 14,
  },
  wheelSection: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  wheelSectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  wheelFormulas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  wheelFormula: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
