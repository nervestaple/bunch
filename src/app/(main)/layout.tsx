import type { PropsWithChildren } from 'react';

import { ThreeLayout } from '~/components/ThreeLayout';

export default function Layout({ children }: PropsWithChildren) {
  return <ThreeLayout>{children}</ThreeLayout>;
}
