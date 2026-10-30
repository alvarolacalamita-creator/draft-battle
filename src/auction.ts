export type Character = { id: string; name: string; image: string };
export type PlayerState = { name: string; coins: number; team: Character[] };
export type PlayerIdx = 0 | 1;

export type Auction = {
  players: [PlayerState, PlayerState];
  queue: Character[];
  index: number; // personaje actual
  bid: number; // puja actual
  leader: PlayerIdx | null; // quién va ganando la puja
  turn: PlayerIdx; // a quién le toca decidir
  teamSize: number;
  done: boolean;
};

const other = (p: PlayerIdx): PlayerIdx => (p === 0 ? 1 : 0);

export function startAuction(
  names: [string, string],
  budget: number,
  queue: Character[],
  teamSize = 4,
): Auction {
  const a: Auction = {
    players: [
      { name: names[0], coins: budget, team: [] },
      { name: names[1], coins: budget, team: [] },
    ],
    queue,
    index: 0,
    bid: 0,
    leader: null,
    turn: 0,
    teamSize,
    done: false,
  };
  return settle(a);
}

const slotsLeft = (a: Auction, p: PlayerIdx) => a.teamSize - a.players[p].team.length;

/** Puja máxima: hay que guardar al menos 1 moneda por cada hueco que quede por rellenar. */
export function maxBid(a: Auction, p: PlayerIdx): number {
  const slots = slotsLeft(a, p);
  return slots <= 0 ? 0 : a.players[p].coins - (slots - 1);
}

export const canBid = (a: Auction) => a.bid + 1 <= maxBid(a, a.turn);

/** Si un jugador ya tiene el equipo completo, el otro se lleva el personaje gratis. */
function settle(a: Auction): Auction {
  while (a.index < a.queue.length) {
    const full0 = slotsLeft(a, 0) <= 0;
    const full1 = slotsLeft(a, 1) <= 0;
    if (!full0 && !full1) return a;
    if (full0 && full1) break;
    a = award(a, full0 ? 1 : 0, 0, false);
  }
  return { ...a, done: true };
}

function award(a: Auction, winner: PlayerIdx, price: number, doSettle = true): Auction {
  const players = [...a.players] as [PlayerState, PlayerState];
  const w = players[winner];
  players[winner] = {
    ...w,
    coins: w.coins - price,
    team: [...w.team, a.queue[a.index]],
  };
  const index = a.index + 1;
  const next: Auction = {
    ...a,
    players,
    index,
    bid: 0,
    leader: null,
    turn: (index % 2) as PlayerIdx, // quien abre la puja se alterna
    done: index >= a.queue.length,
  };
  return doSettle && !next.done ? settle(next) : next;
}

export function raise(a: Auction): Auction {
  if (!canBid(a)) return a;
  return { ...a, bid: a.bid + 1, leader: a.turn, turn: other(a.turn) };
}

/** El jugador de turno se planta: gana el otro, pagando la puja (mínimo 1). */
export function pass(a: Auction): Auction {
  const winner = other(a.turn);
  return award(a, winner, Math.max(a.bid, 1));
}
