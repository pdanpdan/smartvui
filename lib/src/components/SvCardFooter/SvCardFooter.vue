<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue';

import type { SvCardComponentBorderRadiusInheritProp } from '../SvCard/layout';

import { getSvCardComponentLayoutClasses } from '../SvCard/layout';
import { SvCardContentInjectionSymbol } from '../SvCard/symbols';
import './index.sass';

defineOptions({
  name: 'SvCardFooter',
});

const props = withDefaults(defineProps<{ borderRadiusInherit?: SvCardComponentBorderRadiusInheritProp; }>(), {
  borderRadiusInherit: null,
});

const cardContent = inject(SvCardContentInjectionSymbol, null);

const classPrefix = 'sv-card-footer';
const classList = computed(() => [
  classPrefix,
  `${ classPrefix }--${ cardContent == null ? 'vertical' : cardContent.layout }`,
  ...getSvCardComponentLayoutClasses(props.borderRadiusInherit, cardContent, 'footer'),
]);

if (cardContent != null) {
  if (cardContent.footer === true) {
    console.warn('[ SmartVui ] Only one SvCardFooter component can be used.');
  }
  cardContent.footer = true;
} else {
  console.warn('[ SmartVui ] SvCardContent component should be used as a child of SvCard.');
}

onBeforeUnmount(() => {
  if (cardContent != null) {
    cardContent.footer = false;
  }
});
</script>

<template>
  <div :class="classList">
    <slot />
  </div>
</template>
