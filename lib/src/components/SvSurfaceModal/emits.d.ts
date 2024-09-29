import type {
  SvSurfaceEventPayloadType,
  SvSurfaceTypeModal,
} from '$lib/components/svSurface';

/**
 * @public
 */
export interface SvSurfaceModalEmits {
  /** Event emitted by the surface when it starts showing (before animation). */
  (e: 'showStart', evt: SvSurfaceEventPayloadType<SvSurfaceTypeModal, 'show-start'>): void;
  /** Event emitted by the surface when it finishes showing (after animation). */
  (e: 'showEnd', evt: SvSurfaceEventPayloadType<SvSurfaceTypeModal, 'show-end'>): void;
  /** Event emitted by the surface when showing is cancelled (during animation). */
  (e: 'showCancel', evt: SvSurfaceEventPayloadType<SvSurfaceTypeModal, 'show-cancel'>): void;

  /** Event emitted by the surface when it starts hiding (before animation). */
  (e: 'hideStart', evt: SvSurfaceEventPayloadType<SvSurfaceTypeModal, 'hide-start'>): void;
  /** Event emitted by the surface when it finishes hiding (after animation). */
  (e: 'hideEnd', evt: SvSurfaceEventPayloadType<SvSurfaceTypeModal, 'hide-end'>): void;
  /** Event emitted by the surface when hiding is cancelled (during animation). */
  (e: 'hideCancel', evt: SvSurfaceEventPayloadType<SvSurfaceTypeModal, 'hide-cancel'>): void;
}
