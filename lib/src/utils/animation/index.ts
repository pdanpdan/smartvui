import { nextTick } from 'vue';

import { noop } from '$lib/utils/noop';

/**
 * Function that receives a promise that is resolved when all animations are finished
 * and returns another promise that will allow waitForAnimations to return when it is resolved.
 *
 * @public
 */
export type AnimationsDonePromise = (animationsPromise: Promise<(void | Animation)[]>) => Promise<unknown>;

/**
 * waitForAnimations options
 *
 * @public
 * @typeParam options - waitForAnimations options
 */
export interface WaitForAnimationsOptions {
  /** Signal that can be used to abort the waiting and reject the promise. */
  signal?: AbortSignal;
  /** Function that can be used to resolve or reject the promise. */
  animationsDone?: AnimationsDonePromise;
}

/**
 * Returns a promise that is resolved when animations are finished.
 * Will check animations on the element and its direct children.
 *
 * @public
 * @param element - the DOM element to check for animation end.
 * @returns a promise that is resolved when animations are finished.
 */
export function waitForAnimations(element?: Element | null, {
  signal,
  animationsDone = (p) => p,
}: WaitForAnimationsOptions = {}) {
  if (signal?.aborted) {
    return Promise.reject(signal.reason);
  }

  return new Promise((resolve, reject) => {
    let onCleanup = noop;
    if (signal) {
      const onAbort = () => {
        onCleanup();
        reject(signal.reason);
      };
      onCleanup = () => {
        signal.removeEventListener('abort', onAbort);
      };
      signal.addEventListener('abort', onAbort);
    }

    nextTick()
      .then(() => animationsDone(Promise.all(element
        ? [ element, ...element.children ]
          .map((el) => el.getAnimations().map((animation) => animation.finished.catch(() => {})))
          .flat()
        : [],
      )))
      .then((val) => {
        onCleanup();
        resolve(val);
      })
      .catch((val) => {
        onCleanup();
        reject(val);
      });
  });
}
