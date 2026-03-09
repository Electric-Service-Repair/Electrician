import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { ScreenHeader, CalculatorButton } from '../components';
import { colors, spacing, typography, borderRadius } from '../theme';
import { calculate, recommendConduitSize, getConduitTypes, getConduitSizes, getWireSizes } from '../utils/conduitFill';

const PRIMARY_COLOR = colors.calculators.conduitFill;

const CONDUIT_TYPES = getConduitTypes();
const WIRE_TYPES = ['THHN', 'XHHW'];

export default function ConduitFillScreen({ onBack }) {
  const [conduitType, setConduitType] = useState('EMT');
  const [conduitSize, setConduitSize] = useState('3/4');
  const [wires, setWires] = useState([{ wireSize: '12', wireType: 'THHN', count: '3' }]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = () => {
    const parsedWires = wires.map((w) => ({
      wireSize: w.wireSize,
      wireType: w.wireType,
      count: parseInt(w.count, 10) || 1,
    }));

    const r = calculate({ conduitType, conduitSize, wires: parsedWires });
    if (r.error) {
      setError(r.error);
      setResult(null);
    } else {
      setError(null);
      setResult(r);
    }
  };

  const handleRecommend = () => {
    const parsedWires = wires.map((w) => ({
      wireSize: w.wireSize,
      wireType: w.wireType,
      count: parseInt(w.count, 10) || 1,
    }));

    const r = recommendConduitSize({ conduitType, wires: parsedWires });
    if (r.error) {
      setError(r.error);
      setResult(null);
    } else {
      setError(null);
      setConduitSize(r.recommendedSize);
      handleCalculate();
    }
  };

  const addWire = () => {
    setWires([...wires, { wireSize: '12', wireType: 'THHN', count: '1' }]);
  };

  const removeWire = (index) => {
    if (wires.length > 1) {
      setWires(wires.filter((_, i) => i !== index));
    }
  };

  const updateWire = (index, field, value) => {
    const updated = [...wires];
    updated[index] = { ...updated[index], [field]: value };
    setWires(updated);
  };

  const complianceColor = result
    ? result.compliance === 'Excellent'
      ? '#4CAF50'
      : result.compliance === 'Compliant'
        ? '#FF9800'
        : '#C62828'
    : null;

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Conduit Fill" subtitle="NEC Chapter 9" color={PRIMARY_COLOR} onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Conduit Type */}
        <Text style={styles.label}>Conduit Type</Text>
        <View style={styles.chipRow}>
          {CONDUIT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.chip, conduitType === type && styles.chipActive]}
              onPress={() => setConduitType(type)}
            >
              <Text style={[styles.chipText, conduitType === type && styles.chipTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conduit Size */}
        <Text style={styles.label}>Conduit Size (trade)</Text>
        <View style={styles.chipRow}>
          {getConduitSizes(conduitType).map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.chip, conduitSize === size && styles.chipActive]}
              onPress={() => setConduitSize(size)}
            >
              <Text style={[styles.chipText, conduitSize === size && styles.chipTextActive]}>
                {size}"
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Wire Entries */}
        <Text style={styles.label}>Conductors</Text>
        {wires.map((wire, index) => (
          <View key={index} style={styles.wireRow}>
            <View style={styles.wireField}>
              <Text style={styles.wireLabel}>Size</Text>
              <View style={styles.pickerRow}>
                {['14', '12', '10', '8', '6', '4', '2', '1/0', '4/0'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.miniChip, wire.wireSize === s && styles.miniChipActive]}
                    onPress={() => updateWire(index, 'wireSize', s)}
                  >
                    <Text style={[styles.miniChipText, wire.wireSize === s && styles.miniChipTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.wireCountRow}>
              <View style={styles.countField}>
                <Text style={styles.wireLabel}>Qty</Text>
                <TextInput
                  style={styles.countInput}
                  value={wire.count}
                  onChangeText={(v) => updateWire(index, 'count', v)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.typeField}>
                <Text style={styles.wireLabel}>Type</Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {WIRE_TYPES.map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.miniChip, wire.wireType === t && styles.miniChipActive]}
                      onPress={() => updateWire(index, 'wireType', t)}
                    >
                      <Text style={[styles.miniChipText, wire.wireType === t && styles.miniChipTextActive]}>
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {wires.length > 1 && (
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeWire(index)}>
                  <Text style={styles.removeBtnText}>X</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addWire}>
          <Text style={styles.addBtnText}>+ Add Conductor</Text>
        </TouchableOpacity>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <CalculatorButton title="Calculate Fill" onPress={handleCalculate} color={PRIMARY_COLOR} />
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Results */}
        {result && (
          <View style={styles.resultCard}>
            <View style={[styles.complianceBadge, { backgroundColor: complianceColor }]}>
              <Text style={styles.complianceBadgeText}>{result.compliance}</Text>
            </View>

            <View style={styles.fillBar}>
              <View
                style={[
                  styles.fillBarInner,
                  {
                    width: `${Math.min(result.fillPercent, 100)}%`,
                    backgroundColor: complianceColor,
                  },
                ]}
              />
              <View
                style={[
                  styles.fillBarLimit,
                  { left: `${result.maxFillPercent}%` },
                ]}
              />
            </View>

            <Text style={styles.fillText}>
              {result.fillPercent}% filled (max {result.maxFillPercent}%)
            </Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Conduit Area</Text>
              <Text style={styles.resultValue}>{result.conduitArea} sq in</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Wire Area (total)</Text>
              <Text style={styles.resultValue}>{result.totalWireArea} sq in</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Allowable Area</Text>
              <Text style={styles.resultValue}>{result.allowableArea} sq in</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Remaining</Text>
              <Text style={[styles.resultValue, result.remainingArea < 0 && { color: '#C62828' }]}>
                {result.remainingArea} sq in
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Conductors</Text>
              <Text style={styles.resultValue}>{result.totalWireCount}</Text>
            </View>
          </View>
        )}

        {/* NEC Reference */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>NEC Fill Limits (Chapter 9, Table 1)</Text>
          <Text style={styles.infoText}>1 conductor: 53% max fill</Text>
          <Text style={styles.infoText}>2 conductors: 31% max fill</Text>
          <Text style={styles.infoText}>3+ conductors: 40% max fill</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { flex: 1 },
  content: { padding: spacing.base, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '700', color: '#333', marginTop: 16, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  chipActive: { backgroundColor: PRIMARY_COLOR },
  chipText: { fontSize: 13, color: '#555', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  wireRow: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    marginBottom: 8, elevation: 1,
  },
  wireField: { marginBottom: 8 },
  wireLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  miniChip: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14,
    backgroundColor: '#EEEEEE',
  },
  miniChipActive: { backgroundColor: PRIMARY_COLOR },
  miniChipText: { fontSize: 12, color: '#555' },
  miniChipTextActive: { color: '#fff' },
  wireCountRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  countField: { width: 60 },
  typeField: { flex: 1 },
  countInput: {
    borderWidth: 1, borderColor: '#DDD', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6, fontSize: 16, textAlign: 'center',
  },
  removeBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFCDD2',
    alignItems: 'center', justifyContent: 'center',
  },
  removeBtnText: { color: '#C62828', fontWeight: '700', fontSize: 14 },
  addBtn: {
    alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#E3F2FD', marginTop: 4,
  },
  addBtnText: { color: '#1565C0', fontWeight: '600', fontSize: 14 },
  buttonRow: { marginTop: 20 },
  errorBox: {
    backgroundColor: '#FFEBEE', padding: 12, borderRadius: 8, marginTop: 12,
  },
  errorText: { color: '#C62828', fontSize: 14 },
  resultCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    marginTop: 16, elevation: 3,
  },
  complianceBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, marginBottom: 16,
  },
  complianceBadgeText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  fillBar: {
    height: 20, backgroundColor: '#EEEEEE', borderRadius: 10,
    marginBottom: 8, overflow: 'hidden', position: 'relative',
  },
  fillBarInner: { height: '100%', borderRadius: 10 },
  fillBarLimit: {
    position: 'absolute', top: 0, bottom: 0, width: 2,
    backgroundColor: '#333',
  },
  fillText: { fontSize: 14, color: '#555', marginBottom: 16, textAlign: 'center' },
  resultRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  resultLabel: { fontSize: 14, color: '#666' },
  resultValue: { fontSize: 14, fontWeight: '700', color: '#222' },
  infoCard: {
    backgroundColor: '#E8EAF6', borderRadius: 12, padding: 16, marginTop: 20,
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#283593', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#3F51B5', marginBottom: 4 },
});
