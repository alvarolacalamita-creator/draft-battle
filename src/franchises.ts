// Cada franquicia indica de dónde salen sus personajes:
// - jikan: anime en MyAnimeList (api.jikan.moe), con el id del anime
// - pokeapi: Pokémon (pokeapi.co), con artwork oficial y estadísticas
// - starwars: personajes con imagen (akabab.github.io/starwars-api)
export type Source =
  | { type: 'jikan'; malId: number }
  | { type: 'pokeapi' }
  | { type: 'starwars' };

export type Franchise = { id: string; name: string; source: Source };

export const FRANCHISES: Franchise[] = [
  { id: 'onepiece', name: 'One Piece', source: { type: 'jikan', malId: 21 } },
  { id: 'naruto', name: 'Naruto', source: { type: 'jikan', malId: 20 } },
  { id: 'dragonball', name: 'Dragon Ball', source: { type: 'jikan', malId: 813 } },
  { id: 'starwars', name: 'Star Wars', source: { type: 'starwars' } },
  { id: 'pokemon', name: 'Pokémon', source: { type: 'pokeapi' } },
];
