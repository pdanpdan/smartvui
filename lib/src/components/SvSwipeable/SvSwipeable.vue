<script setup lang="ts">
import type { FullGestureState } from '@vueuse/gesture';
import type { WatchStopHandle } from 'vue';

import { useDrag } from '@vueuse/gesture';
import { computed, onBeforeUnmount, onMounted, reactive, useTemplateRef, watch } from 'vue';

import { toKebabCase } from '$lib/utils/caseConvert';
import { toElementValue } from '$lib/utils/unref';

import type { SvSwipeableProps } from './props';
import type { SvSwipeableSlotProps, SvSwipeableSlots } from './slots';

import './index.sass';

defineOptions({
  name: 'SvSwipeable',
});

const props = withDefaults(defineProps<SvSwipeableProps>(), {
  disabled: false,
});

const slots = defineSlots<SvSwipeableSlots>();

const elRef = useTemplateRef<HTMLDivElement>('elRef');
const drag = useDrag(onSwipe, {
  domTarget: toElementValue(elRef),
  enabled: false,

  filterTaps: true,
  lockDirection: true,
});

const swipeStatus = reactive({
  inlineStart: {
    size: 0,
    swiped: false,
    enabled: false,
  },

  inlineEnd: {
    size: 0,
    swiped: false,
    enabled: false,
  },

  blockStart: {
    size: 0,
    swiped: false,
    enabled: false,
  },

  blockEnd: {
    size: 0,
    swiped: false,
    enabled: false,
  },
});

const swipeSides: [ Exclude<SvSwipeableSlotProps[ 'side' ], null>, keyof typeof swipeStatus ][] = [
  [ 'inline-start', 'inlineStart' ],
  [ 'inline-end', 'inlineEnd' ],
  [ 'block-start', 'blockStart' ],
  [ 'block-end', 'blockEnd' ],
];
const swipeActive = computed(() => {
  for (const side of swipeSides) {
    if (swipeStatus[ side[ 1 ] ].swiped) {
      return {
        ...swipeStatus[ side[ 1 ] ],
        side: side[ 0 ],
        ref: swipeStatus[ side[ 1 ] ],
      };
    }
  }

  for (const side of swipeSides) {
    if (swipeStatus[ side[ 1 ] ].size > 0) {
      return {
        ...swipeStatus[ side[ 1 ] ],
        side: side[ 0 ],
        ref: swipeStatus[ side[ 1 ] ],
      };
    }
  }

  return null;
});

const classPrefix = 'sv-swipeable';
const classList = computed(() => {
  const list = [
    classPrefix,
    `${ classPrefix }--${ props.disabled === true ? 'disabled' : 'enabled' }`,
  ];

  if (swipeActive.value != null && swipeActive.value.size > 0 && swipeActive.value.swiped === false) {
    list.push(`${ classPrefix }--dragging`);
  }

  return list;
});

function updateSize() {
  const el = toElementValue(elRef);

  if (el == null) {
    return;
  }

  for (const side of swipeSides) {
    el.style.setProperty(`--sv-swipeable-${ side[ 0 ] }`, swipeStatus[ side[ 1 ] ].swiped === true ? '100%' : `${ swipeStatus[ side[ 1 ] ].size }px`);
  }
}

function reset() {
  if (swipeActive.value != null) {
    Object.assign(swipeActive.value.ref, { size: 0, swiped: false });
  }

  updateSize();
}

function preventDefault(evt?: UIEvent) {
  if (evt == null) {
    return;
  }

  if (slots[ 'block-start' ] == null && slots[ 'block-end' ] == null) {
    return;
  }

  evt.preventDefault();
}

function hasScrollableParentInline(el?: HTMLElement | null): boolean {
  if (el == null || el.matches('.sv-swipeable__content')) {
    return false;
  }
  return (el.scrollWidth > el.clientWidth && window.getComputedStyle(el).overflowX !== 'hidden')
    || hasScrollableParentInline(el.parentElement);
}

function hasScrollableParentBlock(el?: HTMLElement | null): boolean {
  if (el == null || el.matches('.sv-swipeable__content')) {
    return false;
  }
  return (el.scrollHeight > el.clientHeight && window.getComputedStyle(el).overflowY !== 'hidden')
    || hasScrollableParentBlock(el.parentElement);
}

let onSwipeUnlockTime = 0;
function onSwipe({ movement, tap, last, event }: FullGestureState<'drag'>) {
  if (tap === true) {
    return;
  }

  const slotName = movement[ 0 ] > 0
    ? 'inlineStart'
    : movement[ 0 ] < 0
      ? 'inlineEnd'
      : movement[ 1 ] > 0
        ? 'blockStart'
        : movement[ 1 ] < 0
          ? 'blockEnd'
          : null;

  if (
    slotName == null
    || (slotName.includes('inline') && hasScrollableParentInline(event?.target as HTMLElement | null | undefined))
    || (slotName.includes('block') && hasScrollableParentBlock(event?.target as HTMLElement | null | undefined))
  ) {
    return;
  }

  if (swipeActive.value != null && swipeStatus[ slotName ] !== swipeActive.value.ref) {
    onSwipeUnlockTime = Date.now() + 300;
    reset();
    preventDefault(event);
    return;
  }

  if (swipeStatus[ slotName ].enabled === false) {
    return;
  }

  preventDefault(event);

  if (swipeStatus[ slotName ].swiped === true || onSwipeUnlockTime > Date.now()) {
    return;
  }

  swipeStatus[ slotName ].size = Math.abs(movement[ 0 ] !== 0 ? movement[ 0 ] : movement[ 1 ]);

  const el = toElementValue(elRef)?.querySelector(`:scope > .sv-swipeable__slot--${ toKebabCase(slotName) } > *`);
  const swipeLimit = slotName.includes('inline')
    ? (el?.clientWidth ?? 50) * 0.7
    : (el?.clientHeight ?? 50) * 0.7;
  swipeStatus[ slotName ].swiped = swipeStatus[ slotName ].size >= swipeLimit;

  if (last === true && swipeStatus[ slotName ].swiped === false) {
    reset();
  } else {
    updateSize();
  }
}

let stopWatching: WatchStopHandle | undefined;
onMounted(() => {
  stopWatching = watch(
    () => ({
      el: toElementValue(elRef)?.querySelector(':scope > .sv-swipeable__content') as HTMLDivElement,
      disabled: props.disabled,
      hasSlotInline: slots[ 'inline-start' ] != null || slots[ 'inline-end' ] != null,
      hasSlotBlock: slots[ 'block-start' ] != null || slots[ 'block-end' ] != null,
    }),
    ({ el, disabled, hasSlotInline, hasSlotBlock }) => {
      drag.reset();
      drag.clean();

      for (const side of swipeSides) {
        swipeStatus[ side[ 1 ] ].enabled = slots[ side[ 0 ] ] != null;
      }

      updateSize();

      if (disabled === true || el == null || (hasSlotInline === false && hasSlotBlock === false)) {
        return;
      }

      drag.config.enabled = true;
      drag.config.domTarget = el;
      drag.config.eventOptions = { capture: false, passive: hasSlotBlock === false };
      drag.config.drag!.axis = hasSlotInline === true && hasSlotBlock === true
        ? undefined
        : (hasSlotInline === true ? 'x' : 'y');
      drag.bind();
    },
    { flush: 'pre', immediate: true },
  );
});

onBeforeUnmount(() => {
  if (stopWatching != null) {
    stopWatching();
    stopWatching = undefined;
  }

  drag.clean();
  reset();
});
</script>

<template>
  <div ref="elRef" :class="classList">
    <div
      class="sv-swipeable__slot sv-swipeable__slot--inline sv-swipeable__slot--inline-start"
      :class="{ 'sv-swipeable__slot--visible': swipeStatus.inlineStart.size !== 0 }"
    >
      <slot
        name="inline-start"
        :disabled
        side="inline-start"
        :size="swipeStatus.inlineStart.size"
        :swiped="swipeStatus.inlineStart.swiped"
        :swiping="swipeStatus.inlineStart.swiped"
        :reset
      />
    </div>

    <div
      class="sv-swipeable__slot sv-swipeable__slot--inline sv-swipeable__slot--inline-end"
      :class="{ 'sv-swipeable__slot--visible': swipeStatus.inlineEnd.size !== 0 }"
    >
      <slot
        name="inline-end"
        :disabled
        side="inline-end"
        :size="swipeStatus.inlineEnd.size"
        :swiped="swipeStatus.inlineEnd.swiped"
        :swiping="swipeStatus.inlineEnd.size > 0 && swipeStatus.inlineEnd.swiped === false"
        :reset
      />
    </div>

    <div
      class="sv-swipeable__slot sv-swipeable__slot--block sv-swipeable__slot--block-start"
      :class="{ 'sv-swipeable__slot--visible': swipeStatus.blockStart.size !== 0 }"
    >
      <slot
        name="block-start"
        :disabled
        side="block-start"
        :size="swipeStatus.blockStart.size"
        :swiped="swipeStatus.blockStart.swiped"
        :swiping="swipeStatus.blockStart.size > 0 && swipeStatus.blockStart.swiped === false"
        :reset
      />
    </div>

    <div
      class="sv-swipeable__slot sv-swipeable__slot--block sv-swipeable__slot--block-end"
      :class="{ 'sv-swipeable__slot--visible': swipeStatus.blockEnd.size !== 0 }"
    >
      <slot
        name="block-end"
        :disabled
        side="block-end"
        :size="swipeStatus.blockEnd.size"
        :swiped="swipeStatus.blockEnd.swiped"
        :swiping="swipeStatus.blockEnd.size > 0 && swipeStatus.blockEnd.swiped === false"
        :reset
      />
    </div>

    <div class="sv-swipeable__content">
      <slot
        :disabled
        :side="swipeActive?.side ?? null"
        :size="swipeActive?.size ?? 0"
        :swiped="swipeActive?.swiped === true"
        :swiping="(swipeActive?.size ?? 0) > 0 && swipeActive?.swiped !== true"
        :reset
      />
    </div>
  </div>
</template>
