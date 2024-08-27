import { useGLTF } from '@react-three/drei';
import type { PrimitiveProps } from '@react-three/fiber';

interface Props {
  src: string;
}

export function InnerAsset({
  src,
  ...props
}: Props & Omit<PrimitiveProps, 'object'>) {
  const asset = useGLTF(src);
  return <primitive {...props} object={asset.scene} />;
}
