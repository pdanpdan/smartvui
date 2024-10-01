/**
 * @public
 */
export interface SvCardProps {
  /**
   * Variant: `elevated`, `filled` `outlined`.
   *
   * @defaultValue 'elevated'
   */
  variant?: 'elevated' | 'filled' | 'outlined';
  /**
   * Make card react to interactions.
   * If `href` is set then `interactive` defaults to `true`
   *
   * @defaultValue null
   */
  interactive?: boolean | null;
  /** Card is being dragged. */
  dragged?: boolean;
  /**
   * Tabindex for the element.
   * If `interactive` is set the `tabindex` defaults to `0`
   *
   * @defaultValue null
   */
  tabindex?: number | string | null;
  /**
   * Use ripple effect when pressed.
   * If `interactive` is set the `ripple` defaults to `true`.
   * You can also implement custom ripple using the `ripple` slot.
   *
   * @defaultValue null
   */
  ripple?: boolean | null;
  /** Disable card. */
  disabled?: boolean;
  /** HTML link `href`. */
  href?: string | null;
  /**
   * HTML tag to be used to render the card.
   * If `interactive` is set `tag` defaults to `button`.
   * If `href` is set `tag` defaults to `a`.
   *
   * @defaultValue null
   */
  tag?: string | null;
}
