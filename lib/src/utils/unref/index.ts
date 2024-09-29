import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue';

import { toValue } from 'vue';

/**
 * DOM element or Vue component instance or nothing.
 *
 * @public
 */
export type MaybeElement = Element | ComponentPublicInstance | null | undefined;

/**
 * A DOM element or Vue component instance or nothing
 * or a ref or getter of the same.
 *
 * @public
 */
export type MaybeElementRefOrGetter<T extends MaybeElement = MaybeElement> = MaybeRefOrGetter<T>;

/**
 * A DOM element or the element associated with a Vue component instance or nothing.
 *
 * @public
 */
export type ToElementValueReturn<T extends MaybeElement = MaybeElement> = T extends ComponentPublicInstance ? Exclude<MaybeElement, ComponentPublicInstance> : T | null;

/**
 * Get the DOM element of a ref of element or Vue component instance.
 *
 * @public
 * @return A DOM element or null.
 */
export function toElementValue<T extends MaybeElement>(elRef: MaybeElementRefOrGetter<T>): ToElementValueReturn<T> {
  const plain = toValue(elRef);
  return (
    plain != null && typeof plain === 'object' && '$el' in plain
      ? (plain as ComponentPublicInstance).$el
      : plain
  ) ?? null;
}
