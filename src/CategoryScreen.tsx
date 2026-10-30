import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import FranchiseBanner from './FranchiseBanner';
import { FRANCHISES, Franchise } from './franchises';

export const APP_VERSION = '6';

export default function CategoryScreen({ onPick }: { onPick: (f: Franchise) => void }) {
  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.title}>DRAFT BATTLE</Text>
      <Text style={s.subtitle}>Elige la categoría de la partida</Text>
      {FRANCHISES.map((f) => (
        <Pressable
          key={f.id}
          onPress={() => onPick(f)}
          style={({ pressed }) => [s.card, pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 }]}
        >
          <FranchiseBanner id={f.id} height={118} />
        </Pressable>
      ))}
      <Text style={s.version}>versión {APP_VERSION}</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingTop: 64, backgroundColor: '#0f1020', minHeight: '100%' },
  title: {
    fontFamily: 'Bangers_400Regular',
    color: '#ffb703',
    fontSize: 54,
    letterSpacing: 2,
    textShadowColor: '#e63946',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },
  subtitle: { color: '#aab', fontSize: 16, marginTop: 2, marginBottom: 22 },
  card: {
    marginBottom: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  version: { color: '#667', fontSize: 12, textAlign: 'center', marginTop: 10 },
});
