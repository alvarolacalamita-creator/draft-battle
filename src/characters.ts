import type { Character } from './auction';
import type { Franchise } from './franchises';

async function getJson(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`${res.status} al pedir ${url}`);
    return await res.json();
  } catch (e: any) {
    if (e?.name === 'AbortError') throw new Error('El servidor de personajes tarda demasiado, prueba de nuevo');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

async function anilistPool(malId: number): Promise<Character[]> {
  const query = `query($id:Int){Media(idMal:$id,type:ANIME){characters(sort:FAVOURITES_DESC,perPage:50){nodes{id name{full} image{large}}}}}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ query, variables: { id: malId } }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`AniList ${res.status}`);
    const json = await res.json();
    const nodes: any[] = json?.data?.Media?.characters?.nodes ?? [];
    return nodes
      .filter((n) => n.image?.large && !n.image.large.includes('default'))
      .map((n) => ({ id: String(n.id), name: n.name.full, image: n.image.large }));
  } finally {
    clearTimeout(timer);
  }
}

async function jikanPool(malId: number): Promise<Character[]> {
  const json = await getJson(`https://api.jikan.moe/v4/anime/${malId}/characters`);
  return (json.data as any[])
    .filter((d) => d.character?.images?.jpg?.image_url && !d.character.images.jpg.image_url.includes('questionmark'))
    .sort((a, b) => b.favorites - a.favorites)
    .slice(0, 60) // los más populares, para que salgan personajes reconocibles
    .map((d) => ({
      id: String(d.character.mal_id),
      name: d.character.name,
      image: d.character.images.jpg.image_url,
    }));
}

/** AniList es rápida y devuelve solo los populares; si falla, se usa Jikan. */
async function animePool(malId: number): Promise<Character[]> {
  let anilistError = 'devolvió pocos personajes';
  try {
    const pool = await anilistPool(malId);
    if (pool.length >= 8) return pool;
  } catch (e: any) {
    anilistError = String(e?.message ?? e);
  }
  try {
    return await jikanPool(malId);
  } catch (e: any) {
    throw new Error(`AniList: ${anilistError} | Jikan: ${String(e?.message ?? e)}`);
  }
}

// La lista de personajes populares se guarda en el móvil para que las siguientes partidas carguen al instante.
const CACHE_PREFIX = 'pool_v1_';

async function cachedPool(key: string, load: () => Promise<Character[]>): Promise<Character[]> {
  try {
    const saved = globalThis.localStorage?.getItem(CACHE_PREFIX + key);
    if (saved) {
      const pool = JSON.parse(saved) as Character[];
      if (pool.length >= 8) return pool;
    }
  } catch {}
  const pool = await load();
  try {
    globalThis.localStorage?.setItem(CACHE_PREFIX + key, JSON.stringify(pool));
  } catch {}
  return pool;
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
      const malId = f.source.malId;
      const pool = await cachedPool(f.id, () => animePool(malId));
      return sample(pool, count);
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
      const pool = await cachedPool(f.id, async () => {
        const all = (await getJson('https://akabab.github.io/starwars-api/api/all.json')) as any[];
        return all.filter((c) => c.image).map((c) => ({ id: String(c.id), name: c.name, image: c.image }));
      });
      return sample(pool, count);
    }
  }
}
