import { useState } from 'react';
import { ThemeProvider } from './src/theme/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import OhmsLawScreen from './src/screens/OhmsLawScreen';
import VoltageDropScreen from './src/screens/VoltageDropScreen';
import AmperesLawScreen from './src/screens/AmperesLawScreen';
import VoltageDividerScreen from './src/screens/VoltageDividerScreen';
import ResidentialWiringScreen from './src/screens/ResidentialWiringScreen';
import TransformersScreen from './src/screens/TransformersScreen';
import LadderLogicScreen from './src/screens/LadderLogicScreen';
import ConduitFillScreen from './src/screens/ConduitFillScreen';

export default function App() {
  const [screen, setScreen] = useState('home');

  let content;
  if (screen === 'ohms') {
    content = <OhmsLawScreen onBack={() => setScreen('home')} />;
  } else if (screen === 'voltageDrop') {
    content = <VoltageDropScreen onBack={() => setScreen('home')} />;
  } else if (screen === 'amperes') {
    content = <AmperesLawScreen onBack={() => setScreen('home')} />;
  } else if (screen === 'divider') {
    content = <VoltageDividerScreen onBack={() => setScreen('home')} />;
  } else if (screen === 'residential') {
    content = <ResidentialWiringScreen onBack={() => setScreen('home')} />;
  } else if (screen === 'transformers') {
    content = <TransformersScreen onBack={() => setScreen('home')} />;
  } else if (screen === 'ladderLogic') {
    content = <LadderLogicScreen onBack={() => setScreen('home')} />;
  } else if (screen === 'conduitFill') {
    content = <ConduitFillScreen onBack={() => setScreen('home')} />;
  } else {
    content = <HomeScreen onNavigate={setScreen} />;
  }

  return <ThemeProvider>{content}</ThemeProvider>;
}
