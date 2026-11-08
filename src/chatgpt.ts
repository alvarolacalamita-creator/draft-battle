// PRUEBA: valoración gratuita abriendo ChatGPT con la pregunta ya escrita (sin clave ni coste).
import { Linking } from 'react-native';
import type { Auction } from './auction';
import { statLine } from './pokemonBattle';
import { typeLabel } from './pokemonTypes';

export function buildChatGptPrompt(franchiseName: string, auction: Auction): string {
  const teams = auction.players
    .map((p) => {
      const members = p.team
        .map((c) => {
          const extra = [
            c.tags?.length ? `tipo ${c.tags.map(typeLabel).join('/')}` : '',
            c.stats ? statLine(c) : '',
          ]
            .filter(Boolean)
            .join('; ');
          return `- ${c.name}${extra ? ` (${extra})` : ''}`;
        })
        .join('\n');
      return `Equipo de ${p.name}:\n${members}`;
    })
    .join('\n\n');

  return `Eres el árbitro de un juego de draft entre amigos. La franquicia es "${franchiseName}". Cada jugador ha formado un equipo de ${auction.teamSize} personajes:

${teams}

Haz una valoración EXHAUSTIVA de quién ganaría un combate ${auction.teamSize} contra ${auction.teamSize}:
1. Ficha de cada personaje: poderes, técnicas, nivel de fuerza, puntos fuertes y débiles (en One Piece ten en cuenta fruta del diablo y haki; en Pokémon, tipos y estadísticas).
2. Los enfrentamientos individuales más importantes y quién ganaría cada uno.
3. Sinergias y debilidades de cada equipo en conjunto.
4. Veredicto final: qué equipo gana, con una puntuación de 0 a 10 para cada equipo y el personaje más determinante (MVP).

Responde en español, con títulos claros.`;
}

/** Copia la pregunta (por si ChatGPT no la rellena sola) y abre ChatGPT con ella. */
export async function openChatGpt(prompt: string): Promise<void> {
  try {
    await globalThis.navigator?.clipboard?.writeText(prompt);
  } catch {}
  await Linking.openURL(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`);
}
