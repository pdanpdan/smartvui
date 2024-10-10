<script setup lang="ts">
import type { WatchHandle } from 'vue';

import { onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';

import type {
  SvSurfaceEl,
  SvSurfaceEventNameType,
  SvSurfaceEventPayloadType,
  SvSurfaceHideTriggerType,
  SvSurfaceShowTriggerType,
  SvSurfaceTypeModal as SvSurfaceType,
} from '$lib/components/SvSurfaceModal/svSurface';

import { useScreen } from '$lib/composables';
import { waitForAnimations } from '$lib/utils/animation';

import type { SvSurfaceModalEmits } from './emits';
import type { SvSurfaceModalExposed } from './exposed';
import type { SvSurfaceModalProps } from './props';
import type { SvSurfaceModalSlots } from './slots';

import './index.sass';

defineOptions({
  name: 'SvSurfaceModal',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SvSurfaceModalProps>(), {
  ssr: false,
  absolute: false,
  maximized: false,
  escapeClose: false,
  backdropClose: false,
});

const emit = defineEmits<SvSurfaceModalEmits>();

defineSlots<SvSurfaceModalSlots>();

/** Open status of the surface */
const modelValue = defineModel<boolean>({ default: false });
const internalModel = ref<boolean>(false);
const id = useId();
const surfaceRef = ref<SvSurfaceEl<SvSurfaceType>>(null);
const isAnimating = ref<'show' | 'hide' | false>(false);
let abortController: AbortController | undefined;
let showTrigger: SvSurfaceShowTriggerType = 'model';
let hideTrigger: SvSurfaceHideTriggerType<SvSurfaceType> = 'model';
let renderedOnSSR = props.ssr && modelValue.value ? { open: true } : undefined;

const { scrollLockRequested } = useScreen();

defineExpose<SvSurfaceModalExposed>({
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

function onClose() {
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

function onBackdrop(evt: MouseEvent | PointerEvent) {
  if (props.backdropClose === false) {
    return;
  }

  const { left, right, top, bottom } = (evt.target as Element).getBoundingClientRect();
  const { clientX, clientY } = evt;

  if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
    const hide = () => {
      hideTrigger = 'backdrop';
      modelValue.value = false;
    };
    if (typeof props.backdropClose === 'function') {
      return props.backdropClose(evt, hide);
    }
    hide();
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
    absolute: props.absolute,
    maximized: props.maximized,
    error,
  } as SvSurfaceEventPayloadType<SvSurfaceType, T>;
}

let stopWatching: WatchHandle | undefined;
onMounted(() => {
  stopWatching = watch(() => [ !surfaceRef.value, modelValue.value ], () => {
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
      if (surfaceRef.value?.open) {
        surfaceRef.value.close();
      }

      const showStartPayload = createEventPayload('show-start', showTrigger);
      emit('showStart', showStartPayload);
      surfaceRef.value.dataset.svSurfaceAnimating = 'show';
      isAnimating.value = 'show';

      scrollLockRequested.value = true;

      surfaceRef.value.showModal();

      waitForAnimations(surfaceRef.value, {
        signal: abortController.signal,
        animationsDone: props.animationWait?.(showStartPayload),
      })
        .then(() => {
          emit('showEnd', createEventPayload('show-end', showTrigger));
          delete surfaceRef.value?.dataset.svSurfaceAnimating;
          isAnimating.value = false;
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
          surfaceRef.value?.close();

          scrollLockRequested.value = false;

          internalModel.value = false;
          emit('hideEnd', createEventPayload('hide-end', hideTrigger));
          delete surfaceRef.value?.dataset.svSurfaceAnimating;
          isAnimating.value = false;
          renderedOnSSR = undefined;
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

  scrollLockRequested.value = false;

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
    :is-absolute="absolute"
    :is-animating
  />

  <dialog
    v-if="internalModel || !!renderedOnSSR"
    ref="surfaceRef"
    class="sv-surface-modal"
    :class="{ 'sv-surface-modal--absolute': absolute }"
    v-bind="{ ...$attrs, ...renderedOnSSR }"
    :data-sv-surface-open="modelValue ? '' : undefined"
    :data-sv-surface-maximized="maximized ? '' : undefined"
    @close="onClose"
    @click.self="onBackdrop"
    @keydown.escape.capture="onEscape"
  >
    <slot
      :id="id"
      :show
      :hide
      :toggle
      :is-open="modelValue"
      :is-maximized="maximized"
      :is-absolute="absolute"
      :is-animating
    />
  </dialog>
</template>
