import { StyleSheet, Text, View } from 'react-native';
import { typeColor, typeLabel } from './pokemonTypes';

/** Etiquetas de un personaje (por ahora, los tipos de un Pokémon). */
export default function TagChips({ tags, small }: { tags?: string[]; small?: boolean }) {
  if (!tags?.length) return null;
  return (
    <View style={s.row}>
      {tags.map((t) => (
        <View key={t} style={[s.chip, small && s.chipSmall, { backgroundColor: typeColor(t) }]}>
          <Text style={[s.text, small && s.textSmall]}>{typeLabel(t)}</Text>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  chip: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 14 },
  chipSmall: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 10 },
  text: { color: '#fff', fontSize: 14, fontWeight: '700' },
  textSmall: { fontSize: 11 },
});
