import { afterEach, describe, expect, it, vi } from 'vitest';

import { sleep } from '$lib/test_utils/sleep';
import { throttle } from '$lib/utils/throttle';

describe('utils [browser]', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('is', () => {
    it('isClient should be true on client side', async () => {
      expect.soft(await import('$lib/utils/is').then(({ isClient }) => isClient)).toEqual(true);
    });
  });

  describe('throttle', () => {
    const spy = vi.fn((_: number) => {});

    it('should call on leading', async () => {
      const t = throttle(spy, { leading: true, trailing: false });

      t(1);
      t(2);
      t(3);
      await sleep(30);

      expect.soft(spy).toHaveBeenCalledTimes(1);
      expect.soft(spy.mock.calls).toEqual([ [ 1 ] ]);
    });

    it('should call on trailing', async () => {
      const t = throttle(spy, { leading: false, trailing: true });

      t(1);
      t(2);
      t(3);
      await sleep(30);

      expect.soft(spy).toHaveBeenCalledTimes(1);
      expect.soft(spy.mock.calls).toEqual([ [ 3 ] ]);
    });

    it('should call on leading and trailing', async () => {
      const t = throttle(spy, { leading: true, trailing: true });

      t(1);
      t(2);
      t(3);
      await sleep(30);

      expect.soft(spy).toHaveBeenCalledTimes(2);
      expect.soft(spy.mock.calls).toEqual([ [ 1 ], [ 3 ] ]);
    });
  });
});
