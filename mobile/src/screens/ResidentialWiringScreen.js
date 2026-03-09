import { useState, useMemo } from 'react';
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
import { calculateResidentialLoad } from '../utils/necCalculations';
import { copperAmpacity, aluminumAmpacity } from '../data/ampacityCharts';
import { colors } from '../theme';

const PRIMARY_COLOR = colors.calculators.residential;

const TEMP_LABELS = {
  temp60: '60°C',
  temp75: '75°C',
  temp90: '90°C',
};

export default function ResidentialWiringScreen({ onBack }) {
  const [sqft, setSqft] = useState('');
  const [smallApplianceCircuits, setSmallApplianceCircuits] = useState('2');
  const [fixedApplianceVA, setFixedApplianceVA] = useState('');
  const [showAluminum, setShowAluminum] = useState(false);

  const calculatedLoad = useMemo(() => {
    const squareFeet = parseFloat(sqft) || 0;
    const circuits = parseInt(smallApplianceCircuits, 10) || 2;
    const applianceVA = parseFloat(fixedApplianceVA) || 0;
    return calculateResidentialLoad({
      squareFeet,
      smallApplianceCircuits: circuits,
      fixedApplianceVA: applianceVA,
    });
  }, [sqft, smallApplianceCircuits, fixedApplianceVA]);

  const handleReset = () => {
    Keyboard.dismiss();
    setSqft('');
    setSmallApplianceCircuits('2');
    setFixedApplianceVA('');
  };

  const ampacityData = showAluminum ? aluminumAmpacity : copperAmpacity;

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
            <Text style={styles.headerTitle}>Residential Wiring</Text>
            <Text style={styles.headerSubtitle}>NEC Article 220 & Table 310.16</Text>
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
          {/* Load Calculator Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Residential Load Calculator</Text>
            <Text style={styles.instructions}>
              Calculate service load per NEC Article 220 standard method
            </Text>

            <InputField
              label="Dwelling Area"
              unit="sq ft"
              value={sqft}
              onChangeText={setSqft}
            />

            <InputField
              label="Small Appliance Circuits"
              unit="min 2 (NEC)"
              value={smallApplianceCircuits}
              onChangeText={setSmallApplianceCircuits}
            />

            <InputField
              label="Fixed Appliance Load"
              unit="VA"
              value={fixedApplianceVA}
              onChangeText={setFixedApplianceVA}
            />

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {/* Results Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Calculation Breakdown</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>General Lighting (3 VA/sq ft)</Text>
              <Text style={styles.resultValue}>{calculatedLoad.generalLightingLoad} VA</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Small Appliance Circuits</Text>
              <Text style={styles.resultValue}>{calculatedLoad.smallApplianceLoad} VA</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Laundry Circuit</Text>
              <Text style={styles.resultValue}>{calculatedLoad.laundryLoad} VA</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Connected Load</Text>
              <Text style={styles.resultValue}>{calculatedLoad.totalConnectedLoad} VA</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>After Demand Factors</Text>
              <Text style={styles.resultValue}>{calculatedLoad.netLoad} VA</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>+ Fixed Appliances</Text>
              <Text style={styles.resultValue}>{calculatedLoad.totalLoadVA} VA</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.resultRowHighlight}>
              <Text style={styles.resultLabelBold}>Minimum Service Size</Text>
              <Text style={styles.resultValueBold}>{calculatedLoad.serviceAmps} A</Text>
            </View>
          </View>

          {/* Ampacity Chart Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Wire Ampacity Chart (NEC 310.16)
            </Text>

            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleButton, !showAluminum && styles.toggleActive]}
                onPress={() => setShowAluminum(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleText, !showAluminum && styles.toggleTextActive]}>
                  Copper
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, showAluminum && styles.toggleActive]}
                onPress={() => setShowAluminum(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleText, showAluminum && styles.toggleTextActive]}>
                  Aluminum
                </Text>
              </TouchableOpacity>
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.awgCell]}>AWG</Text>
              <Text style={styles.tableHeaderCell}>{TEMP_LABELS.temp60}</Text>
              <Text style={styles.tableHeaderCell}>{TEMP_LABELS.temp75}</Text>
              <Text style={styles.tableHeaderCell}>{TEMP_LABELS.temp90}</Text>
            </View>

            {/* Table Rows */}
            {ampacityData.map((row, index) => (
              <View
                key={row.awg}
                style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}
              >
                <Text style={[styles.tableCell, styles.awgCell, styles.awgText]}>
                  {row.awg}
                </Text>
                <Text style={styles.tableCell}>{row.temp60} A</Text>
                <Text style={styles.tableCell}>{row.temp75} A</Text>
                <Text style={styles.tableCell}>{row.temp90} A</Text>
              </View>
            ))}
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  instructions: { fontSize: 14, color: '#777', marginBottom: 18 },

  // Reset button
  resetButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    marginTop: 6,
  },
  resetButtonText: { color: '#666', fontSize: 18, fontWeight: '600' },

  // Results
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  resultLabel: { fontSize: 14, color: '#555', flex: 1 },
  resultValue: { fontSize: 14, color: '#333', fontWeight: '600' },
  resultRowHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  resultLabelBold: { fontSize: 16, color: '#2E7D32', fontWeight: '700' },
  resultValueBold: { fontSize: 16, color: '#2E7D32', fontWeight: '800' },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },

  // Copper/Aluminum toggle
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  toggleActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  toggleText: { fontSize: 15, fontWeight: '600', color: '#666' },
  toggleTextActive: { color: '#fff' },

  // Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#424242',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  tableRowEven: {
    backgroundColor: '#FAFAFA',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#444',
  },
  awgCell: { flex: 0.8 },
  awgText: { fontWeight: '700', color: '#333' },
});
