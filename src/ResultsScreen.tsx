import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Auction } from './auction';
import { getVerdict, Verdict } from './verdict';

export default function ResultsScreen({
  auction,
  franchiseName,
  onNewGame,
}: {
  auction: Auction;
  franchiseName: string;
  onNewGame: () => void;
}) {
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const judge = () => {
    setLoading(true);
    setError(null);
    getVerdict(franchiseName, auction)
      .then(setVerdict)
      .catch((e) => setError(String(e.message ?? e)))
      .finally(() => setLoading(false));
  };

  const summaryOf = (name: string) => verdict?.characters.find((c) => c.name === name)?.summary;

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.title}>Equipos</Text>

      {verdict && (
        <View style={s.verdict}>
          <Text style={s.winner}>
            {verdict.winner === null ? '🤝 ¡Empate!' : `🏆 Gana ${auction.players[verdict.winner].name}`}
          </Text>
          <Text style={s.analysis}>{verdict.analysis}</Text>
        </View>
      )}

      {auction.players.map((p) => (
        <View key={p.name} style={s.team}>
          <Text style={s.player}>
            {p.name} · {p.coins} 🪙 sobran
          </Text>
          {p.team.map((c) => (
            <View key={c.id} style={s.row}>
              <Image source={{ uri: c.image }} style={s.img} resizeMode="contain" />
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{c.name}</Text>
                {summaryOf(c.name) && <Text style={s.summary}>{summaryOf(c.name)}</Text>}
              </View>
            </View>
          ))}
        </View>
      ))}

      {error && <Text style={s.error}>{error}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color="#ffb703" style={{ marginVertical: 20 }} />
      ) : (
        !verdict && (
          <Pressable style={s.btn} onPress={judge}>
            <Text style={s.btnText}>{error ? 'Reintentar' : '⚔️ ¿Quién ganaría?'}</Text>
          </Pressable>
        )
      )}
      <Pressable onPress={onNewGame}>
        <Text style={s.link}>Nueva partida</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, backgroundColor: '#0f1020', minHeight: '100%' },
  title: { color: '#fff', fontSize: 30, fontWeight: '800', marginBottom: 16 },
  verdict: { backgroundColor: '#1c1d33', borderRadius: 12, padding: 16, marginBottom: 20 },
  winner: { color: '#ffb703', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  analysis: { color: '#dde', fontSize: 15, lineHeight: 22 },
  team: { marginBottom: 24 },
  player: { color: '#ffb703', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1c1d33', borderRadius: 10, padding: 8, marginBottom: 8 },
  img: { width: 70, height: 70 },
  name: { color: '#fff', fontSize: 16, fontWeight: '700' },
  summary: { color: '#aab', fontSize: 13, marginTop: 2 },
  error: { color: '#ff6b6b', textAlign: 'center', marginBottom: 12 },
  btn: { backgroundColor: '#e63946', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  link: { color: '#ffb703', textAlign: 'center', marginTop: 20, fontSize: 16 },
});
