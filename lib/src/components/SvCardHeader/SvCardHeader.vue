<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue';

import type { SvCardComponentBorderRadiusInheritProp } from '../SvCard/borderRadiusInherit';

import { getSvCardComponentBorderRadiusInheritClasses } from '../SvCard/borderRadiusInherit';
import { SvCardContentInjectionSymbol } from '../SvCard/symbols';
import './index.sass';

defineOptions({
  name: 'SvCardHeader',
});

const props = withDefaults(defineProps<{ borderRadiusInherit?: SvCardComponentBorderRadiusInheritProp; }>(), {
  borderRadiusInherit: null,
});

const cardContent = inject(SvCardContentInjectionSymbol, null);

const classPrefix = 'sv-card-header';
const classList = computed(() => [
  classPrefix,
  `${ classPrefix }--${ cardContent == null ? 'vertical' : cardContent.layout }`,
  ...getSvCardComponentBorderRadiusInheritClasses(props.borderRadiusInherit, cardContent, 'header'),
]);

if (cardContent) {
  if (cardContent.header === true) {
    console.warn('[ SmartVui ] Only one SvCardHeader component can be used.');
  }
  cardContent.header = true;
}

onBeforeUnmount(() => {
  if (cardContent) {
    cardContent.header = false;
  }
});
</script>

<template>
  <div :class="classList">
    <slot />
  </div>
</template>
