import type { PropsWithChildren } from 'react';

import { MainCoolLayout } from '~/components/MainCoolLayout';

export default function Layout({ children }: PropsWithChildren) {
  return <MainCoolLayout>{children}</MainCoolLayout>;
}
