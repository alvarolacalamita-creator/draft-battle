import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Franchise } from './franchises';

export type GameConfig = {
  franchise: Franchise;
  budget: number;
  total: number; // personajes en la subasta (la mitad para cada jugador)
  players: [string, string];
};

const BUDGETS = [20, 30, 40, 50];
const TOTALS = [6, 8, 10];

export default function SetupScreen({
  franchise,
  onStart,
  onBack,
}: {
  franchise: Franchise;
  onStart: (c: GameConfig) => void;
  onBack: () => void;
}) {
  const [budget, setBudget] = useState(30);
  const [total, setTotal] = useState(8);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Pressable onPress={onBack}>
        <Text style={s.back}>← Cambiar categoría</Text>
      </Pressable>
      <Text style={s.title}>{franchise.name}</Text>

      <Text style={s.label}>Jugadores</Text>
      <TextInput style={s.input} placeholder="Jugador 1" placeholderTextColor="#889" value={p1} onChangeText={setP1} />
      <TextInput style={s.input} placeholder="Jugador 2" placeholderTextColor="#889" value={p2} onChangeText={setP2} />

      <Text style={s.label}>Monedas iniciales</Text>
      <View style={s.row}>
        {BUDGETS.map((b) => (
          <Pressable key={b} onPress={() => setBudget(b)} style={[s.chip, b === budget && s.chipActive]}>
            <Text style={[s.chipText, b === budget && s.chipTextActive]}>{b}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={s.label}>Personajes en la partida</Text>
      <View style={s.row}>
        {TOTALS.map((t) => (
          <Pressable key={t} onPress={() => setTotal(t)} style={[s.chip, t === total && s.chipActive]}>
            <Text style={[s.chipText, t === total && s.chipTextActive]}>
              {t} ({t / 2} cada uno)
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={s.start}
        onPress={() => onStart({ franchise, budget, total, players: [p1.trim() || 'Jugador 1', p2.trim() || 'Jugador 2'] })}
      >
        <Text style={s.startText}>Empezar partida</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingTop: 70, backgroundColor: '#0f1020', minHeight: '100%' },
  back: { color: '#ffb703', fontSize: 15, marginBottom: 16 },
  title: { color: '#fff', fontSize: 34, fontWeight: '800', marginBottom: 12 },
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
