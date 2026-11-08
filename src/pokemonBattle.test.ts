import assert from 'node:assert/strict';
import { bestMultiplier, duel, effectiveness, pokemonVerdict } from './pokemonBattle.ts';
import { startAuction, pass, raise, canBid } from './auction.ts';

const mk = (name: string, tags: string[], st: number[]) => ({
  id: name,
  name,
  image: '',
  tags,
  stats: { hp: st[0], atk: st[1], def: st[2], spa: st[3], spd: st[4], spe: st[5] },
});

// Tabla de tipos
assert.equal(effectiveness('water', ['fire']), 2);
assert.equal(effectiveness('electric', ['ground']), 0);
assert.equal(effectiveness('ice', ['dragon', 'flying']), 4);
assert.equal(effectiveness('fire', ['water', 'rock']), 0.25);
assert.equal(effectiveness('fighting', ['ghost']), 0);

// Datos reales de estadísticas base
const charizard = mk('Charizard', ['fire', 'flying'], [78, 84, 78, 109, 85, 100]);
const blastoise = mk('Blastoise', ['water'], [79, 83, 100, 85, 105, 78]);
const venusaur = mk('Venusaur', ['grass', 'poison'], [80, 82, 83, 100, 100, 80]);
const pikachu = mk('Pikachu', ['electric'], [35, 55, 40, 50, 50, 90]);
const sandslash = mk('Sandslash', ['ground'], [75, 100, 110, 45, 55, 65]);
const gengar = mk('Gengar', ['ghost', 'poison'], [60, 65, 60, 130, 75, 110]);
const snorlax = mk('Snorlax', ['normal'], [160, 110, 65, 65, 110, 30]);

assert.equal(bestMultiplier(blastoise, charizard), 2);
assert.equal(duel(blastoise, charizard), 1); // el agua gana al fuego
assert.equal(duel(charizard, venusaur), 1); // el fuego gana a la planta
assert.equal(duel(sandslash, pikachu), 1); // tierra inmune a eléctrico y además le pega x2
assert.equal(duel(pikachu, sandslash), 0);
// Snorlax (normal) no puede tocar a Gengar (fantasma), pero Gengar sí a Snorlax
assert.equal(duel(gengar, snorlax), 1);

// Veredicto completo
const chars = [blastoise, sandslash, charizard, pikachu];
let a = startAuction(['Ana', 'Beto'], 20, chars as any, 2);
a = pass(a); // Beto se lleva Blastoise
a = pass(a); // Ana se lleva Sandslash
a = pass(a); // Beto se lleva Charizard
// Pikachu va gratis a Ana
assert.ok(a.done);
const v = pokemonVerdict(a);
assert.equal(v.score[0] + v.score[1], 4);
assert.ok(v.analysis.length > 50);
assert.equal(v.characters.length, 4);
console.log('ok pokemon', v.winner, v.score, '\n' + v.analysis);
