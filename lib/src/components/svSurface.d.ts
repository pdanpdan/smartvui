import type { Ref } from 'vue';

import type { AnimationsDonePromise } from '$lib/utils/animation';

/**
 * @public
 */
export type SvSurfaceTypeModal = 'modal';
/**
 * @public
 */
export type SvSurfaceTypePopover = 'popover';
/**
 * Vue ref for the surface component.
 *
 * @public
 */
export type SvSurfaceEl<S extends SvSurfaceTypeModal | SvSurfaceTypePopover> = (S extends SvSurfaceTypeModal ? HTMLDialogElement : HTMLDivElement) | null;
/**
 * Toggle surface component visibility.
 *
 * @public
 */
export type SvSurfaceToggleFnType = () => void;
/**
 * Event that triggered surface show.
 *
 * @public
 */
export type SvSurfaceShowTriggerType = 'model' | 'slot';
/**
 * Event that triggered surface hide.
 *
 * @public
 */
export type SvSurfaceHideTriggerType<S extends SvSurfaceTypeModal | SvSurfaceTypePopover> = 'esc' | 'model' | 'slot' | 'close' | (S extends SvSurfaceTypeModal ? 'backdrop' : never);
/**
 * If surface is animating specify animation type (`show` or `hide`).
 *
 * @public
 */
export type SvSurfaceAnimationType = 'show' | 'hide' | false;
/**
 * Type of event emitted by the surface.
 *
 * @public
 */
export type SvSurfaceEventNameType = 'show-start' | 'show-end' | 'show-cancel' | 'hide-start' | 'hide-end' | 'hide-cancel';
/**
 * Event payload.
 *
 * @public
 */
export type SvSurfaceEventPayloadType<S extends SvSurfaceTypeModal | SvSurfaceTypePopover, T extends SvSurfaceEventNameType> = {
  /** Type of event emitted by the surface. */
  type: T;
  /** Vue ref for the surface component. */
  target: Ref<SvSurfaceEl<S>>;
  /** Event that triggered a surface show or hide. */
  trigger: T extends `show-${ string }` ? SvSurfaceShowTriggerType : SvSurfaceHideTriggerType<S>;
  /** The surface can fill the screen. */
  maximized: boolean;
} & (
  T extends `${ string }-cancel`
    ? { error: Error; }
    : object
) & (
  S extends SvSurfaceTypeModal
    ? {
      /** The surface uses `absolute` position (`fixed` by default). */
      absolute: boolean;
    }
    : {
      /** The surface uses `fixed` position (`absolute` by default). */
      fixed: boolean;
    }
);
/**
 * `Escape` key behavior. Use `true` to close surface when `Escape` key is pressed. Use a function to custom process `Escape` key.
 *
 * @public
 */
export type SvSurfaceEscapePropType = boolean | ((
  /** Keyboard `keydown` capture phase event. */
  evt: KeyboardEvent,
  /** Function that closes the surface. */
  close: () => void,
) => void);
/**
 * Backdrop click behavior. Use `true` to close surface when backdrop is clicked. Use a function to custom process backdrop click.
 *
 * @public
 */
export type SvSurfaceBackdropPropType<S extends SvSurfaceTypeModal | SvSurfaceTypePopover> = boolean | (
  S extends SvSurfaceTypeModal
    ? ((
      /** Mouse or pointer `click` event. */
      evt: MouseEvent | PointerEvent,
      /** Function that closes the surface. */
      close: () => void,
    ) => void)
    : never
);
/**
 * Surface animation end custom detector.
 *
 * @public
 */
export type SvSurfaceAnimationPropType<S extends SvSurfaceTypeModal | SvSurfaceTypePopover> = (
  /** Surface `{show, hide}-start` event. */
  evt: SvSurfaceEventPayloadType<S, 'show-start'> | SvSurfaceEventPayloadType<S, 'hide-start'>
) => AnimationsDonePromise;
