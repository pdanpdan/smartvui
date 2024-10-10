import type {
  SvSurfaceEventPayloadType,
  SvSurfaceTypePopover,
} from '$lib/components/SvSurfaceModal/svSurface';

/**
 * @public
 */
export interface SvSurfacePopoverEmits {
  /** Event emitted by the surface when it starts showing (before animation). */
  (e: 'showStart', evt: SvSurfaceEventPayloadType<SvSurfaceTypePopover, 'show-start'>): void;
  /** Event emitted by the surface when it finishes showing (after animation). */
  (e: 'showEnd', evt: SvSurfaceEventPayloadType<SvSurfaceTypePopover, 'show-end'>): void;
  /** Event emitted by the surface when showing is cancelled (during animation). */
  (e: 'showCancel', evt: SvSurfaceEventPayloadType<SvSurfaceTypePopover, 'show-cancel'>): void;

  /** Event emitted by the surface when it starts hiding (before animation). */
  (e: 'hideStart', evt: SvSurfaceEventPayloadType<SvSurfaceTypePopover, 'hide-start'>): void;
  /** Event emitted by the surface when it finishes hiding (after animation). */
  (e: 'hideEnd', evt: SvSurfaceEventPayloadType<SvSurfaceTypePopover, 'hide-end'>): void;
  /** Event emitted by the surface when hiding is cancelled (during animation). */
  (e: 'hideCancel', evt: SvSurfaceEventPayloadType<SvSurfaceTypePopover, 'hide-cancel'>): void;
}
