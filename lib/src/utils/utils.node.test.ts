// @vitest-environment node

import type { ComponentPublicInstance } from 'vue';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';

import { sleep } from '$lib/test_utils/sleep';
import { waitForAnimations } from '$lib/utils/animation';
import { toCamelCase, toKebabCase, toPascalCase } from '$lib/utils/caseConvert';
import { throttle } from '$lib/utils/throttle';
import { toElementValue } from '$lib/utils/unref';

describe('utils [node]', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('animation', () => {
    it('should reject on initial aborted signal', async () => {
      vi.useFakeTimers();
      const resolveSpy = vi.fn();
      const rejectSpy = vi.fn();

      const abortController = new AbortController();
      const signal = abortController.signal;
      abortController.abort();

      waitForAnimations(null, { signal }).then(resolveSpy, rejectSpy);
      await vi.advanceTimersByTimeAsync(0);
      expect.soft(resolveSpy).toHaveBeenCalledTimes(0);
      expect.soft(rejectSpy).toHaveBeenCalledTimes(1);
    });

    it('should resolve with no element', async () => {
      vi.useFakeTimers();
      const resolveSpy = vi.fn();
      const rejectSpy = vi.fn();

      waitForAnimations(null).then(resolveSpy, rejectSpy);
      await vi.advanceTimersByTimeAsync(0);
      expect.soft(resolveSpy).toHaveBeenCalledTimes(1);
      expect.soft(rejectSpy).toHaveBeenCalledTimes(0);
    });

    it('should resolve with element without animations', async () => {
      vi.useFakeTimers();
      const resolveSpy = vi.fn();
      const rejectSpy = vi.fn();

      const element = { getAnimations: () => ([]), children: [] } as unknown as Element;

      waitForAnimations(element).then(resolveSpy, rejectSpy);
      await vi.advanceTimersByTimeAsync(0);
      expect.soft(resolveSpy).toHaveBeenCalledTimes(1);
      expect.soft(rejectSpy).toHaveBeenCalledTimes(0);
    });

    it('should resolve when animations are finished', async () => {
      vi.useFakeTimers();
      const resolveSpy = vi.fn();
      const rejectSpy = vi.fn();

      let resolvePromise: (value: unknown) => void;
      const promise1 = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      const element1 = { getAnimations: () => ([ { finished: promise1 } ]), children: [] } as unknown as Element;

      waitForAnimations(element1).then(resolveSpy, rejectSpy);
      await vi.advanceTimersByTimeAsync(0);
      expect.soft(resolveSpy).toHaveBeenCalledTimes(0);
      expect.soft(rejectSpy).toHaveBeenCalledTimes(0);

      resolvePromise!(true);
      await vi.advanceTimersByTimeAsync(0);
      expect.soft(resolveSpy).toHaveBeenCalledTimes(1);
      expect.soft(rejectSpy).toHaveBeenCalledTimes(0);

      vi.clearAllMocks();
      let rejectPromise: (value: unknown) => void;
      const promise2 = new Promise((reject) => {
        rejectPromise = reject;
      });
      const element2 = { getAnimations: () => ([ { finished: promise2 } ]), children: [] } as unknown as Element;

      waitForAnimations(element2).then(resolveSpy, rejectSpy);
      await vi.advanceTimersByTimeAsync(0);
      expect.soft(resolveSpy).toHaveBeenCalledTimes(0);
      expect.soft(rejectSpy).toHaveBeenCalledTimes(0);

      rejectPromise!(false);
      await vi.advanceTimersByTimeAsync(0);
      expect.soft(resolveSpy).toHaveBeenCalledTimes(1);
      expect.soft(rejectSpy).toHaveBeenCalledTimes(0);
    });

    it('should reject when animationsDone fails', async () => {
      vi.useFakeTimers();
      const resolveSpy = vi.fn();
      const rejectSpy = vi.fn();

      const promise = new Promise(() => {});
      const element = { getAnimations: () => ([ { finished: promise } ]), children: [] } as unknown as Element;

      waitForAnimations(element, {
        animationsDone() {
          return new Promise((_, reject) => {
            setTimeout(() => {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject('Animations failed');
            }, 1);
          });
        },
      }).then(resolveSpy, rejectSpy);
      await vi.advanceTimersByTimeAsync(0);
      expect.soft(resolveSpy).toHaveBeenCalledTimes(0);
      expect.soft(rejectSpy).toHaveBeenCalledTimes(0);

      await vi.advanceTimersByTimeAsync(1);
      expect.soft(resolveSpy).toHaveBeenCalledTimes(0);
      expect.soft(rejectSpy).toHaveBeenCalledTimes(1);
      expect.soft(rejectSpy).toHaveBeenLastCalledWith('Animations failed');
    });

    it('should reject when signal is aborted', async () => {
      vi.useFakeTimers();
      const resolveSpy = vi.fn();
      const rejectSpy = vi.fn();

      const abortController = new AbortController();
      const signal = abortController.signal;

      let resolvePromise: (value: unknown) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      const element = { getAnimations: () => ([ { finished: promise } ]), children: [] } as unknown as Element;

      waitForAnimations(element, { signal }).then(resolveSpy, rejectSpy);
      await vi.advanceTimersByTimeAsync(0);
      expect.soft(resolveSpy).toHaveBeenCalledTimes(0);
      expect.soft(rejectSpy).toHaveBeenCalledTimes(0);

      abortController.abort();
      await vi.advanceTimersByTimeAsync(0);
      expect.soft(resolveSpy).toHaveBeenCalledTimes(0);
      expect.soft(rejectSpy).toHaveBeenCalledTimes(1);

      resolvePromise!(true);
      await vi.advanceTimersByTimeAsync(0);
      expect.soft(resolveSpy).toHaveBeenCalledTimes(0);
      expect.soft(rejectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('caseConvert', () => {
    const strPascalCase = [ 'PascalCase', 'CustomXMLParser', 'APIFinder', 'JSONResponseData', 'Person20Address', 'UserAPI20Endpoint' ];
    const strCamelCase = strPascalCase.map((s) => `${ s[ 0 ].toLowerCase() }${ s.slice(1) }`);
    const strKebabCase = [ 'pascal-case', 'custom-x-m-l-parser', 'a-p-i-finder', 'j-s-o-n-response-data', 'person20-address', 'user-a-p-i20-endpoint' ];

    it('should convert PascalCase to kebab-case', () => {
      expect.soft(strPascalCase.map(toKebabCase)).toEqual(strKebabCase);
    });

    it('should keep kebab-case', () => {
      expect.soft(strKebabCase.map(toKebabCase)).toEqual(strKebabCase);
    });

    it('should convert kebab-case to camelCase', () => {
      expect.soft(strKebabCase.map(toCamelCase)).toEqual(strCamelCase);
    });

    it('should keep camelCase', () => {
      expect.soft(strCamelCase.map(toCamelCase)).toEqual(strCamelCase);
    });

    it('should convert kebab-case to PascalCase', () => {
      expect.soft(strKebabCase.map(toPascalCase)).toEqual(strPascalCase);
    });

    it('should keep PascalCase', () => {
      expect.soft(strPascalCase.map(toPascalCase)).toEqual(strPascalCase);
    });
  });

  describe('throttle', () => {
    const spy = vi.fn((_: number) => {});

    it('should call on leading', async () => {
      const t = throttle(spy, { leading: true, trailing: false, delay: 20 });

      t(1);
      t(2);
      t(3);
      await sleep(30);

      expect.soft(spy).toHaveBeenCalledTimes(1);
      expect.soft(spy.mock.calls).toEqual([ [ 1 ] ]);
    });

    it('should call on trailing', async () => {
      const t = throttle(spy, { leading: false, trailing: true, delay: 20 });

      t(1);
      t(2);
      t(3);
      await sleep(30);

      expect.soft(spy).toHaveBeenCalledTimes(1);
      expect.soft(spy.mock.calls).toEqual([ [ 3 ] ]);
    });

    it('should call on leading and trailing', async () => {
      const t = throttle(spy, { leading: true, trailing: true, delay: 20 });

      t(1);
      t(2);
      t(3);
      await sleep(30);

      expect.soft(spy).toHaveBeenCalledTimes(2);
      expect.soft(spy.mock.calls).toEqual([ [ 1 ], [ 3 ] ]);
    });
  });

  describe('unref', () => {
    const el = Symbol('el') as unknown as HTMLElement;
    const elNull = null as HTMLElement | null;
    const elUndefined = undefined as HTMLElement | undefined;
    const comp = { $el: el } as unknown as ComponentPublicInstance;
    const compNull = { $el: elNull } as unknown as ComponentPublicInstance;
    const compUndefined = { $el: elUndefined } as unknown as ComponentPublicInstance;

    it('should extract element from raw element', () => {
      expect.soft(toElementValue(el)).toBe(el);
    });

    it('should extract element from raw component', () => {
      expect.soft(toElementValue(comp)).toBe(el);
    });

    it('should extract element from ref element', () => {
      expect.soft(toElementValue(ref(el))).toBe(el);
    });

    it('should extract element from ref component', () => {
      expect.soft(toElementValue(ref(comp))).toBe(el);
    });

    it('should extract element from computed element', () => {
      expect.soft(toElementValue(computed(() => el))).toBe(el);
    });

    it('should extract element from computed component', () => {
      expect.soft(toElementValue(computed(() => comp))).toBe(el);
    });

    it('should extract element from getter of element', () => {
      expect.soft(toElementValue(() => el)).toBe(el);
    });

    it('should extract element from getter of component', () => {
      expect.soft(toElementValue(() => comp)).toBe(el);
    });

    it('should extract null from raw element', () => {
      expect.soft(toElementValue(elNull)).toBe(null);
      expect.soft(toElementValue(elUndefined)).toBe(null);
    });

    it('should extract null from raw component', () => {
      expect.soft(toElementValue(compNull)).toBe(null);
      expect.soft(toElementValue(compUndefined)).toBe(null);
    });

    it('should extract null from ref element', () => {
      expect.soft(toElementValue(ref(elNull))).toBe(null);
      expect.soft(toElementValue(ref(elUndefined))).toBe(null);
    });

    it('should extract null from ref component', () => {
      expect.soft(toElementValue(ref(compNull))).toBe(null);
      expect.soft(toElementValue(ref(compUndefined))).toBe(null);
    });

    it('should extract null from computed element', () => {
      expect.soft(toElementValue(computed(() => elNull))).toBe(null);
      expect.soft(toElementValue(computed(() => elUndefined))).toBe(null);
    });

    it('should extract null from computed component', () => {
      expect.soft(toElementValue(computed(() => compNull))).toBe(null);
      expect.soft(toElementValue(computed(() => compUndefined))).toBe(null);
    });

    it('should extract null from getter of element', () => {
      expect.soft(toElementValue(() => elNull)).toBe(null);
      expect.soft(toElementValue(() => elUndefined)).toBe(null);
    });

    it('should extract null from getter of component', () => {
      expect.soft(toElementValue(() => compNull)).toBe(null);
      expect.soft(toElementValue(() => compUndefined)).toBe(null);
    });
  });
});
