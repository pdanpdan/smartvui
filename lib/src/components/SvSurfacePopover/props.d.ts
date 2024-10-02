import type {
  SvSurfaceAnimationPropType,
  SvSurfaceBackdropPropType,
  SvSurfaceEscapePropType,
  SvSurfaceTypePopover,
} from '$lib/components/svSurface';

/**
 * @public
 */
export interface SvSurfacePopoverProps {
  /** Render surface on SSR. */
  ssr?: boolean;

  /** Use `fixed` or `absolute` position for the surface (default is to use `absolute` position). */
  fixed?: boolean;

  /** Allow surface to fill the screen. */
  maximized?: boolean;

  /** `Escape` key behavior. Use `true` to close surface when `Escape` key is pressed. Use a function to custom process `Escape` key. */
  escapeClose?: SvSurfaceEscapePropType;

  /** Backdrop click behavior. Use `true` to close surface when backdrop is clicked. Use a function to custom process backdrop click. */
  backdropClose?: SvSurfaceBackdropPropType<SvSurfaceTypePopover>;

  /** Surface animation end custom detector. */
  animationWait?: SvSurfaceAnimationPropType<SvSurfaceTypePopover>;
}
