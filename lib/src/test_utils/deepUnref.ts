import type { MaybeRef } from 'vue';

import { unref } from 'vue';

type DeepUnref<T> = {
  [ K in keyof T ]: T[ K ] extends MaybeRef<infer V> ? V : T[ K ];
};

export function deepUnref<T extends object>(o: T) {
  return Object.fromEntries(
    Object.keys(o)
      .map((k) => [ k, unref(o[ k as keyof T ]) ]),
  ) as DeepUnref<T>;
}
