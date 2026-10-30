// Nombre en español y color de cada tipo de Pokémon
export const POKEMON_TYPES: Record<string, { label: string; color: string }> = {
  normal: { label: 'Normal', color: '#a8a77a' },
  fire: { label: 'Fuego', color: '#ee8130' },
  water: { label: 'Agua', color: '#6390f0' },
  electric: { label: 'Eléctrico', color: '#d4a90a' },
  grass: { label: 'Planta', color: '#4f9d3a' },
  ice: { label: 'Hielo', color: '#6cc5c5' },
  fighting: { label: 'Lucha', color: '#c22e28' },
  poison: { label: 'Veneno', color: '#a33ea1' },
  ground: { label: 'Tierra', color: '#b08f3a' },
  flying: { label: 'Volador', color: '#8f7fd8' },
  psychic: { label: 'Psíquico', color: '#f95587' },
  bug: { label: 'Bicho', color: '#8fa31a' },
  rock: { label: 'Roca', color: '#a38c21' },
  ghost: { label: 'Fantasma', color: '#735797' },
  dragon: { label: 'Dragón', color: '#6f35fc' },
  dark: { label: 'Siniestro', color: '#705746' },
  steel: { label: 'Acero', color: '#8b8ba8' },
  fairy: { label: 'Hada', color: '#d685ad' },
};

export const typeLabel = (t: string) => POKEMON_TYPES[t]?.label ?? t;
export const typeColor = (t: string) => POKEMON_TYPES[t]?.color ?? '#556';
