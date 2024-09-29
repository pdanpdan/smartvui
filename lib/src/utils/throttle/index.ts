/**
 * Throttle function options.
 *
 * @public
 * @typeParam options - Throttle function options.
 */
export interface ThrottleOptions {
  /** Call original function on first call to the throttled one. */
  leading?: boolean;
  /** Call original function on end of the throttle interval. */
  trailing?: boolean;
  /** Throttle interval duration (ms). */
  delay?: number | null;
}

/**
 * Throttle calls to a function.
 *
 * @public
 * @param fn - Function whose calls should be throttled.
 * @return The throttled function.
 */
export function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  {
    leading = true,
    trailing = true,
    delay = null,
  }: ThrottleOptions = {},
) {
  let isWait = false;
  let callArgs: A | null = null;
  if (delay == null && !('requestAnimationFrame' in globalThis)) {
    delay = 20;
  }
  const throttleFn = delay == null
    ? (f: () => void) => requestAnimationFrame(f)
    : (f: () => void) => setTimeout(f, delay);

  return function (this: unknown, ...args: A) {
    if (!isWait) {
      isWait = true;

      if (leading) {
        callArgs = null;
        fn.call(this, ...args);
      } else {
        callArgs = args;
      }

      throttleFn(() => {
        isWait = false;

        if (callArgs !== null) {
          if (trailing) {
            fn.call(this, ...callArgs);
          }
          callArgs = null;
        }
      });
    } else {
      callArgs = args;
    }
  };
}
