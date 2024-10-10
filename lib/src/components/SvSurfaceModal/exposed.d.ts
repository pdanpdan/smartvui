import type { ModelRef, Ref } from 'vue';

import type { SvSurfaceEl, SvSurfaceTypeModal } from '$lib/components/SvSurfaceModal/svSurface';

/**
 * @public
 */
export interface SvSurfaceModalExposed {
  /** Vue ref for the surface component. */
  surfaceRef: Ref<SvSurfaceEl<SvSurfaceTypeModal>>;

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
