import { type PropsWithChildren } from 'react';

import { ThreeBackground } from './ThreeBackground';

export function MainCoolLayout({ children }: PropsWithChildren) {
  return (
    <>
      <ThreeBackground />
      {children}
    </>
  );
}
