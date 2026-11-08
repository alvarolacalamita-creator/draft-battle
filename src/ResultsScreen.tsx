import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Auction } from './auction';
import type { Franchise } from './franchises';
import { pokemonVerdict, statLine } from './pokemonBattle';
import TagChips from './TagChips';
import { buildChatGptPrompt, openChatGpt } from './chatgpt';
import { getStoredKey, getVerdict, saveKey, Verdict } from './verdict';

export default function ResultsScreen({
  auction,
  franchise,
  onNewGame,
}: {
  auction: Auction;
  franchise: Franchise;
  onNewGame: () => void;
}) {
  const franchiseName = franchise.name;
  // Pokémon tiene su propio cálculo automático (estadísticas + tabla de tipos), sin IA ni clave
  const [auto] = useState(() => (franchise.source.type === 'pokeapi' ? pokemonVerdict(auction) : null));
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [apiKey, setApiKey] = useState(getStoredKey());

  const judge = () => {
    if (apiKey.trim() !== getStoredKey()) saveKey(apiKey);
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

      {auto && (
        <View style={s.verdict}>
          <Text style={s.verdictLabel}>⚡ CÁLCULO AUTOMÁTICO</Text>
          <Text style={s.winner}>
            {auto.winner === null ? '🤝 ¡Empate!' : `🏆 Gana ${auction.players[auto.winner].name}`}
          </Text>
          <Text style={s.analysis}>{auto.analysis}</Text>
        </View>
      )}

      {verdict && (
        <View style={s.verdict}>
          {auto && <Text style={s.verdictLabel}>🤖 VALORACIÓN CON IA</Text>}
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
                <View style={{ alignItems: 'flex-start' }}>
                  <TagChips tags={c.tags} small />
                </View>
                {c.stats && <Text style={s.stats}>{statLine(c)}</Text>}
                {summaryOf(c.name) && <Text style={s.summary}>{summaryOf(c.name)}</Text>}
              </View>
            </View>
          ))}
        </View>
      ))}

      {!verdict && !getStoredKey() && (
        <TextInput
          style={s.input}
          placeholder="Pega aquí tu clave de Anthropic (solo una vez)"
          placeholderTextColor="#889"
          value={apiKey}
          onChangeText={setApiKey}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
      )}
      {error && <Text style={s.error}>{error}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color="#ffb703" style={{ marginVertical: 20 }} />
      ) : (
        !verdict && (
          <Pressable style={s.btn} onPress={judge}>
            <Text style={s.btnText}>
              {error ? 'Reintentar' : auto ? '🤖 Valoración con IA (opcional)' : '⚔️ ¿Quién ganaría?'}
            </Text>
          </Pressable>
        )
      )}
      {/* PRUEBA ChatGPT: valoración gratuita fuera de la app */}
      <Pressable style={[s.btn, s.btnChatGpt]} onPress={() => openChatGpt(buildChatGptPrompt(franchiseName, auction))}>
        <Text style={s.btnText}>💬 Valorar con ChatGPT (gratis)</Text>
      </Pressable>
      <Text style={s.hint}>
        Se abre ChatGPT con la pregunta ya escrita. Si aparece vacío, pégala: ya está copiada.
      </Text>

      <Pressable onPress={onNewGame}>
        <Text style={s.link}>Nueva partida</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, minHeight: '100%' },
  title: { color: '#fff', fontSize: 30, fontWeight: '800', marginBottom: 16 },
  verdict: { backgroundColor: 'rgba(28,10,58,0.94)', borderRadius: 12, padding: 16, marginBottom: 20 },
  verdictLabel: { color: '#5ef6ff', fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  stats: { color: '#c9b8ff', fontSize: 11, marginTop: 3 },
  winner: { color: '#ffb703', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  analysis: { color: '#dde', fontSize: 15, lineHeight: 22 },
  team: { marginBottom: 24 },
  player: { color: '#ffb703', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(28,10,58,0.94)', borderRadius: 10, padding: 8, marginBottom: 8 },
  img: { width: 70, height: 70 },
  name: { color: '#fff', fontSize: 16, fontWeight: '700' },
  summary: { color: '#aab', fontSize: 13, marginTop: 2 },
  input: { backgroundColor: 'rgba(28,10,58,0.94)', color: '#fff', padding: 14, borderRadius: 10, marginBottom: 10, fontSize: 16 },
  error: { color: '#ff6b6b', textAlign: 'center', marginBottom: 12 },
  btn: { backgroundColor: '#e63946', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnChatGpt: { backgroundColor: '#10a37f', marginTop: 16 },
  hint: { color: '#aab', fontSize: 12, textAlign: 'center', marginTop: 6 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  link: { color: '#ffb703', textAlign: 'center', marginTop: 20, fontSize: 16 },
});
