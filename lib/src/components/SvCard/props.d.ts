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
   * If `href` is set or `onClick` listener is present then `interactive` defaults to `true`
   *
   * @defaultValue null
   */
  interactive?: boolean | null;

  /** Indicate that the card is being dragged. */
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
   * You can also implement custom ripple using the `layer-state` slot.
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
   * If `disabled` is set `tag` defaults to `div`.
   * Else if `href` is set `tag` defaults to `a`.
   * Else if `interactive` is set `tag` defaults to `button`.
   * Else `tag` defaults to `div`.
   *
   * @defaultValue null
   */
  tag?: string | null;
}
