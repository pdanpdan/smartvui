/**
 * @public
 */
export interface SvRippleProps {
  /** Disable ripple effect. */
  disabled?: boolean;

  /**
   * Return the target element for the ripple.
   *
   * @defaultValue (el) =\> el?.parentElement
   */
  target?: (el: HTMLSpanElement) => HTMLElement | null | undefined;

  /**
   * Trigger on pointer down.
   * `false` will not trigger, `true` will trigger, `function` should return if it should trigger or not.
   *
   * @defaultValue true
   */
  pointerDown?: boolean | ((evt: PointerEvent) => boolean);

  /**
   * Trigger on pointer up.
   * `false` will not trigger, `true` will trigger, `function` should return if it should trigger or not.
   *
   * @defaultValue false
   */
  pointerUp?: boolean | ((evt: PointerEvent, skipUntil?: number | null) => boolean);

  /**
   * Trigger on keydoard down.
   * `false` will not trigger, `true` will trigger, `array` triggers if `evt.key` is in array, `function` should return if it should trigger or not.
   *
   * @defaultValue ['Enter', ' ']
   */
  keyDown?: boolean | string[] | ((evt: KeyboardEvent) => boolean);

  /**
   * Trigger on keydoard up.
   * `false` will not trigger, `true` will trigger, `array` triggers if `evt.key` is in array, `function` should return if it should trigger or not.
   *
   * @defaultValue false
   */
  keyUp?: boolean | string[] | ((evt: KeyboardEvent, skipUntil?: number | null) => boolean);
}
