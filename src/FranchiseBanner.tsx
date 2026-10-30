import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Theme = {
  title: string;
  gradient: [string, string, ...string[]];
  logo: number; // logo oficial incluido en assets/logos
  Decor: (p: { height: number }) => React.ReactElement;
};

export const THEMES: Record<string, Theme> = {
  onepiece: {
    title: 'One Piece',
    gradient: ['#fff3d6', '#f1d9a7', '#d9b77a'],
    logo: require('../assets/logos/onepiece.png'),
    Decor: Sea,
  },
  naruto: {
    title: 'Naruto',
    gradient: ['#0f3d1e', '#1b5e20', '#2e7d32'],
    logo: require('../assets/logos/naruto.png'),
    Decor: Leaves,
  },
  dragonball: {
    title: 'Dragon Ball',
    gradient: ['#81d4fa', '#29b6f6', '#0277bd'],
    logo: require('../assets/logos/dragonball.png'),
    Decor: Clouds,
  },
  starwars: {
    title: 'Star Wars',
    gradient: ['#000000', '#05051a', '#0d0d2b'],
    logo: require('../assets/logos/starwars.png'),
    Decor: Stars,
  },
  pokemon: {
    title: 'Pokémon',
    gradient: ['#ff5252', '#e53935', '#b71c1c'],
    logo: require('../assets/logos/pokemon.png'),
    Decor: Pokeball,
  },
};

export default function FranchiseBanner({ id, height = 120 }: { id: string; height?: number }) {
  const theme = THEMES[id];
  if (!theme) return null;
  const { Decor } = theme;

  return (
    <LinearGradient colors={theme.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.banner, { height }]}>
      <Decor height={height} />
      <View style={s.content}>
        <Image
          source={theme.logo}
          accessibilityLabel={theme.title}
          style={{ width: '70%', height: height * 0.72 }}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
}

// --- Decorados de fondo, dibujados con vistas para no depender de imágenes ---

function seeded(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function Stars({ height }: { height: number }) {
  const rnd = seeded(7);
  const stars = Array.from({ length: 70 }, (_, i) => {
    const size = rnd() < 0.85 ? 1.5 : 2.5;
    return (
      <View
        key={i}
        style={{
          position: 'absolute',
          left: `${rnd() * 100}%`,
          top: rnd() * height,
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: '#fff',
          opacity: 0.4 + rnd() * 0.6,
        }}
      />
    );
  });
  return <View style={StyleSheet.absoluteFill}>{stars}</View>;
}

function Sea({ height }: { height: number }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Text style={[s.bigEmoji, { right: 10, top: height * 0.12, fontSize: height * 0.62, opacity: 0.12 }]}>☠️</Text>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: -60 + i * 110,
            bottom: -height * 0.95,
            width: height * 1.2,
            height: height * 1.2,
            borderRadius: height,
            backgroundColor: 'rgba(120,80,30,0.10)',
          }}
        />
      ))}
    </View>
  );
}

function Leaves({ height }: { height: number }) {
  const rnd = seeded(3);
  return (
    <View style={StyleSheet.absoluteFill}>
      {Array.from({ length: 9 }, (_, i) => (
        <Text
          key={i}
          style={[
            s.bigEmoji,
            {
              left: `${8 + rnd() * 88}%`,
              top: rnd() * height * 0.8,
              fontSize: 14 + rnd() * 18,
              opacity: 0.35,
              transform: [{ rotate: `${Math.round(rnd() * 360)}deg` }],
            },
          ]}
        >
          🍃
        </Text>
      ))}
    </View>
  );
}

function Clouds({ height }: { height: number }) {
  const cloud = (left: string, top: number, w: number, o: number) => (
    <View key={left + top} style={{ position: 'absolute', left: left as any, top, opacity: o }}>
      <View style={{ width: w, height: w * 0.35, borderRadius: w, backgroundColor: '#fff', marginTop: w * 0.18 }} />
      <View
        style={{
          position: 'absolute',
          left: w * 0.22,
          top: 0,
          width: w * 0.45,
          height: w * 0.4,
          borderRadius: w,
          backgroundColor: '#fff',
        }}
      />
    </View>
  );
  return (
    <View style={StyleSheet.absoluteFill}>
      {cloud('-6%', height * 0.62, 130, 0.55)}
      {cloud('62%', height * 0.08, 110, 0.45)}
      {cloud('78%', height * 0.6, 120, 0.6)}
      {cloud('35%', height * 0.78, 90, 0.35)}
    </View>
  );
}

function Pokeball({ height }: { height: number }) {
  const size = height * 1.1;
  const band = Math.max(6, size * 0.07);
  return (
    <View style={StyleSheet.absoluteFill}>
      <View
        style={{
          position: 'absolute',
          right: -size * 0.18,
          top: (height - size) / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          opacity: 0.22,
          borderWidth: band / 2,
          borderColor: '#fff',
        }}
      >
        <View style={{ flex: 1 }} />
        <View style={{ height: band, backgroundColor: '#fff' }} />
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.5)' }} />
        <View
          style={{
            position: 'absolute',
            left: size / 2 - size * 0.17,
            top: size / 2 - size * 0.17,
            width: size * 0.34,
            height: size * 0.34,
            borderRadius: size,
            borderWidth: band,
            borderColor: '#fff',
          }}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  banner: { borderRadius: 18, overflow: 'hidden', justifyContent: 'center' },
  content: { paddingHorizontal: 22 },
  bigEmoji: { position: 'absolute' },
});
