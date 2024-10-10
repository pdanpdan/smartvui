<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount } from 'vue';

import type { SvCardComponentBorderRadiusInheritProp } from '../SvCard/layout';

import { getSvCardComponentLayoutClasses } from '../SvCard/layout';
import { SvCardContentInjectionSymbol } from '../SvCard/symbols';
import './index.sass';

defineOptions({
  name: 'SvCardHeader',
});

const props = withDefaults(defineProps<{ borderRadiusInherit?: SvCardComponentBorderRadiusInheritProp; }>(), {
  borderRadiusInherit: null,
});

const cardContent = inject(SvCardContentInjectionSymbol, null);

await nextTick();

const classPrefix = 'sv-card-header';
const classList = computed(() => [
  classPrefix,
  `${ classPrefix }--${ cardContent == null ? 'vertical' : cardContent.layout }`,
  ...getSvCardComponentLayoutClasses(props.borderRadiusInherit, cardContent, 'header'),
]);

if (cardContent != null) {
  if (cardContent.header === true) {
    console.warn('[ SmartVui ] Only one SvCardHeader component can be used.');
  }
  cardContent.header = true;
} else {
  console.warn('[ SmartVui ] SvCardContent component should be used as a child of SvCard.');
}

onBeforeUnmount(() => {
  if (cardContent != null) {
    cardContent.header = false;
  }
});
</script>

<template>
  <div :class="classList">
    <slot />
  </div>
</template>
