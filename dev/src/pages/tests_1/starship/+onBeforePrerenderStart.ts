// https://vike.dev/onBeforePrerenderStart

import type { OnBeforePrerenderStartAsync } from 'vike/types';

export const onBeforePrerenderStart: OnBeforePrerenderStartAsync = async (): ReturnType<OnBeforePrerenderStartAsync> => ([
  '/tests_1/starship',
  '/tests_1/starship/reviews',
  '/tests_1/starship/spec',
]);
