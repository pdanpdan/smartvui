/**
 * @public
 */
export interface SvSwipeableSlotProps {
  /** Swipeable is disabled. */
  disabled: boolean;

  /** Region size. */
  size: number;

  /** Region that is swiped. */
  side: 'inline-start' | 'inline-end' | 'block-start' | 'block-end' | null;

  /** Region is swiped. */
  swiped: boolean;

  /** Region is swiping. */
  swiping: boolean;

  /** Reset the swiped area. */
  reset: () => void;
}

/**
 * @public
 */
export interface SvSwipeableSlots {
  /** Default slot that holds the main content. */
  default: (props: SvSwipeableSlotProps) => unknown;

  /** Slot for swipe content on inline-start side. */
  'inline-start': (props: SvSwipeableSlotProps) => unknown;

  /** Slot for swipe content on inline-end side. */
  'inline-end': (props: SvSwipeableSlotProps) => unknown;

  /** Slot for swipe content on block-start side. */
  'block-start': (props: SvSwipeableSlotProps) => unknown;

  /** Slot for swipe content on block-end side. */
  'block-end': (props: SvSwipeableSlotProps) => unknown;
}
