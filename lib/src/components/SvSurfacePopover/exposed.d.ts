import type { ModelRef, Ref } from 'vue';

import type { SvSurfaceEl, SvSurfaceTypePopover } from '$lib/components/SvSurfaceModal/svSurface';

/**
 * @public
 */
export interface SvSurfacePopoverExposed {
  /** Vue ref for the surface component. */
  surfaceRef: Ref<SvSurfaceEl<SvSurfaceTypePopover>>;

  /** Surface is visible (open) */
  isOpen: ModelRef<boolean, string, boolean, boolean>;

  /** Surface is animating (`show` or `hide`) or not. */
  isAnimating: Ref<'show' | 'hide' | false>;

  /** Show the surface. */
  show: () => void;

  /** Hide the surface. */
  hide: () => void;

  /** Toggle the surface visibility. */
  toggle: () => void;
}
