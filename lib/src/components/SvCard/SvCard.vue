<script setup lang="ts">
import { computed, provide, reactive, ref, Suspense, useAttrs, watchSyncEffect } from 'vue';

import {
  SvLayerContainer,
  SvLayerElevation,
  SvLayerFocusIndicator,
  SvLayerOutline,
  SvLayerState,
  SvRipple,
} from '$lib/components';

import type { SvCardProps } from './props';
import type { SvCardSlots } from './slots';
import type { SvCardContent } from './symbols';

import './index.sass';
import { SvCardContentInjectionSymbol } from './symbols';

defineOptions({
  name: 'SvCard',
});

const props = withDefaults(defineProps<SvCardProps>(), {
  variant: 'elevated',
  layout: 'vertical',
  interactive: null,
  tabindex: null,
  ripple: null,
  disabled: false,
  href: null,
  tag: null,
});

defineSlots<SvCardSlots>();

const attrs = useAttrs();

const cardContent = reactive<SvCardContent>({
  layout: props.layout,
  header: false,
  content: false,
  footer: false,
  actions: {
    start: false,
    end: false,
    startH: false,
    endH: false,
  },
  media: {
    start: false,
    end: false,
    cover: false,
  },
});

provide(SvCardContentInjectionSymbol, cardContent);

watchSyncEffect(() => {
  cardContent.layout = props.layout;
});

const isLink = computed(() => typeof props.href === 'string' && props.href.trim().length > 0);
const hasOnClick = computed(() => Object.keys(attrs).some((k) => k.startsWith('onClick')));
const isInteractive = computed(() => props.disabled === true ? false : (props.interactive != null ? props.interactive : isLink.value || hasOnClick.value));
const showRipple = computed(() => props.disabled === true ? false : (props.ripple != null ? props.ripple : isInteractive.value));
const tabindex = computed(() => props.disabled === true ? undefined : (props.tabindex != null ? props.tabindex : (isInteractive.value === true ? 0 : undefined)));
const tag = computed(() => props.disabled === true ? 'div' : (props.tag != null ? props.tag : (isLink.value === true ? 'a' : (isInteractive.value === true ? 'button' : 'div'))));

const pointerPressed = ref(false);

const classPrefix = 'sv-card';
const classList = computed(() => {
  const list = [
    classPrefix,
    `${ classPrefix }--${ props.variant }`,
    `${ classPrefix }--${ props.disabled === true ? 'disabled' : 'enabled' }`,
  ];

  if (isInteractive.value === true) {
    list.push(`${ classPrefix }--interactive`);

    if (pointerPressed.value === true) {
      list.push(`${ classPrefix }--pointer-pressed`);
    }
  }

  if (props.dragged === true) {
    list.push(`${ classPrefix }--dragged`);
  }

  return list;
});

function setPointerPressed(evt: PointerEvent) {
  const target = evt.target as Element | null;
  const card = target == null ? null : target.closest('.sv-card');
  pointerPressed.value = card == null || card.matches(':focus-visible') === false;
}

function clearPointerPressed() {
  pointerPressed.value = false;
}

const pointerPressedEvents = computed(() =>
  isInteractive.value === true
    ? {
      onPointerdownPassive: setPointerPressed,
      onKeydown: clearPointerPressed,
      onKeyup: clearPointerPressed,
      onBlur: clearPointerPressed,
    }
    : undefined,
);
</script>

<template>
  <component
    :is="tag"
    :class="classList"
    :tabindex
    :href
    v-bind="pointerPressedEvents"
  >
    <div class="sv-card__layer-bottom">
      <slot
        name="layer-bottom"
        :disabled
        :dragged="dragged === true"
        :interactive="isInteractive"
        :ripple="showRipple"
        :pointer-pressed="pointerPressed"
      />
    </div>

    <slot
      name="layer-state"
      :disabled
      :dragged="dragged === true"
      :interactive="isInteractive"
      :ripple="showRipple"
      :pointer-pressed="pointerPressed"
    >
      <SvLayerContainer />
      <SvLayerElevation />
      <SvLayerOutline />
      <SvLayerFocusIndicator />
      <SvLayerState />
      <SvRipple v-if="showRipple" />
    </slot>

    <Suspense>
      <div class="sv-card__layer-content" :class="`sv-card__layer-content--${ layout }`">
        <slot
          :disabled
          :dragged="dragged === true"
          :interactive="isInteractive"
          :ripple="showRipple"
          :pointer-pressed="pointerPressed"
        />
      </div>
    </Suspense>
  </component>
</template>
