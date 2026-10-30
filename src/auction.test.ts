import assert from 'node:assert/strict';
import { canBid, maxBid, pass, raise, startAuction } from './auction.ts';
import type { Character } from './auction.ts';

const chars: Character[] = Array.from({ length: 8 }, (_, i) => ({ id: String(i), name: `C${i}`, image: '' }));

// Puja normal: A abre con 1, B sube a 2, A se planta -> gana B pagando 2
let a = startAuction(['A', 'B'], 20, chars);
a = raise(a);
a = raise(a);
a = pass(a);
assert.equal(a.players[1].coins, 18);
assert.equal(a.players[1].team.length, 1);
assert.equal(a.index, 1);
assert.equal(a.turn, 1); // abre el otro jugador

// Plantarse sin pujas: el otro gana por 1
a = pass(a);
assert.equal(a.players[0].coins, 19);

// Reserva: con 4 huecos y 4 monedas solo se puede pujar 1
let b = startAuction(['A', 'B'], 4, chars);
assert.equal(maxBid(b, 0), 1);
b = raise(b);
assert.equal(canBid(b), false);

// Partida completa: siempre termina con 4 y 4 y sin monedas negativas
let g = startAuction(['A', 'B'], 20, chars);
let steps = 0;
while (!g.done && steps++ < 1000) g = Math.random() < 0.5 && canBid(g) ? raise(g) : pass(g);
assert.ok(g.done);
assert.equal(g.players[0].team.length, 4);
assert.equal(g.players[1].team.length, 4);
assert.ok(g.players[0].coins >= 0 && g.players[1].coins >= 0);

// Si un jugador completa su equipo, el resto va gratis al otro
let h = startAuction(['A', 'B'], 40, chars);
while (h.players[0].team.length < 4 && !h.done) {
  // B sube siempre y A se planta, así A solo cobra los personajes que abre B... y viceversa
  h = h.turn === 0 ? pass(h) : raise(h);
  if (h.turn === 1 && h.leader === 1) h = pass(h);
}
assert.ok(h.done);
assert.equal(h.players[0].team.length + h.players[1].team.length, 8);
console.log('ok');

// Partidas de 6 (3 cada uno) y 10 (5 cada uno)
for (const size of [3, 5]) {
  const q = chars.concat(chars).slice(0, size * 2).map((c, i) => ({ ...c, id: String(i) }));
  let t = startAuction(['A', 'B'], 20, q, size);
  let n = 0;
  while (!t.done && n++ < 1000) t = Math.random() < 0.5 && canBid(t) ? raise(t) : pass(t);
  assert.ok(t.done);
  assert.equal(t.players[0].team.length, size);
  assert.equal(t.players[1].team.length, size);
}
console.log('ok tamaños');
