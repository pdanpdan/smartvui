/**
 * List of CSS selectors that match editable elements.
 *
 * @public
 */
export const EDITABLE_SELECTOR = [
  'input:not([disabled]):not([readonly]):not([type="button"]):not([type="checkbox"]):not([type="file"]):not([type="hidden"]):not([type="image"]):not([type="radio"]):not([type="range"]):not([type="reset"]):not([type="submit"])',
  'textarea:not([disabled]):not([readonly])',
  '[contenteditable]:not([contenteditable="false"])',
  '[contenteditable]:not([contenteditable="false"]) *',
  '[sv-editable],[sv-editable] *,[data-sv-editable],[data-sv-editable] *',
].join(',');

/**
 * Check is DOM element is editable based on CSS selectors.
 *
 * @public
 * @param el - DOM element.
 * @return `true` if element is editable, `false` otherwise.
 */
export function isEditableElement(el?: Element | null): el is Element {
  return el?.matches(EDITABLE_SELECTOR) === true;
}
