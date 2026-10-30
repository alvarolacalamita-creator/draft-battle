import type { Auction } from './auction';

const MODEL = 'claude-sonnet-5-5';
const KEY_NAME = 'anthropic_api_key';

// La clave se guarda solo en el navegador del móvil; nunca va dentro del código.
export function getStoredKey(): string {
  try {
    return globalThis.localStorage?.getItem(KEY_NAME) ?? '';
  } catch {
    return '';
  }
}

export function saveKey(key: string) {
  try {
    globalThis.localStorage?.setItem(KEY_NAME, key.trim());
  } catch {}
}

export type Verdict = {
  winner: 0 | 1 | null; // null = empate
  characters: { name: string; summary: string }[];
  analysis: string;
};

export async function getVerdict(franchiseName: string, auction: Auction): Promise<Verdict> {
  const apiKey = getStoredKey();
  if (!apiKey) throw new Error('Primero pega tu clave de Anthropic');

  const teams = auction.players
    .map(
      (p, i) =>
        `Equipo ${i} (${p.name}): ${p.team.map((c) => (c.tags?.length ? `${c.name} [tipo: ${c.tags.join('/')}]` : c.name)).join(', ')}`,
    )
    .join('\n');

  const prompt = `Eres el árbitro de un juego de draft entre dos amigos. La franquicia es "${franchiseName}".
Cada jugador ha formado un equipo de personajes de esa franquicia:

${teams}

Haz lo siguiente:
1. Para CADA personaje, escribe un resumen breve (máximo 2 frases) de lo que lo hace fuerte: poderes, técnicas, armas, nivel de fuerza, etc. Si de la franquicia es relevante algo concreto (por ejemplo fruta del diablo o haki en One Piece), menciónalo.
2. Valora de forma exhaustiva y razonada cuál de los dos equipos ganaría en un combate ${auction.teamSize} contra ${auction.teamSize}, teniendo en cuenta fuerza individual, sinergias y debilidades (y las ventajas o desventajas de tipos si se indican). Si de verdad es un empate, dilo.

Responde SOLO con JSON válido, sin texto adicional ni bloques de código, con este formato:
{"characters":[{"name":"...","summary":"..."}],"analysis":"...","winner":0}
Donde "winner" es 0 o 1 según el equipo ganador, o null si hay empate. "analysis" debe tener 4-6 frases en español.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Error de la API de Claude (${res.status}): ${(await res.text()).slice(0, 200)}`);

  const data = await res.json();
  const text: string = (data.content ?? []).map((b: any) => b.text ?? '').join('');
  return parseVerdict(text);
}

export function parseVerdict(text: string): Verdict {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('Claude no devolvió un veredicto legible');
  const v = JSON.parse(text.slice(start, end + 1));
  return {
    winner: v.winner === 0 || v.winner === 1 ? v.winner : null,
    characters: Array.isArray(v.characters) ? v.characters : [],
    analysis: String(v.analysis ?? ''),
  };
}
