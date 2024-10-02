/**
 * @public
 */
export interface SvCardSlotProps {
  /** Card is disabled. */
  disabled: boolean;

  /** Card is dragged. */
  dragged: boolean;

  /** Card is dragged. */
  dragged: boolean;

  /** Card is interactive. */
  interactive: boolean;

  /** Card should display ripple on interactions. */
  ripple: boolean;

  /** Card was last pressed with a pointing device (not keyboard or programmatically). */
  pointerPressed: boolean;
}

/**
 * @public
 */
export interface SvCardSlots {
  /**
   * Default slot that holds the card content.
   * It is implemented as a `grid` with 2 template columns:
   * - `full-width` (full card width)
   * - `padded` (padded area of the card)
   */
  default: (props: SvCardSlotProps) => unknown;

  /** Slot for content that should show at the lowest level, below state (background). */
  'layer-bottom': (props: SvCardSlotProps) => unknown;
  /**
   * Slot for state. You can replace the default stack which is:
   * - SvLayerContainer
   * - SvLayerElevation
   * - SvLayerOutline
   * - SvLayerFocusIndicator
   * - SvLayerState
   * - SvRipple
   */
  'layer-state': (props: SvCardSlotProps) => unknown;
}
