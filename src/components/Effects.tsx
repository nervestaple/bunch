import { useRef } from 'react';

import { useSpring } from '@react-spring/three';
import { useFrame } from '@react-three/fiber';
import {
  DepthOfField,
  EffectComposer,
  Vignette,
} from '@react-three/postprocessing';
import { usePathname } from 'next/navigation';
import { BlendFunction, type DepthOfFieldEffect } from 'postprocessing';

export function Effects() {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  const { targetZ } = useSpring({
    ...(isLogin
      ? {
          targetZ: 0,
        }
      : {
          targetZ: 60,
        }),
    config: { tension: 20, friction: 60 },
  });

  const { focalLength, bokehScale } = useSpring({
    ...(isLogin
      ? {
          focalLength: 0,
          bokehScale: 25,
        }
      : {
          focalLength: 0.35,
          bokehScale: 14,
        }),
    config: { tension: 30, friction: 30 },
  });

  const dof = useRef<DepthOfFieldEffect>(null);
  useFrame(() => {
    const d = dof.current;
    if (!d) {
      return;
    }

    d.target.setZ(targetZ.get());
    d.cocMaterial.focalLength = focalLength.get();
    d.bokehScale = bokehScale.get();
  });

  /* Multisampling (MSAA) is WebGL2 antialeasing, we don't need it (faster)
        The normal-pass is not required either, saves a bit of performance */
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <DepthOfField
        ref={dof}
        target={[0, 0, 0]}
        focalLength={0}
        bokehScale={25}
        height={700}
      />

      <Vignette
        offset={0.5} // vignette offset
        darkness={0.3} // vignette darkness
        eskil={false} // Eskil's vignette technique
        blendFunction={BlendFunction.NORMAL} // blend mode
      />
    </EffectComposer>
  );
}
