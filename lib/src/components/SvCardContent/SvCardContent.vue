<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount } from 'vue';

import type { SvCardComponentBorderRadiusInheritProp } from '../SvCard/layout';

import { getSvCardComponentLayoutClasses } from '../SvCard/layout';
import { SvCardContentInjectionSymbol } from '../SvCard/symbols';
import './index.sass';

defineOptions({
  name: 'SvCardContent',
});

const props = withDefaults(defineProps<{ borderRadiusInherit?: SvCardComponentBorderRadiusInheritProp; }>(), {
  borderRadiusInherit: null,
});

const cardContent = inject(SvCardContentInjectionSymbol, null);

await nextTick();

const classPrefix = 'sv-card-content';
const classList = computed(() => [
  classPrefix,
  `${ classPrefix }--${ cardContent == null ? 'vertical' : cardContent.layout }`,
  ...getSvCardComponentLayoutClasses(props.borderRadiusInherit, cardContent, 'content'),
]);

if (cardContent != null) {
  if (cardContent.content === true) {
    console.warn('[ SmartVui ] Only one SvCardContent component can be used.');
  }
  cardContent.content = true;
} else {
  console.warn('[ SmartVui ] SvCardContent component should be used as a child of SvCard.');
}

onBeforeUnmount(() => {
  if (cardContent != null) {
    cardContent.content = false;
  }
});
</script>

<template>
  <div :class="classList">
    <slot />
  </div>
</template>
