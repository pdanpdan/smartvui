<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue';

import type { SvCardComponentBorderRadiusInheritProp } from '../SvCard/borderRadiusInherit';

import { getSvCardComponentBorderRadiusInheritClasses } from '../SvCard/borderRadiusInherit';
import { SvCardContentInjectionSymbol } from '../SvCard/symbols';
import './index.sass';

defineOptions({
  name: 'SvCardContent',
});

const props = withDefaults(defineProps<{ borderRadiusInherit?: SvCardComponentBorderRadiusInheritProp; }>(), {
  borderRadiusInherit: null,
});

const cardContent = inject(SvCardContentInjectionSymbol, null);

const classPrefix = 'sv-card-content';
const classList = computed(() => [
  classPrefix,
  `${ classPrefix }--${ cardContent == null ? 'vertical' : cardContent.layout }`,
  ...getSvCardComponentBorderRadiusInheritClasses(props.borderRadiusInherit, cardContent, 'content'),
]);

if (cardContent) {
  if (cardContent.content === true) {
    console.warn('[ SmartVui ] Only one SvCardContent component can be used.');
  }
  cardContent.content = true;
}

onBeforeUnmount(() => {
  if (cardContent) {
    cardContent.content = false;
  }
});
</script>

<template>
  <div :class="classList">
    <slot />
  </div>
</template>
