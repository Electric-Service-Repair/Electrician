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
import { calculate } from '../utils/transformerCalculations';
import { colors } from '../theme';

export default function TransformersScreen({ onBack }) {
  const [primaryVoltage, setPrimaryVoltage] = useState('');
  const [secondaryVoltage, setSecondaryVoltage] = useState('');
  const [primaryTurns, setPrimaryTurns] = useState('');
  const [secondaryTurns, setSecondaryTurns] = useState('');
  const [primaryCurrent, setPrimaryCurrent] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    Keyboard.dismiss();
    const result = calculate({
      primaryVoltage,
      secondaryVoltage,
      primaryTurns,
      secondaryTurns,
      primaryCurrent,
    });
    if (result.error) {
      setError(result.error);
      setResults(null);
    } else {
      setError('');
      setResults(result);
    }
  };

  const handleReset = () => {
    setPrimaryVoltage('');
    setSecondaryVoltage('');
    setPrimaryTurns('');
    setSecondaryTurns('');
    setPrimaryCurrent('');
    setResults(null);
    setError('');
  };

  const clearField = (setter) => (text) => {
    setter(text);
    setResults(null);
    setError('');
  };

  const filledCount = [primaryVoltage, secondaryVoltage, primaryTurns, secondaryTurns, primaryCurrent].filter(
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
            <Text style={styles.headerTitle}>Transformers</Text>
            <Text style={styles.headerSubtitle}>V1/V2 = N1/N2 = I2/I1</Text>
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
              Enter at least 2 values to calculate transformer parameters
            </Text>

            <Text style={styles.sectionLabel}>Primary Side</Text>

            <InputField
              label="Primary Voltage"
              unit="V1 (Volts)"
              value={results && primaryVoltage === '' ? results.primaryVoltage : primaryVoltage}
              onChangeText={clearField(setPrimaryVoltage)}
              isResult={results !== null && primaryVoltage === ''}
            />

            <InputField
              label="Primary Turns"
              unit="N1"
              value={results && primaryTurns === '' ? results.primaryTurns : primaryTurns}
              onChangeText={clearField(setPrimaryTurns)}
              isResult={results !== null && primaryTurns === ''}
            />

            <InputField
              label="Primary Current"
              unit="I1 (Amps)"
              value={results && primaryCurrent === '' ? results.primaryCurrent : primaryCurrent}
              onChangeText={clearField(setPrimaryCurrent)}
              isResult={results !== null && primaryCurrent === ''}
            />

            <Text style={styles.sectionLabel}>Secondary Side</Text>

            <InputField
              label="Secondary Voltage"
              unit="V2 (Volts)"
              value={results && secondaryVoltage === '' ? results.secondaryVoltage : secondaryVoltage}
              onChangeText={clearField(setSecondaryVoltage)}
              isResult={results !== null && secondaryVoltage === ''}
            />

            <InputField
              label="Secondary Turns"
              unit="N2"
              value={results && secondaryTurns === '' ? results.secondaryTurns : secondaryTurns}
              onChangeText={clearField(setSecondaryTurns)}
              isResult={results !== null && secondaryTurns === ''}
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

          {/* Computed Results Card */}
          {results && (
            <View style={styles.resultsCard}>
              <Text style={styles.resultsTitle}>Computed Results</Text>

              <ResultRow label="Turns Ratio (a)" value={results.turnsRatio} unit="N1:N2" />
              <ResultRow label="Secondary Current" value={results.secondaryCurrent} unit="A" />
              <ResultRow label="Input Power" value={results.powerIn} unit="W" />
              <ResultRow label="Output Power" value={results.powerOut} unit="W" />
              <ResultRow label="Efficiency" value={results.efficiency} unit="%" />
              <ResultRow label="kVA Rating" value={results.kvaRating} unit="kVA" />
            </View>
          )}

          {/* Reference Card */}
          <View style={styles.refCard}>
            <Text style={styles.refTitle}>Transformer Formulas</Text>

            <View style={[styles.refSection, { backgroundColor: '#E8EAF6' }]}>
              <Text style={[styles.refSectionLabel, { color: '#283593' }]}>
                Turns Ratio
              </Text>
              <View style={styles.refFormulas}>
                <Text style={styles.refFormula}>a = N1 / N2</Text>
                <Text style={styles.refFormula}>a = V1 / V2</Text>
                <Text style={styles.refFormula}>a = I2 / I1</Text>
              </View>
            </View>

            <View style={[styles.refSection, { backgroundColor: '#E3F2FD' }]}>
              <Text style={[styles.refSectionLabel, { color: '#1565C0' }]}>
                Voltage
              </Text>
              <View style={styles.refFormulas}>
                <Text style={styles.refFormula}>V2 = V1 x N2/N1</Text>
                <Text style={styles.refFormula}>V1 = V2 x N1/N2</Text>
              </View>
            </View>

            <View style={[styles.refSection, { backgroundColor: '#FFF3E0' }]}>
              <Text style={[styles.refSectionLabel, { color: '#E65100' }]}>
                Current
              </Text>
              <View style={styles.refFormulas}>
                <Text style={styles.refFormula}>I2 = I1 x N1/N2</Text>
                <Text style={styles.refFormula}>I1 = I2 x N2/N1</Text>
              </View>
            </View>

            <View style={[styles.refSection, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.refSectionLabel, { color: '#2E7D32' }]}>
                Power
              </Text>
              <View style={styles.refFormulas}>
                <Text style={styles.refFormula}>P = V x I</Text>
                <Text style={styles.refFormula}>kVA = VA / 1000</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function ResultRow({ label, value, unit }) {
  if (!value || value === '—') return null;
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>
        {value} <Text style={styles.resultUnit}>{unit}</Text>
      </Text>
    </View>
  );
}

const THEME = colors.calculators.transformers;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F5' },
  flex: { flex: 1 },
  header: {
    backgroundColor: THEME,
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
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME,
    marginBottom: 10,
    marginTop: 4,
  },
  errorBox: { backgroundColor: '#FFEBEE', borderRadius: 8, padding: 12, marginBottom: 12 },
  errorText: { color: '#C62828', fontSize: 14, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  calcButton: {
    flex: 2,
    backgroundColor: THEME,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: THEME,
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

  // Results card
  resultsCard: {
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
  resultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 14,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultLabel: { fontSize: 15, color: '#555', fontWeight: '500' },
  resultValue: { fontSize: 16, color: THEME, fontWeight: '700' },
  resultUnit: { fontSize: 13, color: '#888', fontWeight: '400' },

  // Reference card
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
  refTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 14,
  },
  refSection: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  refSectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  refFormulas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 6,
  },
  refFormula: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
