import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Auction } from './src/auction';
import AuctionScreen from './src/AuctionScreen';
import SetupScreen, { GameConfig } from './src/SetupScreen';

export default function App() {
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [result, setResult] = useState<Auction | null>(null);

  const reset = () => {
    setConfig(null);
    setResult(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0f1020' }}>
      <StatusBar style="light" />
      {result ? (
        <ScrollView contentContainerStyle={s.results}>
          <Text style={s.title}>Equipos</Text>
          {result.players.map((p) => (
            <View key={p.name} style={s.team}>
              <Text style={s.player}>{p.name} · {p.coins} 🪙 sobran</Text>
              <View style={s.grid}>
                {p.team.map((c) => (
                  <View key={c.id} style={s.card}>
                    <Image source={{ uri: c.image }} style={s.img} resizeMode="contain" />
                    <Text style={s.name}>{c.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
          <Text style={s.note}>(Siguiente paso: que la IA decida quién ganaría)</Text>
          <Pressable onPress={reset}>
            <Text style={s.link}>Nueva partida</Text>
          </Pressable>
        </ScrollView>
      ) : config ? (
        <AuctionScreen config={config} onFinish={setResult} />
      ) : (
        <SetupScreen onStart={setConfig} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  results: { padding: 20, paddingTop: 60 },
  title: { color: '#fff', fontSize: 30, fontWeight: '800', marginBottom: 16 },
  team: { marginBottom: 24 },
  player: { color: '#ffb703', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: { width: '48%', backgroundColor: '#1c1d33', borderRadius: 10, padding: 8, alignItems: 'center' },
  img: { width: '100%', height: 120 },
  name: { color: '#fff', marginTop: 6, textAlign: 'center' },
  note: { color: '#aab', textAlign: 'center', marginTop: 8 },
  link: { color: '#ffb703', textAlign: 'center', marginTop: 16, fontSize: 16 },
});
