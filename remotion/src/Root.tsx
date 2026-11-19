import React from 'react';
import {Composition, AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

const Test: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 9}});
  const count = Math.round(interpolate(frame, [15, 75], [0, 1500], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const wave = (y: number, a: number, s: number, c: string) => {
    let d = `M0 1920 L0 ${y}`;
    for (let x = 0; x <= 1080; x += 20) d += ` L${x} ${y + Math.sin(x / 90 + frame * s) * a}`;
    return <path d={d + ' L1080 1920 Z'} fill={c} stroke="#14142b" strokeWidth={6} />;
  };
  return (
    <AbsoluteFill style={{background: 'linear-gradient(#0b1033, #3a4f9a)', fontFamily: 'Inter, sans-serif'}}>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        {wave(1150, 14, 0.08, '#3567b8')}{wave(1300, 22, 0.11, '#1e4a92')}
      </svg>
      <div style={{position: 'absolute', top: 520, width: '100%', textAlign: 'center', transform: `scale(${pop})`,
        fontSize: 200, fontWeight: 900, color: '#ff4d5a', WebkitTextStroke: '10px #14142b', paintOrder: 'stroke'}}>
        +{count.toLocaleString('fr-FR')}
      </div>
      <div style={{position: 'absolute', top: 760, width: '100%', textAlign: 'center', opacity: interpolate(frame, [40, 55], [0, 1]),
        fontSize: 110, fontWeight: 900, color: '#fff', WebkitTextStroke: '8px #14142b', paintOrder: 'stroke'}}>MORTS</div>
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition id="Test" component={Test} durationInFrames={90} fps={30} width={1080} height={1920} />
);
