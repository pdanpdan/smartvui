<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue';

import type { SvCardComponentBorderRadiusInheritProp } from '../SvCard/borderRadiusInherit';

import { getSvCardComponentBorderRadiusInheritClasses } from '../SvCard/borderRadiusInherit';
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
  ...getSvCardComponentBorderRadiusInheritClasses(props.borderRadiusInherit, cardContent, 'footer'),
]);

if (cardContent) {
  if (cardContent.footer === true) {
    console.warn('[ SmartVui ] Only one SvCardFooter component can be used.');
  }
  cardContent.footer = true;
} else {
  console.warn('[ SmartVui ] SvCardContent component should be used as a child of SvCard.');
}

onBeforeUnmount(() => {
  if (cardContent) {
    cardContent.footer = false;
  }
});
</script>

<template>
  <div :class="classList">
    <slot />
  </div>
</template>
