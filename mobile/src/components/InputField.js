import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function InputField({ label, unit, value, onChangeText, editable = true, isResult }) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
      <TextInput
        style={[
          styles.input,
          isResult && styles.resultInput,
          !editable && styles.disabledInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#999"
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  unit: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    color: '#222',
  },
  resultInput: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    color: '#2E7D32',
    fontWeight: '700',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
});
