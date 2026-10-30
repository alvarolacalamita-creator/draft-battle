import { useState } from 'react';
import { Image, StyleSheet, Text, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Logos desde Wikimedia Commons. Si alguno no carga, se muestra el nombre con la tipografía temática.
const logo = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=600`;

type Theme = {
  title: string;
  gradient: [string, string, ...string[]];
  text: TextStyle;
  logo: string;
  logoTint?: string; // colorea el logo si el original no contrasta con el fondo
  Decor: (p: { height: number }) => React.ReactElement;
};

export const THEMES: Record<string, Theme> = {
  starwars: {
    title: 'STAR WARS',
    gradient: ['#000000', '#05051a', '#0d0d2b'],
    text: {
      fontFamily: 'Orbitron_900Black',
      fontSize: 34,
      color: '#ffe81f',
      letterSpacing: 4,
      textShadowColor: 'rgba(255,232,31,0.6)',
      textShadowRadius: 12,
    },
    logo: logo('Star_Wars_Logo.svg'),
    logoTint: '#ffe81f',
    Decor: Stars,
  },
  onepiece: {
    title: 'One Piece',
    gradient: ['#4fc3f7', '#0288d1', '#01579b'],
    text: {
      fontFamily: 'PirataOne_400Regular',
      fontSize: 48,
      color: '#ffd54f',
      textShadowColor: '#4e2a04',
      textShadowOffset: { width: 2, height: 3 },
      textShadowRadius: 1,
    },
    logo: logo('One_Piece_Logo.svg'),
    Decor: Sea,
  },
  naruto: {
    title: 'NARUTO',
    gradient: ['#ffa726', '#f57c00', '#e65100'],
    text: {
      fontFamily: 'Bangers_400Regular',
      fontSize: 52,
      letterSpacing: 2,
      color: '#ffffff',
      textShadowColor: '#1a237e',
      textShadowOffset: { width: 3, height: 3 },
      textShadowRadius: 1,
    },
    logo: logo('Naruto_logo.svg'),
    logoTint: '#ffffff',
    Decor: Leaf,
  },
  dragonball: {
    title: 'DRAGON BALL',
    gradient: ['#64b5f6', '#1e88e5', '#0d47a1'],
    text: {
      fontFamily: 'LuckiestGuy_400Regular',
      fontSize: 34,
      color: '#ffeb3b',
      textShadowColor: '#c62828',
      textShadowOffset: { width: 3, height: 3 },
      textShadowRadius: 1,
    },
    logo: logo('Dragon_Ball_Z_logo.svg'),
    Decor: DragonBallDecor,
  },
  pokemon: {
    title: 'Pokémon',
    gradient: ['#3b82f6', '#1d4ed8', '#1e3a8a'],
    text: {
      fontFamily: 'LuckiestGuy_400Regular',
      fontSize: 42,
      color: '#ffcb05',
      textShadowColor: '#0b1f5c',
      textShadowOffset: { width: 3, height: 3 },
      textShadowRadius: 1,
    },
    logo: logo('International_Pokémon_logo.svg'),
    Decor: Pokeball,
  },
};

export default function FranchiseBanner({ id, height = 120 }: { id: string; height?: number }) {
  const theme = THEMES[id];
  const [logoOk, setLogoOk] = useState(false);
  if (!theme) return null;
  const { Decor } = theme;

  return (
    <LinearGradient colors={theme.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.banner, { height }]}>
      <Decor height={height} />
      <View style={s.content}>
        {!logoOk && <Text style={theme.text}>{theme.title}</Text>}
        <Image
          source={{ uri: theme.logo }}
          style={logoOk ? { width: '62%', height: height * 0.62, tintColor: theme.logoTint } : s.hidden}
          resizeMode="contain"
          onLoad={() => setLogoOk(true)}
          onError={() => setLogoOk(false)}
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
      <Text style={[s.bigEmoji, { right: 10, top: height * 0.12, fontSize: height * 0.62, opacity: 0.22 }]}>☠️</Text>
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
            backgroundColor: 'rgba(255,255,255,0.12)',
          }}
        />
      ))}
    </View>
  );
}

function Leaf({ height }: { height: number }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Text style={[s.bigEmoji, { right: -10, top: height * 0.05, fontSize: height * 0.8, opacity: 0.25 }]}>🍥</Text>
    </View>
  );
}

function DragonBallDecor({ height }: { height: number }) {
  const size = height * 0.8;
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#ffe0a3', '#ffb300', '#ef6c00']}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 0.9, y: 1 }}
        style={{
          position: 'absolute',
          right: 18,
          top: (height - size) / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.9,
        }}
      >
        <Text style={{ color: '#d32f2f', fontSize: size * 0.22, letterSpacing: -2 }}>★★{'\n'}★★</Text>
      </LinearGradient>
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
          opacity: 0.9,
          borderWidth: band / 2,
          borderColor: '#111',
        }}
      >
        <View style={{ flex: 1, backgroundColor: '#e53935' }} />
        <View style={{ height: band, backgroundColor: '#111' }} />
        <View style={{ flex: 1, backgroundColor: '#fafafa' }} />
        <View
          style={{
            position: 'absolute',
            left: size / 2 - size * 0.17,
            top: size / 2 - size * 0.17,
            width: size * 0.34,
            height: size * 0.34,
            borderRadius: size,
            backgroundColor: '#fafafa',
            borderWidth: band,
            borderColor: '#111',
          }}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  banner: { borderRadius: 18, overflow: 'hidden', justifyContent: 'center' },
  content: { paddingHorizontal: 22 },
  hidden: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  bigEmoji: { position: 'absolute' },
});
