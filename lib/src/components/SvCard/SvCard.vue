<script setup lang="ts">
import { computed } from 'vue';

import {
  SvLayerElevation,
  SvLayerFocusIndicator,
  SvLayerOutline,
  SvLayerState,
  SvRipple,
} from '$lib/components';

import type { SvCardProps } from './props';

import './index.sass';

defineOptions({
  name: 'SvCard',
});

const props = withDefaults(defineProps<SvCardProps>(), {
  aspect: 'elevated',
  interactive: false,
  tabindex: null,
  ripple: null,
  disabled: false,
  tag: 'div',
});

const classPrefix = 'sv-card';
const classList = computed(() => {
  const list = [
    classPrefix,
    `${ classPrefix }--${ props.aspect }`,
    `${ classPrefix }--${ props.disabled === true ? 'disabled' : 'enabled' }`,
  ];

  if (props.interactive === true && props.disabled !== true) {
    list.push(`${ classPrefix }--interactive`);
  }

  return list;
});

const showRipple = computed(() => props.disabled !== true && (props.ripple == null ? props.interactive : props.ripple));
const tabindex = computed(() => props.disabled !== true ? (props.tabindex == null ? (props.interactive === true ? 0 : undefined) : props.tabindex) : undefined);
</script>

<template>
  <component
    :is="props.tag"
    :class="classList"
    :tabindex
  >
    <SvLayerElevation />
    <SvLayerOutline />
    <SvLayerFocusIndicator />
    <SvLayerState />

    <slot name="ripple"><SvRipple v-if="showRipple" /></slot>

    <slot />
  </component>
</template>
