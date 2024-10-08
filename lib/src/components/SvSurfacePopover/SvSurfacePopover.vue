<script setup lang="ts">
import type { WatchHandle } from 'vue';

import { onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';

import type {
  SvSurfaceEl,
  SvSurfaceEventNameType,
  SvSurfaceEventPayloadType,
  SvSurfaceHideTriggerType,
  SvSurfaceShowTriggerType,
  SvSurfaceTypePopover as SvSurfaceType,
} from '$lib/components/svSurface';

import { waitForAnimations } from '$lib/utils/animation';
import { noop } from '$lib/utils/noop';

import type { SvSurfacePopoverEmits } from './emits';
import type { SvSurfacePopoverExposed } from './exposed';
import type { SvSurfacePopoverProps } from './props';
import type { SvSurfacePopoverSlots } from './slots';

import './index.sass';

defineOptions({
  name: 'SvSurfacePopover',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SvSurfacePopoverProps>(), {
  ssr: false,
  fixed: false,
  maximized: false,
  escapeClose: false,
  backdropClose: false,
});

const emit = defineEmits<SvSurfacePopoverEmits>();

defineSlots<SvSurfacePopoverSlots>();

/** Open status of the surface */
const modelValue = defineModel<boolean>({ default: false });
const internalModel = ref<boolean>(false);
const id = useId();
const surfaceRef = ref<SvSurfaceEl<SvSurfaceType>>(null);
const isAnimating = ref<'show' | 'hide' | false>(false);
let abortController: AbortController | undefined;
let showTrigger: SvSurfaceShowTriggerType = 'model';
let hideTrigger: SvSurfaceHideTriggerType<SvSurfaceType> = 'model';
let renderedOnSSR = props.ssr && modelValue.value;

defineExpose<SvSurfacePopoverExposed>({
  surfaceRef,
  isOpen: modelValue,
  isAnimating,
  show,
  hide,
  toggle,
});

function show() {
  showTrigger = 'slot';
  modelValue.value = true;
}

function hide() {
  hideTrigger = 'slot';
  modelValue.value = false;
}

function toggle() {
  if (modelValue.value) {
    hide();
  } else {
    show();
  }
}

function onToggle({ newState }: ToggleEvent) {
  if (newState !== 'closed') {
    return;
  }

  if (!renderedOnSSR && modelValue.value) {
    hideTrigger = 'close';
    modelValue.value = false;
  }
}

function onEscape(evt: KeyboardEvent) {
  if (props.escapeClose === false || evt.defaultPrevented || evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey) {
    return;
  }

  evt.preventDefault();
  evt.stopImmediatePropagation();

  const hide = () => {
    hideTrigger = 'esc';
    modelValue.value = false;
  };
  if (typeof props.escapeClose === 'function') {
    return props.escapeClose(evt, hide);
  }
  hide();
}

let cleanFixIosBackdrop: null | (() => void) = null;
function fixIosBackdrop() {
  if (cleanFixIosBackdrop === null) {
    document.body.addEventListener('pointerdown', noop, { passive: true });
    cleanFixIosBackdrop = () => {
      document.body.removeEventListener('pointerdown', noop);
      cleanFixIosBackdrop = null;
    };
  }
}

function createEventPayload<T extends SvSurfaceEventNameType>(
  type: T,
  trigger: T extends `show-${ string }` ? SvSurfaceShowTriggerType : SvSurfaceHideTriggerType<SvSurfaceType>,
  error?: T extends `${ string }-cancel` ? Error : never,
) {
  return {
    type,
    target: surfaceRef,
    trigger,
    fixed: props.fixed,
    maximized: props.maximized,
    error,
  } as SvSurfaceEventPayloadType<SvSurfaceType, T>;
}

let stopWatching: WatchHandle | undefined;
onMounted(() => {
  stopWatching = watch(() => [ !surfaceRef.value, modelValue.value, props.backdropClose ], () => {
    if (abortController) {
      abortController.abort('modelValue changed');
      abortController = undefined;
    }

    if (modelValue.value) {
      internalModel.value = true;
    }

    if (!surfaceRef.value) {
      return;
    }

    abortController = new AbortController();

    if (modelValue.value) {
      if (surfaceRef.value?.matches(':popover-open')) {
        surfaceRef.value.hidePopover();
      }

      const showStartPayload = createEventPayload('show-start', showTrigger);
      emit('showStart', showStartPayload);
      surfaceRef.value.dataset.svSurfaceAnimating = 'show';
      isAnimating.value = 'show';

      if (props.backdropClose) {
        fixIosBackdrop();
      }

      surfaceRef.value.showPopover();

      waitForAnimations(surfaceRef.value, {
        signal: abortController.signal,
        animationsDone: props.animationWait?.(showStartPayload),
      })
        .then(() => {
          emit('showEnd', createEventPayload('show-end', showTrigger));
          delete surfaceRef.value?.dataset.svSurfaceAnimating;
          isAnimating.value = false;
          renderedOnSSR = false;
          abortController = undefined;
          showTrigger = 'model';
        })
        .catch((error) => {
          emit('showCancel', createEventPayload('show-cancel', showTrigger, error));
        });
    } else {
      const hideStartPayload = createEventPayload('hide-start', hideTrigger);
      emit('hideStart', hideStartPayload);
      surfaceRef.value.dataset.svSurfaceAnimating = 'hide';
      isAnimating.value = 'hide';

      waitForAnimations(surfaceRef.value, {
        signal: abortController.signal,
        animationsDone: props.animationWait?.(hideStartPayload),
      })
        .then(() => {
          surfaceRef.value?.hidePopover();

          if (cleanFixIosBackdrop !== null) {
            cleanFixIosBackdrop();
          }

          internalModel.value = false;
          emit('hideEnd', createEventPayload('hide-end', hideTrigger));
          delete surfaceRef.value?.dataset.svSurfaceAnimating;
          isAnimating.value = false;
          renderedOnSSR = false;
          abortController = undefined;
          hideTrigger = 'model';
        })
        .catch((error) => {
          emit('hideCancel', createEventPayload('hide-cancel', showTrigger, error));
        });
    }
  }, { flush: 'post', immediate: true });
});

onBeforeUnmount(() => {
  if (stopWatching != null) {
    stopWatching();
    stopWatching = undefined;
  }

  if (abortController != null) {
    abortController.abort();
    abortController = undefined;
  }

  if (cleanFixIosBackdrop !== null) {
    cleanFixIosBackdrop();
  }

  modelValue.value = false;
});
</script>

<template>
  <slot
    :id="id"
    name="activator"
    :show
    :hide
    :toggle
    :is-open="modelValue"
    :is-maximized="maximized"
    :is-fixed="fixed"
    :is-animating
  />

  <div
    v-if="internalModel || !!renderedOnSSR"
    ref="surfaceRef"
    class="sv-surface-popover"
    :class="{ 'sv-surface-popover--fixed': fixed }"
    tabindex="-1"
    v-bind="$attrs"
    :popover="backdropClose === true ? 'auto' : 'manual'"
    :data-sv-surface-open="modelValue ? '' : undefined"
    :data-sv-surface-maximized="maximized ? '' : undefined"
    @toggle="onToggle"
    @keydown.escape.capture="onEscape"
  >
    <slot
      :id="id"
      :show
      :hide
      :toggle
      :is-open="modelValue"
      :is-maximized="maximized"
      :is-fixed="fixed"
      :is-animating
    />
  </div>
</template>
