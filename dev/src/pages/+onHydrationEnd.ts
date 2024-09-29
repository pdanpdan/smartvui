import type { OnHydrationEndAsync } from 'vike/types';

export const onHydrationEnd: OnHydrationEndAsync = async () => {
  console.log('Hydration finished; page is now interactive.');
};
