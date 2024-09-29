import type { VNode } from 'vue';

export type { ComponentExposed, ComponentProps, ComponentSlots } from 'vue-component-type-helpers';

/**
 * A type or promise of that type.
 *
 * @public
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Any type of function.
 *
 * @public
 */
export type AnyFn = (...args: unknown[]) => unknown;

/**
 * Vue VNode children.
 *
 * @public
 */
export type VNodeChildren = string | number | boolean | VNode | VNodeChildren[];
