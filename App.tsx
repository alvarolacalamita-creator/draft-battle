import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import type { Auction } from './src/auction';
import AuctionScreen from './src/AuctionScreen';
import CategoryScreen from './src/CategoryScreen';
import type { Franchise } from './src/franchises';
import ResultsScreen from './src/ResultsScreen';
import SetupScreen, { GameConfig } from './src/SetupScreen';

export default function App() {
  const [franchise, setFranchise] = useState<Franchise | null>(null);
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [result, setResult] = useState<Auction | null>(null);

  const reset = () => {
    setFranchise(null);
    setConfig(null);
    setResult(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0f1020' }}>
      <StatusBar style="light" />
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
