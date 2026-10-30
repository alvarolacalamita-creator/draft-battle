import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { Bangers_400Regular } from '@expo-google-fonts/bangers/400Regular';
import type { Auction } from './src/auction';
import ArcadeBackground from './src/ArcadeBackground';
import AuctionScreen from './src/AuctionScreen';
import CategoryScreen from './src/CategoryScreen';
import type { Franchise } from './src/franchises';
import ResultsScreen from './src/ResultsScreen';
import SetupScreen, { GameConfig } from './src/SetupScreen';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ Bangers_400Regular });
  const [franchise, setFranchise] = useState<Franchise | null>(null);
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [result, setResult] = useState<Auction | null>(null);

  const reset = () => {
    setFranchise(null);
    setConfig(null);
    setResult(null);
  };

  if (!fontsLoaded && !fontError) return <View style={{ flex: 1, backgroundColor: '#0b0221' }} />;

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0221' }}>
      <StatusBar style="light" />
      <ArcadeBackground />
      {result && config ? (
        <ResultsScreen auction={result} franchiseName={config.franchise.name} onNewGame={reset} />
      ) : config ? (
        <AuctionScreen config={config} onFinish={setResult} />
      ) : franchise ? (
        <SetupScreen franchise={franchise} onStart={setConfig} onBack={() => setFranchise(null)} />
      ) : (
        <CategoryScreen onPick={setFranchise} />
      )}
    </View>
  );
}
