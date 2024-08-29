import { type RefObject } from 'react';

import { useGLTF } from '@react-three/drei';
import type { PrimitiveProps, ThreeElements } from '@react-three/fiber';

interface Props {
  src: string;
  assetRef?: RefObject<ThreeElements['primitive']>;
}

export function InnerAsset({
  src,
  assetRef,
  ...props
}: Props & Omit<PrimitiveProps, 'object' | 'assetRef'>) {
  const asset = useGLTF(src);
  return <primitive {...props} object={asset.scene} ref={assetRef} />;
}
