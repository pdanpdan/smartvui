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
    cancelAnimation: null as (() => void) | null,
  },

  inlineEnd: {
    size: 0,
    swiped: false,
    enabled: false,
    cancelAnimation: null as (() => void) | null,
  },

  blockStart: {
    size: 0,
    swiped: false,
    enabled: false,
    cancelAnimation: null as (() => void) | null,
  },

  blockEnd: {
    size: 0,
    swiped: false,
    enabled: false,
    cancelAnimation: null as (() => void) | null,
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
  const main = [
    classPrefix,
    `${ classPrefix }--${ props.disabled === true ? 'disabled' : 'enabled' }`,
  ];
  const content = [
    `${ classPrefix }__content`,
    `${ classPrefix }__content--${ props.disabled === true ? 'disabled' : 'enabled' }`,
  ];

  if (swipeActive.value != null && swipeActive.value.size > 0 && swipeActive.value.swiped === false) {
    main.push(`${ classPrefix }--dragging`);
    content.push(`${ classPrefix }__content--dragging`);
  }

  return { main, content };
});

function updateSize() {
  const el = toElementValue(elRef);

  if (el != null) {
    const style = el.style;

    for (const side of swipeSides) {
      const sideName = side[ 0 ];
      const sideState = swipeStatus[ side[ 1 ] ];

      if (sideState.cancelAnimation != null) {
        sideState.cancelAnimation();
      }

      if (sideState.swiped === true) {
        const slotEl = el.querySelector(`:scope > .sv-swipeable__slot--${ sideName }`);

        if (slotEl != null) {
          let animationFrame: ReturnType<typeof requestAnimationFrame> | null = null;
          sideState.cancelAnimation = () => {
            sideState.cancelAnimation = null;

            if (animationFrame != null) {
              cancelAnimationFrame(animationFrame);
              animationFrame = null;
            }

            style.setProperty(`--sv-swipeable-${ sideName }`, '100%');
          };

          style.setProperty(`--sv-swipeable-${ sideName }`, '100%');
          const finalSize = slotEl.getBoundingClientRect()[ sideName.includes('inline') ? 'width' : 'height' ];

          const resize = (size: number, step: number) => {
            step = Math.ceil(step / 2);
            size = Math.min(finalSize, size + step);
            style.setProperty(`--sv-swipeable-${ sideName }`, `${ size }px`);

            if (size < finalSize) {
              animationFrame = requestAnimationFrame(() => {
                resize(size, step);
              });
            } else if (sideState.cancelAnimation != null) {
              sideState.cancelAnimation();
            }
          };

          resize(sideState.size, Math.max(0, finalSize - sideState.size));
        } else {
          style.setProperty(`--sv-swipeable-${ sideName }`, '100%');
        }
      } else {
        style.setProperty(`--sv-swipeable-${ sideName }`, `${ sideState.size }px`);
      }
    }
  }
}

function reset() {
  const swipeToReset = swipeActive.value;

  if (swipeToReset != null) {
    if (swipeToReset.cancelAnimation != null) {
      if (swipeToReset.ref.swiped === true) {
        swipeToReset.cancelAnimation();
      } else {
        return;
      }
    }

    Object.assign(swipeToReset.ref, { swiped: false });

    const el = toElementValue(elRef);

    if (el != null) {
      const { style } = el;
      const sideName = swipeToReset.side;
      const slotEl = el.querySelector(`:scope > .sv-swipeable__slot--${ sideName }`);

      if (slotEl != null) {
        let animationFrame: ReturnType<typeof requestAnimationFrame> | null = null;
        swipeToReset.cancelAnimation = () => {
          swipeToReset.cancelAnimation = null;

          if (animationFrame != null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
          }

          Object.assign(swipeToReset.ref, { size: 0, swiped: false });
        };

        const resize = (size: number) => {
          size = Math.floor(size / 3);
          style.setProperty(`--sv-swipeable-${ sideName }`, `${ size }px`);

          if (size > 0) {
            animationFrame = requestAnimationFrame(() => {
              resize(size);
            });
          } else if (swipeToReset.cancelAnimation != null) {
            swipeToReset.cancelAnimation();
          }
        };

        resize(slotEl.getBoundingClientRect()[ sideName.includes('inline') ? 'width' : 'height' ]);
      } else {
        Object.assign(swipeToReset.ref, { size: 0, swiped: false });
      }
    } else {
      Object.assign(swipeToReset.ref, { size: 0, swiped: false });
    }
  } else {
    updateSize();
  }
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
let prevDirectionMovement = [ 0, 0 ];
function onSwipe({ movement, tap, last, event }: FullGestureState<'drag'>) {
  if (tap === true) {
    return;
  }

  const el = toElementValue(elRef);
  const movementInline = el?.matches(':dir(rtl)') === true ? -(movement[ 0 ] - prevDirectionMovement[ 0 ]) : movement[ 0 ] - prevDirectionMovement[ 0 ];
  const movementBlock = movement[ 1 ] - prevDirectionMovement[ 1 ];

  const slotName = movementInline > 0
    ? 'inlineStart'
    : movementInline < 0
      ? 'inlineEnd'
      : movementBlock > 0
        ? 'blockStart'
        : movementBlock < 0
          ? 'blockEnd'
          : null;

  if (last === true) {
    prevDirectionMovement = [ 0, 0 ];
  }

  if (
    slotName == null
    || (slotName.includes('inline') && hasScrollableParentInline(event?.target as HTMLElement | null | undefined))
    || (slotName.includes('block') && hasScrollableParentBlock(event?.target as HTMLElement | null | undefined))
  ) {
    return;
  }

  if (swipeActive.value != null && swipeStatus[ slotName ] !== swipeActive.value.ref) {
    if (swipeActive.value.side.slice(0, 5) === slotName.slice(0, 5)) {
      onSwipeUnlockTime = Date.now() + 300;
      reset();
      preventDefault(event);
    }

    return;
  }

  if (swipeStatus[ slotName ].enabled === false) {
    return;
  }

  preventDefault(event);

  if (swipeStatus[ slotName ].swiped === true || onSwipeUnlockTime > Date.now()) {
    prevDirectionMovement = [ ...movement ];
    return;
  }

  swipeStatus[ slotName ].size = Math.abs(movementInline !== 0 ? movementInline : movementBlock);

  const slotEl = el?.querySelector(`:scope > .sv-swipeable__slot--${ toKebabCase(slotName) } > *`);
  const swipeLimit = Math.min(50, slotName.includes('inline') ? (slotEl?.clientWidth ?? 50) : (slotEl?.clientHeight ?? 50));
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
    () => [
      toElementValue(elRef)?.querySelector(':scope > .sv-swipeable__content') as HTMLDivElement | null,
      props.disabled,
      slots[ 'inline-start' ] != null || slots[ 'inline-end' ] != null,
      slots[ 'block-start' ] != null || slots[ 'block-end' ] != null,
    ] as [HTMLDivElement | null, boolean, boolean, boolean],
    ([ el, disabled, hasSlotInline, hasSlotBlock ]) => {
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
  <div ref="elRef" :class="classList.main">
    <div
      class="sv-swipeable__slot sv-swipeable__slot--inline sv-swipeable__slot--inline-start"
      :class="{ 'sv-swipeable__slot--visible': swipeStatus.inlineStart.size !== 0 }"
      :inert="swipeStatus.inlineStart.size === 0"
    >
      <slot
        name="inline-start"
        :disabled
        side="inline-start"
        :size="swipeStatus.inlineStart.size"
        :swiped="swipeStatus.inlineStart.swiped === true"
        :swiping="swipeStatus.inlineStart.size !== 0 && swipeStatus.inlineStart.swiped !== true"
        :reset
      />
    </div>

    <div
      class="sv-swipeable__slot sv-swipeable__slot--inline sv-swipeable__slot--inline-end"
      :class="{ 'sv-swipeable__slot--visible': swipeStatus.inlineEnd.size !== 0 }"
      :inert="swipeStatus.inlineEnd.size === 0"
    >
      <slot
        name="inline-end"
        :disabled
        side="inline-end"
        :size="swipeStatus.inlineEnd.size"
        :swiped="swipeStatus.inlineEnd.swiped === true"
        :swiping="swipeStatus.inlineEnd.size !== 0 && swipeStatus.inlineEnd.swiped !== true"
        :reset
      />
    </div>

    <div
      class="sv-swipeable__slot sv-swipeable__slot--block sv-swipeable__slot--block-start"
      :class="{ 'sv-swipeable__slot--visible': swipeStatus.blockStart.size !== 0 }"
      :inert="swipeStatus.blockStart.size === 0"
    >
      <slot
        name="block-start"
        :disabled
        side="block-start"
        :size="swipeStatus.blockStart.size"
        :swiped="swipeStatus.blockStart.swiped === true"
        :swiping="swipeStatus.blockStart.size !== 0 && swipeStatus.blockStart.swiped !== true"
        :reset
      />
    </div>

    <div
      class="sv-swipeable__slot sv-swipeable__slot--block sv-swipeable__slot--block-end"
      :class="{ 'sv-swipeable__slot--visible': swipeStatus.blockEnd.size !== 0 }"
      :inert="swipeStatus.blockEnd.size === 0"
    >
      <slot
        name="block-end"
        :disabled
        side="block-end"
        :size="swipeStatus.blockEnd.size"
        :swiped="swipeStatus.blockEnd.swiped === true"
        :swiping="swipeStatus.blockEnd.size !== 0 && swipeStatus.blockEnd.swiped !== true"
        :reset
      />
    </div>

    <div :class="classList.content">
      <slot
        :disabled
        :side="swipeActive?.side ?? null"
        :size="swipeActive?.size ?? 0"
        :swiped="swipeActive?.swiped === true"
        :swiping="(swipeActive?.size ?? 0) !== 0 && swipeActive?.swiped !== true"
        :reset
      />
    </div>
  </div>
</template>
