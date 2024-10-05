<script setup lang="ts">
import { computed, inject, onBeforeUnmount, watch } from 'vue';

import type { SvCardComponentBorderRadiusInheritProp } from '../SvCard/layout';
import type { SvCardMediaProps } from './props';

import { getSvCardComponentLayoutClasses } from '../SvCard/layout';
import { SvCardContentInjectionSymbol } from '../SvCard/symbols';
import './index.sass';

defineOptions({
  name: 'SvCard',
});

const props = withDefaults(defineProps<SvCardMediaProps & { borderRadiusInherit?: SvCardComponentBorderRadiusInheritProp; }>(), {
  position: 'start',
  borderRadiusInherit: null,
});

const cardContent = inject(SvCardContentInjectionSymbol, null);

const classPrefix = 'sv-card-media';
const classList = computed(() => [
  classPrefix,
  `${ classPrefix }--${ cardContent == null ? 'vertical' : cardContent.layout }`,
  `${ classPrefix }--${ props.position }`,
  ...getSvCardComponentLayoutClasses(props.borderRadiusInherit, cardContent, `media_${ props.position }`),
]);

watch(() => props.position, (newVal, oldVal) => {
  if (cardContent) {
    if (oldVal) {
      cardContent.media[ oldVal ] = false;
    }

    if (cardContent.media[ newVal ] === true) {
      console.warn(`[ SmartVui ] Only one SvCardMedia component can be used in position \`${ newVal }\`.`);
    }
    cardContent.media[ newVal ] = true;
  } else {
    console.warn('[ SmartVui ] SvCardMedia component should be used as a child of SvCard.');
  }
}, { flush: 'sync', immediate: true });

onBeforeUnmount(() => {
  if (cardContent) {
    cardContent.media[ props.position ] = false;
  }
});
</script>

<template>
  <div :class="classList">
    <slot />
  </div>
</template>
