/**
 * Voltage Drop Calculator Screen
 *
 * Calculates voltage drop in electrical conductors and recommends wire sizes.
 * Essential for ensuring NEC compliance and proper circuit design.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {
  ScreenHeader,
  InputField,
  CalculatorButton,
  ErrorMessage,
  InfoSection,
  InfoText,
  InfoFormula,
  InfoItem,
} from '../components';
import { calculate, recommendWireSize, getWireSizes } from '../utils/voltageDrop';
import { colors, spacing } from '../theme';

const PRIMARY_COLOR = colors.calculators.voltageDrop;

export default function VoltageDropScreen({ onBack }) {
  // Input states
  const [sourceVoltage, setSourceVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [distance, setDistance] = useState('');
  const [wireSize, setWireSize] = useState('12');
  const [material, setMaterial] = useState('copper');
  const [systemType, setSystemType] = useState('single-phase');

  // Result states
  const [result, setResult] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');

  const wireSizes = getWireSizes();

  const handleCalculate = () => {
    Keyboard.dismiss();
    setError('');

    const inputs = {
      sourceVoltage: parseFloat(sourceVoltage),
      current: parseFloat(current),
      distance: parseFloat(distance),
      wireSize,
      material,
      systemType,
    };

    const calcResult = calculate(inputs);

    if (calcResult.error) {
      setError(calcResult.error);
      setResult(null);
      setRecommendation(null);
    } else {
      setResult(calcResult);
      setError('');

      // Also get wire size recommendation
      const rec = recommendWireSize(inputs, 3);
      setRecommendation(rec);
    }
  };

  const handleReset = () => {
    setSourceVoltage('');
    setCurrent('');
    setDistance('');
    setWireSize('12');
    setMaterial('copper');
    setSystemType('single-phase');
    setResult(null);
    setRecommendation(null);
    setError('');
  };

  const canCalculate = sourceVoltage && current && distance && wireSize;

  const getComplianceColor = () => {
    if (!result) return '#666';
    switch (result.necCompliance) {
      case 'Excellent':
        return '#4CAF50';
      case 'Good':
        return '#8BC34A';
      case 'Marginal':
        return '#FF9800';
      case 'Non-Compliant':
        return '#F44336';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Voltage Drop"
        subtitle="NEC Compliance Calculator"
        color={PRIMARY_COLOR}
        onBack={onBack}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Input Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Circuit Parameters</Text>

            <InputField
              label="Source Voltage"
              unit="V"
              value={sourceVoltage}
              onChangeText={setSourceVoltage}
            />

            <InputField
              label="Load Current"
              unit="A"
              value={current}
              onChangeText={setCurrent}
            />

            <InputField
              label="One-Way Distance"
              unit="ft"
              value={distance}
              onChangeText={setDistance}
            />
          </View>

          {/* Configuration Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configuration</Text>

            {/* Wire Size Selector */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Wire Size</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipScroll}
              >
                {wireSizes.map((size) => (
                  <TouchableOpacity
                    key={size.value}
                    style={[
                      styles.chip,
                      wireSize === size.value && [styles.chipSelected, { backgroundColor: PRIMARY_COLOR }]
                    ]}
                    onPress={() => setWireSize(size.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        wireSize === size.value && styles.chipTextSelected
                      ]}
                    >
                      {size.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Material Selector */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Material</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    styles.segmentButtonLeft,
                    material === 'copper' && [styles.segmentButtonActive, { backgroundColor: PRIMARY_COLOR }]
                  ]}
                  onPress={() => setMaterial('copper')}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      material === 'copper' && styles.segmentButtonTextActive
                    ]}
                  >
                    Copper
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    styles.segmentButtonRight,
                    material === 'aluminum' && [styles.segmentButtonActive, { backgroundColor: PRIMARY_COLOR }]
                  ]}
                  onPress={() => setMaterial('aluminum')}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      material === 'aluminum' && styles.segmentButtonTextActive
                    ]}
                  >
                    Aluminum
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* System Type Selector */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>System Type</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    styles.segmentButtonLeft,
                    systemType === 'single-phase' && [styles.segmentButtonActive, { backgroundColor: PRIMARY_COLOR }]
                  ]}
                  onPress={() => setSystemType('single-phase')}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      systemType === 'single-phase' && styles.segmentButtonTextActive
                    ]}
                  >
                    Single-Phase
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    styles.segmentButtonRight,
                    systemType === 'three-phase' && [styles.segmentButtonActive, { backgroundColor: PRIMARY_COLOR }]
                  ]}
                  onPress={() => setSystemType('three-phase')}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      systemType === 'three-phase' && styles.segmentButtonTextActive
                    ]}
                  >
                    Three-Phase
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Error Message */}
          <ErrorMessage message={error} visible={!!error} />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <CalculatorButton
              title="Calculate"
              onPress={handleCalculate}
              disabled={!canCalculate}
              color={PRIMARY_COLOR}
              style={styles.button}
            />
            <CalculatorButton
              title="Reset"
              onPress={handleReset}
              variant="secondary"
              style={styles.button}
            />
          </View>

          {/* Results Section */}
          {result && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Results</Text>

              {/* Voltage Drop Card */}
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Voltage Drop</Text>
                  <View style={[styles.complianceBadge, { backgroundColor: getComplianceColor() }]}>
                    <Text style={styles.complianceBadgeText}>{result.necCompliance}</Text>
                  </View>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Voltage Drop:</Text>
                  <Text style={[styles.resultValue, { color: getComplianceColor() }]}>
                    {result.voltageDrop} V ({result.voltageDropPercent}%)
                  </Text>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Voltage at Load:</Text>
                  <Text style={styles.resultValue}>{result.loadVoltage} V</Text>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Power Loss:</Text>
                  <Text style={styles.resultValue}>{result.powerLoss} W</Text>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Conductor Resistance:</Text>
                  <Text style={styles.resultValue}>{result.totalResistance} Ω</Text>
                </View>

                <View style={styles.necMessage}>
                  <Text style={styles.necMessageText}>{result.necMessage}</Text>
                </View>
              </View>

              {/* Recommendation Card */}
              {recommendation && !recommendation.error && (
                <View style={styles.recommendationCard}>
                  <Text style={styles.recommendationTitle}>
                    Wire Size Recommendation (3% max drop)
                  </Text>
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationSize}>
                      {recommendation.recommendedSize} AWG
                    </Text>
                    <Text style={styles.recommendationDetail}>
                      Actual drop: {recommendation.actualDropPercent}%
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Information Section */}
          <InfoSection title="About Voltage Drop" collapsible defaultExpanded={false}>
            <InfoText>
              Voltage drop is the reduction in voltage along a conductor due to its resistance.
              Excessive voltage drop can cause equipment malfunction, reduced efficiency, and
              potential safety hazards.
            </InfoText>

            <InfoFormula formula={systemType === 'single-phase'
              ? 'Vdrop = 2 × K × I × D / CMA'
              : 'Vdrop = √3 × K × I × D / CMA'}
            />

            <InfoText style={{ marginTop: spacing.md }}>
              <Text style={{ fontWeight: '700' }}>K:</Text> Resistivity constant (Cu: 12.9, Al: 21.2 Ω·cmil/ft){'\n'}
              <Text style={{ fontWeight: '700' }}>I:</Text> Current in amperes{'\n'}
              <Text style={{ fontWeight: '700' }}>D:</Text> One-way distance in feet{'\n'}
              <Text style={{ fontWeight: '700' }}>CMA:</Text> Circular mil area of conductor
            </InfoText>
          </InfoSection>

          <InfoSection title="NEC Guidelines" collapsible defaultExpanded={false}>
            <InfoItem label="Branch Circuits" value="3% max recommended" />
            <InfoItem label="Feeders" value="2% max recommended" />
            <InfoItem label="Total System" value="5% max recommended" />

            <InfoText style={{ marginTop: spacing.md }}>
              Per NEC 210.19(A)(1) and 215.2(A)(1), conductors should be sized to limit voltage
              drop. While not strictly enforced, staying within these recommendations ensures
              optimal performance and efficiency.
            </InfoText>
          </InfoSection>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: spacing.md,
  },

  // Picker styles
  pickerContainer: {
    marginBottom: spacing.base,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: spacing.sm,
  },

  // Chip selector
  chipScroll: {
    flexGrow: 0,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  chipSelected: {
    borderColor: PRIMARY_COLOR,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  chipTextSelected: {
    color: '#fff',
  },

  // Segment button group
  buttonGroup: {
    flexDirection: 'row',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderRightWidth: 0.5,
  },
  segmentButtonRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderLeftWidth: 0.5,
  },
  segmentButtonActive: {
    borderColor: PRIMARY_COLOR,
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  segmentButtonTextActive: {
    color: '#fff',
  },

  // Button container
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  button: {
    flex: 1,
  },

  // Result cards
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  complianceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  complianceBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  necMessage: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  necMessageText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Recommendation card
  recommendationCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  recommendationContent: {
    alignItems: 'center',
  },
  recommendationSize: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2E7D32',
  },
  recommendationDetail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#558B2F',
    marginTop: spacing.xs,
  },

  bottomPadding: {
    height: 40,
  },
});
