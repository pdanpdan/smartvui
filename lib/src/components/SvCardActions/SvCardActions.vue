<script setup lang="ts">
import { computed, inject, onBeforeUnmount, watch } from 'vue';

import type { SvCardComponentBorderRadiusInheritProp } from '../SvCard/layout';
import type { SvCardActionsProps } from './props';

import { getSvCardComponentLayoutClasses } from '../SvCard/layout';
import { SvCardContentInjectionSymbol } from '../SvCard/symbols';
import './index.sass';

defineOptions({
  name: 'SvCardActions',
});

const props = withDefaults(defineProps<SvCardActionsProps & { borderRadiusInherit?: SvCardComponentBorderRadiusInheritProp; }>(), {
  position: 'end',
  horizontal: false,
  align: 'start',
  borderRadiusInherit: null,
});

const cardContent = inject(SvCardContentInjectionSymbol, null);

const classPrefix = 'sv-card-actions';
const classList = computed(() => {
  const layout = cardContent == null ? 'vertical' : cardContent.layout;

  return [
    classPrefix,
    layout === 'horizontal'
      ? `${ classPrefix }--${ layout }-${ props.horizontal === true ? 'horizontal' : 'vertical' }`
      : `${ classPrefix }--${ layout }`,
    `${ classPrefix }--position-${ props.position }`,
    `${ classPrefix }--align-${ props.align }`,
    ...getSvCardComponentLayoutClasses(props.borderRadiusInherit, cardContent, `actions_${ props.position }${ cardContent?.layout === 'horizontal' && props.horizontal === true ? 'H' : '' }`),
  ];
});

watch(() => `${ props.position }${ cardContent?.layout === 'horizontal' && props.horizontal === true ? 'H' : '' }`, (newVal, oldVal) => {
  if (cardContent) {
    if (oldVal) {
      cardContent.actions[ oldVal as 'start' | 'end' | 'startH' | 'endH' ] = false;
    }

    if (cardContent.actions[ newVal as 'start' | 'end' | 'startH' | 'endH' ] === true) {
      console.warn(`[ SmartVui ] Only one SvCardActions component can be used in position \`${ newVal }\`.`);
    }
    cardContent.actions[ newVal as 'start' | 'end' | 'startH' | 'endH' ] = true;
  } else {
    console.warn('[ SmartVui ] SvCardActions component should be used as a child of SvCard.');
  }
}, { flush: 'sync', immediate: true });

onBeforeUnmount(() => {
  if (cardContent) {
    cardContent.actions[ `${ props.position }${ cardContent.layout === 'horizontal' && props.horizontal === true ? 'H' : '' }` ] = false;
  }
});
</script>

<template>
  <div :class="classList">
    <slot />
  </div>
</template>
