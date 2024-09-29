import type {
  SvSurfaceAnimationType,
  SvSurfaceToggleFnType,
} from '$lib/components/svSurface';

/**
 * @public
 */
export interface SvSurfacePopoverSlotProps {
  /** Stable `id` for the instance. */
  id: string;
  /** Show the surface. */
  show: SvSurfaceToggleFnType;
  /** Hide the surface. */
  hide: SvSurfaceToggleFnType;
  /** Toggle the surface visibility. */
  toggle: SvSurfaceToggleFnType;
  /** Surface is visible (open) */
  isOpen: boolean;
  /** Surface can fill the whole screen. */
  isMaximized: boolean;
  /** Surface is `fixed` or `absolute` positioned. */
  isFixed: boolean;
  /** Surface is animating (`show` or `hide`) or not. */
  isAnimating: SvSurfaceAnimationType;
}

/**
 * @public
 */
export interface SvSurfacePopoverSlots {
  /** Default slot that holds the surface content. */
  default: (props: SvSurfacePopoverSlotProps) => unknown;
  /** Slot for activator controls for the surface. */
  activator: (props: SvSurfacePopoverSlotProps) => unknown;
}
