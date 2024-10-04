/**
 * @public
 */
export interface SvCardMediaProps {
  /**
   * Position in card.
   * - start: at card start (according to card `layout` direction) - will use card border radius
   * - end: at card end (according to card `layout` direction) - will use card border radius
   * - cover: fill the card - will use card border radius
   *
   * @defaultValue 'start'
   */
  position?: 'start' | 'end' | 'cover';
}
