import dynamic from 'next/dynamic';

export const Asset = dynamic(
  () => import('./InnerAsset').then((module) => module.InnerAsset),
  { ssr: false }
);
