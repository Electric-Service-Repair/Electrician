import { useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ScreenHeader,
  CalculatorButton,
  InfoSection,
  InfoText,
  InfoItem,
} from '../components';
import { simulate, getOutputs, MOTOR_CONTROL_CIRCUIT } from '../utils/ladderLogic';
import { colors, spacing } from '../theme';

const PRIMARY_COLOR = colors.calculators.ladderLogic;
const circuit = MOTOR_CONTROL_CIRCUIT;

export default function LadderLogicScreen({ onBack }) {
  const [inputs, setInputs] = useState({
    Start_Btn: false,
    Stop_Btn: false,
    OL_Sensor: false,
  });

  // Feed motor coil state back for seal-in
  const [motorLatched, setMotorLatched] = useState(false);

  const simInputs = { ...inputs, Motor_Coil: motorLatched };
  const simResult = simulate(circuit, simInputs);
  const outputs = getOutputs(circuit, simResult);

  // Update motor latch after simulation
  const currentMotorState = !!simResult.Motor_Coil;
  if (currentMotorState !== motorLatched) {
    setMotorLatched(currentMotorState);
  }

  const handleStart = useCallback(() => {
    // Momentary: set true, then false after a tick
    setInputs((prev) => ({ ...prev, Start_Btn: true }));
    setTimeout(() => {
      setInputs((prev) => ({ ...prev, Start_Btn: false }));
    }, 200);
  }, []);

  const toggleInput = useCallback((tag) => {
    setInputs((prev) => ({ ...prev, [tag]: !prev[tag] }));
  }, []);

  const handleReset = useCallback(() => {
    setInputs({ Start_Btn: false, Stop_Btn: false, OL_Sensor: false });
    setMotorLatched(false);
  }, []);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Ladder Logic"
        subtitle="PLC Motor Control Simulator"
        color={PRIMARY_COLOR}
        onBack={onBack}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Input Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inputs</Text>

          <TouchableOpacity
            style={[styles.inputBtn, inputs.Start_Btn && styles.inputBtnActive]}
            onPress={handleStart}
            activeOpacity={0.6}
          >
            <View style={styles.inputRow}>
              <View style={[styles.statusDot, inputs.Start_Btn && styles.dotOn]} />
              <View>
                <Text style={[styles.inputLabel, inputs.Start_Btn && styles.inputLabelActive]}>
                  Start (Momentary)
                </Text>
                <Text style={styles.inputSublabel}>NO push button — tap to pulse</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.inputBtn, inputs.Stop_Btn && styles.inputBtnDanger]}
            onPress={() => toggleInput('Stop_Btn')}
            activeOpacity={0.6}
          >
            <View style={styles.inputRow}>
              <View style={[styles.statusDot, inputs.Stop_Btn ? styles.dotDanger : styles.dotOff]} />
              <View>
                <Text style={[styles.inputLabel, inputs.Stop_Btn && styles.inputLabelDanger]}>
                  Stop {inputs.Stop_Btn ? '(Pressed)' : '(Released)'}
                </Text>
                <Text style={styles.inputSublabel}>NC button — toggle to activate</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.inputBtn, inputs.OL_Sensor && styles.inputBtnDanger]}
            onPress={() => toggleInput('OL_Sensor')}
            activeOpacity={0.6}
          >
            <View style={styles.inputRow}>
              <View style={[styles.statusDot, inputs.OL_Sensor ? styles.dotDanger : styles.dotOff]} />
              <View>
                <Text style={[styles.inputLabel, inputs.OL_Sensor && styles.inputLabelDanger]}>
                  Overload {inputs.OL_Sensor ? '(TRIPPED)' : '(Normal)'}
                </Text>
                <Text style={styles.inputSublabel}>NC relay — toggle to simulate fault</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Output States */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outputs</Text>

          <View style={styles.outputGrid}>
            <View style={[styles.outputCard, outputs.Motor_Coil && styles.outputCardOn]}>
              <Text style={styles.outputIcon}>{outputs.Motor_Coil ? 'M' : '-'}</Text>
              <Text style={[styles.outputLabel, outputs.Motor_Coil && styles.outputLabelOn]}>
                Motor
              </Text>
              <Text style={[styles.outputState, outputs.Motor_Coil ? styles.stateOn : styles.stateOff]}>
                {outputs.Motor_Coil ? 'ENERGIZED' : 'OFF'}
              </Text>
            </View>

            <View style={[styles.outputCard, outputs.Run_Light && styles.outputCardGreen]}>
              <Text style={styles.outputIcon}>{outputs.Run_Light ? 'R' : '-'}</Text>
              <Text style={[styles.outputLabel, outputs.Run_Light && styles.outputLabelGreen]}>
                Run Light
              </Text>
              <Text style={[styles.outputState, outputs.Run_Light ? styles.stateGreen : styles.stateOff]}>
                {outputs.Run_Light ? 'ON' : 'OFF'}
              </Text>
            </View>

            <View style={[styles.outputCard, outputs.Fault_Light && styles.outputCardFault]}>
              <Text style={styles.outputIcon}>{outputs.Fault_Light ? '!' : '-'}</Text>
              <Text style={[styles.outputLabel, outputs.Fault_Light && styles.outputLabelFault]}>
                Fault
              </Text>
              <Text style={[styles.outputState, outputs.Fault_Light ? styles.stateFault : styles.stateOff]}>
                {outputs.Fault_Light ? 'ALARM' : 'OK'}
              </Text>
            </View>
          </View>
        </View>

        {/* Ladder Diagram */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ladder Diagram</Text>
          <View style={styles.diagramCard}>
            {circuit.rungs.map((rung) => (
              <View key={rung.id} style={styles.rungContainer}>
                <Text style={styles.rungComment}>{rung.comment}</Text>
                <View style={styles.rungDiagram}>
                  <AsciiRung rung={rung} states={simResult} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Reset */}
        <View style={styles.resetContainer}>
          <CalculatorButton
            title="Reset All"
            onPress={handleReset}
            variant="secondary"
          />
        </View>

        {/* Reference */}
        <InfoSection title="Ladder Logic Symbols" collapsible defaultExpanded={false}>
          <InfoItem label="| |  (XIC)" value="Normally Open contact" />
          <InfoItem label="|/|  (XIO)" value="Normally Closed contact" />
          <InfoItem label="( )  (OTE)" value="Output coil" />
          <InfoText style={{ marginTop: spacing.md }}>
            Seal-in: The motor coil contact parallels the Start button so the motor
            stays running after Start is released. Stop and Overload are NC contacts
            in series — opening either de-energizes the motor.
          </InfoText>
        </InfoSection>

        <InfoSection title="IEC 61131-3" collapsible defaultExpanded={false}>
          <InfoText>
            Ladder Diagram (LD) is one of five programming languages defined in
            IEC 61131-3 for programmable logic controllers. It resembles electrical
            relay logic schematics, making it intuitive for electricians.
          </InfoText>
          <InfoItem label="Standard" value="IEC 61131-3" />
          <InfoItem label="Language" value="Ladder Diagram (LD)" />
          <InfoItem label="Application" value="Motor control, safety interlocks" />
        </InfoSection>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

/** Render a rung as styled contact/coil elements */
function AsciiRung({ rung, states }) {
  const isOutputOn = !!states[rung.output.tag];

  return (
    <View>
      {/* Branches (parallel) */}
      {rung.branches.map((branch, bIdx) => (
        <View key={bIdx} style={styles.branchRow}>
          {bIdx === 0 && rung.branches.length > 1 && (
            <Text style={styles.branchSymbol}>{'┬'}</Text>
          )}
          {bIdx > 0 && (
            <Text style={styles.branchSymbol}>
              {bIdx === rung.branches.length - 1 ? '└' : '├'}
            </Text>
          )}
          {branch.map((contact, cIdx) => {
            const state = !!states[contact.tag];
            const passes = contact.type === 'NC' ? !state : state;
            return (
              <View key={cIdx} style={[styles.contactBox, passes && styles.contactPassing]}>
                <Text style={styles.contactSymbol}>
                  {contact.type === 'NC' ? '|/|' : '| |'}
                </Text>
                <Text style={styles.contactLabel}>{contact.label}</Text>
              </View>
            );
          })}
        </View>
      ))}

      {/* Series elements */}
      {rung.series.length > 0 && (
        <View style={styles.seriesRow}>
          {rung.series.map((contact, idx) => {
            const state = !!states[contact.tag];
            const passes = contact.type === 'NC' ? !state : state;
            return (
              <View key={idx} style={[styles.contactBox, passes && styles.contactPassing]}>
                <Text style={styles.contactSymbol}>
                  {contact.type === 'NC' ? '|/|' : '| |'}
                </Text>
                <Text style={styles.contactLabel}>{contact.label}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Output coil */}
      <View style={[styles.coilBox, isOutputOn && styles.coilOn]}>
        <Text style={[styles.coilSymbol, isOutputOn && styles.coilSymbolOn]}>
          {'( )'}
        </Text>
        <Text style={[styles.coilLabel, isOutputOn && styles.coilLabelOn]}>
          {rung.output.label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.base },

  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: spacing.md,
  },

  // Input buttons
  inputBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  inputBtnActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  inputBtnDanger: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  dotOn: { backgroundColor: '#4CAF50' },
  dotOff: { backgroundColor: '#BDBDBD' },
  dotDanger: { backgroundColor: '#F44336' },
  inputLabel: { fontSize: 16, fontWeight: '700', color: '#333' },
  inputLabelActive: { color: '#2E7D32' },
  inputLabelDanger: { color: '#C62828' },
  inputSublabel: { fontSize: 12, color: '#999', marginTop: 2 },

  // Output cards
  outputGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  outputCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.base,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  outputCardOn: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#FFEBEE',
  },
  outputCardGreen: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  outputCardFault: {
    borderColor: '#FF9800',
    backgroundColor: '#FFF3E0',
  },
  outputIcon: {
    fontSize: 28,
    fontWeight: '800',
    color: '#BDBDBD',
  },
  outputLabel: { fontSize: 13, fontWeight: '600', color: '#666', marginTop: 4 },
  outputLabelOn: { color: PRIMARY_COLOR },
  outputLabelGreen: { color: '#2E7D32' },
  outputLabelFault: { color: '#E65100' },
  outputState: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  stateOn: { color: PRIMARY_COLOR },
  stateGreen: { color: '#4CAF50' },
  stateFault: { color: '#FF9800' },
  stateOff: { color: '#BDBDBD' },

  // Ladder diagram
  diagramCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.base,
  },
  rungContainer: {
    marginBottom: spacing.base,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rungComment: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rungDiagram: {
    paddingLeft: spacing.sm,
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  branchSymbol: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
    width: 16,
  },
  seriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
    marginBottom: 4,
    paddingLeft: 20,
  },
  contactBox: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  contactPassing: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  contactSymbol: {
    fontSize: 13,
    fontWeight: '800',
    color: '#666',
    fontFamily: 'monospace',
  },
  contactLabel: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  coilBox: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 6,
    marginLeft: 20,
    backgroundColor: '#FAFAFA',
  },
  coilOn: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#FFEBEE',
  },
  coilSymbol: {
    fontSize: 14,
    fontWeight: '800',
    color: '#999',
    fontFamily: 'monospace',
  },
  coilSymbolOn: { color: PRIMARY_COLOR },
  coilLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  coilLabelOn: { color: PRIMARY_COLOR },

  // Reset
  resetContainer: {
    marginBottom: spacing.lg,
  },

  bottomPadding: { height: 40 },
});
