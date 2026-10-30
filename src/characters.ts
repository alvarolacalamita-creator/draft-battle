import type { Character } from './auction';
import type { Franchise } from './franchises';

async function getJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} al pedir ${url}`);
  return res.json();
}

function sample<T>(items: T[], n: number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Devuelve `count` personajes aleatorios de la franquicia, con nombre y foto. */
export async function fetchCharacters(f: Franchise, count = 8): Promise<Character[]> {
  switch (f.source.type) {
    case 'jikan': {
      const json = await getJson(`https://api.jikan.moe/v4/anime/${f.source.malId}/characters`);
      const pool = (json.data as any[])
        .filter((d) => d.character?.images?.jpg?.image_url && !d.character.images.jpg.image_url.includes('questionmark'))
        .sort((a, b) => b.favorites - a.favorites)
        .slice(0, 60); // los 60 más populares, para que salgan personajes reconocibles
      return sample(pool, count).map((d) => ({
        id: String(d.character.mal_id),
        name: d.character.name,
        image: d.character.images.jpg.image_url,
      }));
    }
    case 'pokeapi': {
      const ids = sample(Array.from({ length: 898 }, (_, i) => i + 1), count);
      const all = await Promise.all(ids.map((id) => getJson(`https://pokeapi.co/api/v2/pokemon/${id}`)));
      return all.map((p) => ({
        id: String(p.id),
        name: cap(p.name),
        image: p.sprites.other['official-artwork'].front_default ?? p.sprites.front_default,
      }));
    }
    case 'starwars': {
      const all = (await getJson('https://akabab.github.io/starwars-api/api/all.json')) as any[];
      return sample(
        all.filter((c) => c.image),
        count,
      ).map((c) => ({ id: String(c.id), name: c.name, image: c.image }));
    }
  }
}
