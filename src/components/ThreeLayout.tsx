'use client';

import type { PropsWithChildren } from 'react';

import { Environment, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import jm from '~/assets/jm.glb';

import { Effects } from './Effects';

useGLTF.preload(jm);

export function ThreeLayout({ children }: PropsWithChildren) {
  return (
    <Canvas
      flat={true}
      gl={{ antialias: false }}
      dpr={[1, 1.5]}
      camera={{
        position: [0, 0, 10],
        fov: 20,
        near: 0.01,
        far: 150,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '100lvh',
        zIndex: 0,
      }}
    >
      <color attach="background" args={['white']} />

      <spotLight
        position={[10, 20, 10]}
        penumbra={1}
        decay={0}
        intensity={3}
        color="orange"
      />

      <Environment preset="sunset" />
      {children}
      <Effects />
    </Canvas>
  );
}
