import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, Line, LinearGradient, Rect, Stop, Circle, ClipPath, G } from 'react-native-svg';

/**
 * Fondo de la app al estilo arcade retro (synthwave): cielo morado con estrellas pixeladas,
 * un sol de neón en el horizonte y una cuadrícula en perspectiva.
 */
export default function ArcadeBackground() {
  const { width, height } = useWindowDimensions();
  const horizon = height * 0.76;
  const sunR = Math.min(width * 0.3, 140);

  // Estrellas cuadradas (pixel art) con posiciones fijas
  let seed = 11;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const stars = Array.from({ length: 90 }, () => ({
    x: Math.floor(rnd() * width),
    y: Math.floor(rnd() * horizon * 0.95),
    s: rnd() < 0.8 ? 2 : 4,
    c: rnd() < 0.15 ? '#5ef6ff' : rnd() < 0.15 ? '#ff6ad5' : '#ffffff',
    o: 0.35 + rnd() * 0.6,
  }));

  // Cuadrícula: líneas horizontales cada vez más separadas y verticales que convergen
  const hLines = Array.from({ length: 14 }, (_, i) => horizon + Math.pow(i / 13, 2.2) * (height - horizon));
  const vLines = Array.from({ length: 21 }, (_, i) => (i - 10) / 10);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0b0221" />
            <Stop offset="0.55" stopColor="#1f0841" />
            <Stop offset="1" stopColor="#3b0b59" />
          </LinearGradient>
          <LinearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#1a0433" />
            <Stop offset="1" stopColor="#07010f" />
          </LinearGradient>
          <LinearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ffd319" />
            <Stop offset="0.5" stopColor="#ff8c42" />
            <Stop offset="1" stopColor="#ff2975" />
          </LinearGradient>
          <ClipPath id="sunClip">
            <Rect x={0} y={0} width={width} height={horizon} />
          </ClipPath>
        </Defs>

        <Rect x={0} y={0} width={width} height={horizon} fill="url(#sky)" />
        {stars.map((st, i) => (
          <Rect key={i} x={st.x} y={st.y} width={st.s} height={st.s} fill={st.c} opacity={st.o} />
        ))}

        {/* Sol de neón con franjas, cortado por el horizonte */}
        <G clipPath="url(#sunClip)" opacity={0.5}>
          <Circle cx={width / 2} cy={horizon - sunR * 0.35} r={sunR} fill="url(#sun)" />
          {Array.from({ length: 7 }, (_, i) => {
            const y = horizon - sunR * 0.35 + i * sunR * 0.13;
            return <Rect key={i} x={0} y={y} width={width} height={3 + i * 2} fill="#2a0848" />;
          })}
        </G>

        <Rect x={0} y={horizon} width={width} height={height - horizon} fill="url(#ground)" />
        {hLines.map((y, i) => (
          <Line key={'h' + i} x1={0} y1={y} x2={width} y2={y} stroke="#ff2bd6" strokeWidth={1 + i * 0.12} opacity={0.75} />
        ))}
        {vLines.map((t, i) => (
          <Line
            key={'v' + i}
            x1={width / 2 + t * width * 0.18}
            y1={horizon}
            x2={width / 2 + t * width * 2.2}
            y2={height}
            stroke="#ff2bd6"
            strokeWidth={1.2}
            opacity={0.65}
          />
        ))}
        <Line x1={0} y1={horizon} x2={width} y2={horizon} stroke="#5ef6ff" strokeWidth={2} opacity={0.9} />
      </Svg>
    </View>
  );
}
