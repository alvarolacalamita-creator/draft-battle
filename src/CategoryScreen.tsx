import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { FRANCHISES, Franchise } from './franchises';

export const APP_VERSION = '4';

const COLORS: Record<string, string> = {
  onepiece: '#e63946',
  naruto: '#f77f00',
  dragonball: '#fcbf49',
  starwars: '#3a86ff',
  pokemon: '#2a9d8f',
};

export default function CategoryScreen({ onPick }: { onPick: (f: Franchise) => void }) {
  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.title}>Draft Battle</Text>
      <Text style={s.subtitle}>Elige la categoría de la partida</Text>
      {FRANCHISES.map((f) => (
        <Pressable key={f.id} style={[s.card, { backgroundColor: COLORS[f.id] ?? '#444' }]} onPress={() => onPick(f)}>
          <Text style={s.cardText}>{f.name}</Text>
        </Pressable>
      ))}
      <Text style={s.version}>versión {APP_VERSION}</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingTop: 70, backgroundColor: '#0f1020', minHeight: '100%' },
  title: { color: '#fff', fontSize: 34, fontWeight: '800' },
  subtitle: { color: '#aab', fontSize: 16, marginTop: 6, marginBottom: 24 },
  card: { paddingVertical: 28, paddingHorizontal: 20, borderRadius: 16, marginBottom: 14 },
  version: { color: '#667', fontSize: 12, textAlign: 'center', marginTop: 10 },
  cardText: { color: '#fff', fontSize: 24, fontWeight: '800' },
});
