'use client';

import { useRef } from 'react';

import { ThreeElements, useFrame } from '@react-three/fiber';

import jm from '~/assets/jm.glb';
import { Asset } from '~/components/Asset';

export default function Page() {
  const ref = useRef<ThreeElements['primitive']>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });
  return <Asset src={jm} assetRef={ref} />;
}
