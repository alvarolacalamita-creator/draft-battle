import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FRANCHISES, Franchise } from './franchises';

export type GameConfig = {
  franchise: Franchise;
  budget: number;
  players: [string, string];
};

const BUDGETS = [20, 30, 40, 50];

export default function SetupScreen({ onStart }: { onStart: (c: GameConfig) => void }) {
  const [franchise, setFranchise] = useState(FRANCHISES[0]);
  const [budget, setBudget] = useState(30);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.title}>Draft Battle</Text>

      <Text style={s.label}>Jugadores</Text>
      <TextInput style={s.input} placeholder="Jugador 1" placeholderTextColor="#889" value={p1} onChangeText={setP1} />
      <TextInput style={s.input} placeholder="Jugador 2" placeholderTextColor="#889" value={p2} onChangeText={setP2} />

      <Text style={s.label}>Monedas iniciales</Text>
      <View style={s.row}>
        {BUDGETS.map((b) => (
          <Chip key={b} text={String(b)} active={b === budget} onPress={() => setBudget(b)} />
        ))}
      </View>

      <Text style={s.label}>Anime</Text>
      <View style={s.row}>
        {FRANCHISES.map((f) => (
          <Chip key={f.id} text={f.name} active={f.id === franchise.id} onPress={() => setFranchise(f)} />
        ))}
      </View>

      <Pressable
        style={s.start}
        onPress={() => onStart({ franchise, budget, players: [p1.trim() || 'Jugador 1', p2.trim() || 'Jugador 2'] })}
      >
        <Text style={s.startText}>Empezar partida</Text>
      </Pressable>
    </ScrollView>
  );
}

function Chip({ text, active, onPress }: { text: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && s.chipActive]}>
      <Text style={[s.chipText, active && s.chipTextActive]}>{text}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingTop: 70, backgroundColor: '#0f1020', minHeight: '100%' },
  title: { color: '#fff', fontSize: 34, fontWeight: '800', marginBottom: 24 },
  label: { color: '#aab', fontSize: 14, marginTop: 20, marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#1c1d33', color: '#fff', padding: 14, borderRadius: 10, marginBottom: 10, fontSize: 16 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#1c1d33' },
  chipActive: { backgroundColor: '#ffb703' },
  chipText: { color: '#ccd' },
  chipTextActive: { color: '#000', fontWeight: '700' },
  start: { backgroundColor: '#e63946', padding: 18, borderRadius: 12, marginTop: 36, alignItems: 'center' },
  startText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
