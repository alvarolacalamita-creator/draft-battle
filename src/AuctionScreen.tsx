import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Auction, canBid, pass, PlayerIdx, raise, startAuction } from './auction';
import { fetchCharacters } from './characters';
import type { GameConfig } from './SetupScreen';

export default function AuctionScreen({
  config,
  onFinish,
}: {
  config: GameConfig;
  onFinish: (a: Auction) => void;
}) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setAuction(null);
    setError(null);
    fetchCharacters(config.franchise)
      .then((chars) => setAuction(startAuction(config.players, config.budget, chars)))
      .catch((e) => setError(String(e.message ?? e)));
  }, [config, attempt]);

  if (error) {
    return (
      <View style={s.center}>
        <Text style={s.text}>No se pudieron cargar los personajes.</Text>
        <Text style={s.small}>{error}</Text>
        <Pressable style={s.btn} onPress={() => setAttempt((n) => n + 1)}>
          <Text style={s.btnText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }
  if (!auction) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#ffb703" />
        <Text style={[s.text, { marginTop: 16 }]}>Buscando personajes…</Text>
      </View>
    );
  }
  if (auction.done) {
    return (
      <View style={s.center}>
        <Text style={s.title}>¡Subasta terminada!</Text>
        <Pressable style={s.btn} onPress={() => onFinish(auction)}>
          <Text style={s.btnText}>Ver equipos</Text>
        </Pressable>
      </View>
    );
  }

  const current = auction.queue[auction.index];
  const turnName = auction.players[auction.turn].name;
  const leaderName = auction.leader === null ? null : auction.players[auction.leader].name;
  const nextBid = auction.bid + 1;

  return (
    <View style={s.container}>
      <View style={s.scoreRow}>
        {([0, 1] as PlayerIdx[]).map((i) => (
          <View key={i} style={[s.score, auction.turn === i && s.scoreActive]}>
            <Text style={s.playerName}>{auction.players[i].name}</Text>
            <Text style={s.coins}>🪙 {auction.players[i].coins}</Text>
            <Text style={s.small}>Equipo {auction.players[i].team.length}/{auction.teamSize}</Text>
          </View>
        ))}
      </View>

      <Text style={s.small}>
        Personaje {auction.index + 1} de {auction.queue.length}
      </Text>
      <Image source={{ uri: current.image }} style={s.image} resizeMode="contain" />
      <Text style={s.title}>{current.name}</Text>

      <Text style={s.bid}>{auction.bid > 0 ? `Puja: ${auction.bid} 🪙 · ${leaderName}` : 'Sin pujas todavía'}</Text>
      <Text style={s.small}>Turno de {turnName}</Text>

      <View style={s.actions}>
        <Pressable
          style={[s.btn, !canBid(auction) && s.btnDisabled]}
          disabled={!canBid(auction)}
          onPress={() => setAuction(raise(auction))}
        >
          <Text style={s.btnText}>Pujar {nextBid} 🪙</Text>
        </Pressable>
        <Pressable style={[s.btn, s.btnPass]} onPress={() => setAuction(pass(auction))}>
          <Text style={s.btnText}>Me planto</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, alignItems: 'center', backgroundColor: '#0f1020' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#0f1020' },
  scoreRow: { flexDirection: 'row', gap: 12, marginBottom: 16, width: '100%' },
  score: { flex: 1, backgroundColor: '#1c1d33', borderRadius: 12, padding: 12, borderWidth: 2, borderColor: 'transparent' },
  scoreActive: { borderColor: '#ffb703' },
  playerName: { color: '#fff', fontWeight: '700', fontSize: 16 },
  coins: { color: '#ffb703', fontSize: 22, fontWeight: '800' },
  image: { width: '100%', flex: 1, marginVertical: 12 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', textAlign: 'center' },
  text: { color: '#fff', fontSize: 17, textAlign: 'center' },
  small: { color: '#aab', fontSize: 13, marginTop: 4, textAlign: 'center' },
  bid: { color: '#fff', fontSize: 20, marginTop: 12 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 20 },
  btn: { flex: 1, backgroundColor: '#e63946', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  btnPass: { backgroundColor: '#3a3b5c' },
  btnDisabled: { opacity: 0.35 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
