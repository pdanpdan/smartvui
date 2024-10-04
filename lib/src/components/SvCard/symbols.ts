import type { InjectionKey, Reactive } from 'vue';

/**
 * SvCard content registered in the component.
 *
 * @public
 */
export type SvCardContent = Reactive<{
  layout: 'horizontal' | 'vertical';
  header: boolean;
  content: boolean;
  footer: boolean;
  actions: {
    start: boolean;
    end: boolean;
    startH: boolean;
    endH: boolean;
  };
  media: {
    start: boolean;
    end: boolean;
    cover: boolean;
  };
}>;

/**
 * @public
 */
export const SvCardContentInjectionSymbol = Symbol('sv-card-content') as InjectionKey<SvCardContent>;
