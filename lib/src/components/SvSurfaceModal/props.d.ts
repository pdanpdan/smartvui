import type {
  SvSurfaceAnimationPropType,
  SvSurfaceBackdropPropType,
  SvSurfaceEscapePropType,
  SvSurfaceTypeModal,
} from '$lib/components/SvSurfaceModal/svSurface';

/**
 * @public
 */
export interface SvSurfaceModalProps {
  /** Render surface on SSR. */
  ssr?: boolean;

  /** Use `absolute` or `fixed` position for the surface (default is to use `fixed` position). */
  absolute?: boolean;

  /** Allow surface to fill the screen. */
  maximized?: boolean;

  /** `Escape` key behavior. Use `true` to close surface when `Escape` key is pressed. Use a function to custom process `Escape` key. */
  escapeClose?: SvSurfaceEscapePropType;

  /** Backdrop click behavior. Use `true` to close surface when backdrop is clicked. Use a function to custom process backdrop click. */
  backdropClose?: SvSurfaceBackdropPropType<SvSurfaceTypeModal>;

  /** Surface animation end custom detector. */
  animationWait?: SvSurfaceAnimationPropType<SvSurfaceTypeModal>;
}
