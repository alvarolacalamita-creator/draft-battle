import type { Auction, Character } from './auction';
import { typeLabel } from './pokemonTypes';

export type Stats = { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };

// Tabla de tipos (6.ª generación en adelante): para cada tipo atacante, multiplicador contra cada tipo defensor.
// Lo que no aparece vale x1.
const CHART: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, steel: 0.5, ghost: 0 },
  fire: { grass: 2, ice: 2, bug: 2, steel: 2, fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5 },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0 },
  grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5 },
  ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
  poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
  ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
  flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
  ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
  steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
  fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 },
};

/** Multiplicador de un tipo atacante contra un Pokémon con uno o dos tipos. */
export function effectiveness(attackType: string, defenderTypes: string[]): number {
  return defenderTypes.reduce((m, t) => m * (CHART[attackType]?.[t] ?? 1), 1);
}

/** El mejor multiplicador que consigue A atacando con cualquiera de sus tipos. */
export function bestMultiplier(a: Character, b: Character): number {
  return Math.max(...(a.tags ?? ['normal']).map((t) => effectiveness(t, b.tags ?? ['normal'])));
}

export const total = (s: Stats) => s.hp + s.atk + s.def + s.spa + s.spd + s.spe;

const EMPTY: Stats = { hp: 1, atk: 1, def: 1, spa: 1, spd: 1, spe: 1 };
const statsOf = (c: Character): Stats => (c.stats as Stats | undefined) ?? EMPTY;

/**
 * Combate 1 contra 1 simplificado: cada uno ataca con su mejor estadística ofensiva (física o especial)
 * y su mejor tipo; gana quien necesita menos "turnos" para debilitar al otro, y el más rápido si empatan.
 * Devuelve 1 si gana A, 0 si gana B y 0.5 si es empate.
 */
export function duel(a: Character, b: Character): number {
  const sa = statsOf(a);
  const sb = statsOf(b);
  const hit = (att: Stats, def: Stats, mult: number) =>
    mult * (att.atk >= att.spa ? att.atk / def.def : att.spa / def.spd);
  const dmgA = hit(sa, sb, bestMultiplier(a, b));
  const dmgB = hit(sb, sa, bestMultiplier(b, a));
  const turnsA = dmgA > 0 ? sb.hp / dmgA : Infinity; // turnos que tarda A en debilitar a B
  const turnsB = dmgB > 0 ? sa.hp / dmgB : Infinity;
  if (turnsA === Infinity && turnsB === Infinity) return 0.5;
  if (Math.abs(turnsA - turnsB) < 1e-9) return sa.spe === sb.spe ? 0.5 : sa.spe > sb.spe ? 1 : 0;
  return turnsA < turnsB ? 1 : 0;
}

export type PokemonVerdict = {
  winner: 0 | 1 | null;
  score: [number, number]; // duelos ganados por cada equipo
  analysis: string;
  characters: { name: string; summary: string }[];
};

const label = (types?: string[]) => (types ?? []).map(typeLabel).join('/');

export function statLine(c: Character): string {
  const s = statsOf(c);
  return `PS ${s.hp} · Atq ${s.atk} · Def ${s.def} · AtEsp ${s.spa} · DfEsp ${s.spd} · Vel ${s.spe} (Total ${total(s)})`;
}

/** Enfrenta a cada Pokémon contra todos los del rival y suma los duelos ganados. */
export function pokemonVerdict(auction: Auction): PokemonVerdict {
  const [t0, t1] = [auction.players[0].team, auction.players[1].team];
  const [n0, n1] = [auction.players[0].name, auction.players[1].name];
  let score0 = 0;
  const wins = new Map<string, number>();
  const notable: { a: Character; b: Character; mult: number }[] = [];

  for (const a of t0) {
    for (const b of t1) {
      const r = duel(a, b);
      score0 += r;
      wins.set(a.id, (wins.get(a.id) ?? 0) + r);
      wins.set(b.id, (wins.get(b.id) ?? 0) + (1 - r));
      const mAB = bestMultiplier(a, b);
      const mBA = bestMultiplier(b, a);
      if (mAB >= 2 && mBA < 2) notable.push({ a, b, mult: mAB });
      if (mBA >= 2 && mAB < 2) notable.push({ a: b, b: a, mult: mBA });
    }
  }
  const duels = t0.length * t1.length;
  const score1 = duels - score0;

  const bst0 = t0.reduce((s, c) => s + total(statsOf(c)), 0);
  const bst1 = t1.reduce((s, c) => s + total(statsOf(c)), 0);

  let winner: 0 | 1 | null = score0 > score1 ? 0 : score1 > score0 ? 1 : null;
  if (winner === null && bst0 !== bst1) winner = bst0 > bst1 ? 0 : 1; // desempate por estadísticas totales

  const all = [...t0, ...t1];
  const mvp = all.reduce((best, c) => ((wins.get(c.id) ?? 0) > (wins.get(best.id) ?? 0) ? c : best), all[0]);
  const fastest = all.reduce((best, c) => (statsOf(c).spe > statsOf(best).spe ? c : best), all[0]);

  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  const parts: string[] = [];
  parts.push(
    `Cada Pokémon se ha enfrentado a todos los del rival (${duels} duelos). ${n0} gana ${fmt(score0)} y ${n1} gana ${fmt(score1)}.`,
  );
  parts.push(`Estadísticas totales del equipo: ${n0} ${bst0} frente a ${n1} ${bst1}.`);
  if (notable.length) {
    const shown = notable
      .slice(0, 4)
      .map((x) => `${x.a.name} (${label(x.a.tags)}) pega x${x.mult} a ${x.b.name} (${label(x.b.tags)})`);
    parts.push(`Ventajas de tipo clave: ${shown.join('; ')}.`);
  } else {
    parts.push('No hay ventajas de tipo claras: decide la fuerza bruta.');
  }
  parts.push(`El más destacado es ${mvp.name}, que gana ${fmt(wins.get(mvp.id) ?? 0)} de sus duelos, y el más rápido es ${fastest.name}.`);
  if (score0 === score1) {
    parts.push(
      winner === null
        ? 'Empate total en duelos y en estadísticas.'
        : `Empate en duelos: decide la suma de estadísticas a favor de ${auction.players[winner].name}.`,
    );
  }

  return {
    winner,
    score: [score0, score1],
    analysis: parts.join(' '),
    characters: all.map((c) => ({ name: c.name, summary: statLine(c) })),
  };
}
