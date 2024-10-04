/**
 * @public
 */
export interface SvCardActionsProps {
  /**
   * Position in card.
   * - start: at card content start (according to card `layout` direction)
   * - end: at card content end (according to card `layout` direction)
   *
   * @defaultValue 'end'
   */
  position?: 'start' | 'end';

  /** Force horizontal position when card uses `vertical` layout. */
  horizontal?: boolean;

  /** Content align. */
  align?: 'start' | 'end' | 'center' | string;
}
