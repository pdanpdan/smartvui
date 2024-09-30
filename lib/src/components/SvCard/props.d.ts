/**
 * @public
 */
export interface SvCardProps {
  /**
   * Aspect: `elevated`, `filled` `outlined`.
   *
   * @defaultValue 'elevated'
   */
  aspect?: 'elevated' | 'filled' | 'outlined';
  /** Make card react to interactions. */
  interactive?: boolean;
  /**
   * Tabindex for the element. `null` will set `tabindex` to `0` only if `interactive`.
   *
   * @defaultValue null
   */
  tabindex?: number | string | null;
  /**
   * Use ripple effect when pressed. `null` will only use ripple when `interactive`.
   * You can also implement custom ripple using the `ripple` slot.
   *
   * @defaultValue null
   */
  ripple?: boolean | null;
  /** Disable card. */
  disabled?: boolean;
  /**
   * HTML tag to be used to render the card.
   *
   * @defaultValue 'div'
   */
  tag?: string;
}
