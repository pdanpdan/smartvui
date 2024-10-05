<script setup lang="ts">
import type { WatchHandle } from 'vue';

import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue';

import { waitForAnimations } from '$lib/utils/animation';
import { noop } from '$lib/utils/noop';

import type { SvRippleProps } from './props';

import './index.sass';

defineOptions({
  name: 'SvRipple',
});

const props = withDefaults(defineProps<SvRippleProps>(), {
  disabled: false,
  target: (el: HTMLSpanElement) => el?.parentElement,
  pointerDown: true,
  pointerUp: false,
  keyDown: () => [ 'Enter', ' ' ],
  keyUp: false,
});

const elRef = useTemplateRef<HTMLSpanElement>('elRef');
let rippleTarget: HTMLElement | undefined;
let cleanup = noop;
let skipUpUntil: number | undefined;

function activate(x: string, y: string) {
  if (elRef.value) {
    const ripple = document.createElement('i');
    elRef.value.appendChild(ripple);

    const { classList, style } = ripple;

    style.setProperty('--sv-ripple-x', x);
    style.setProperty('--sv-ripple-y', y);

    classList.add('sv-ripple--active');
    requestAnimationFrame(() => {
      classList.remove('sv-ripple--active');

      waitForAnimations(ripple).then(() => {
        ripple.remove();
      });
    });
  }
}

function onPointerdown(evt: PointerEvent & { __svRipplePrevent?: true; }) {
  if (props.disabled === true || props.pointerDown === false || evt.defaultPrevented === true || evt.__svRipplePrevent === true) {
    return;
  }
  if (typeof props.pointerDown === 'function' && props.pointerDown(evt) !== true) {
    return;
  }

  if (rippleTarget != null) {
    evt.__svRipplePrevent = true;
    const { left, top } = rippleTarget.getBoundingClientRect();
    const offsetX = (evt.x ?? evt.pageX) - left;
    const offsetY = (evt.y ?? evt.pageY) - top;
    activate(`${ offsetX / rippleTarget.clientWidth * 100 }%`, `${ offsetY / rippleTarget.clientHeight * 100 }%`);
    skipUpUntil = Date.now() + 300;
  }
}

function onPointerup(evt: PointerEvent & { __svRipplePrevent?: true; }) {
  if (props.disabled === true || props.pointerUp === false || evt.defaultPrevented === true || evt.__svRipplePrevent === true) {
    return;
  }
  if (typeof props.pointerUp === 'function') {
    if (props.pointerUp(evt, skipUpUntil) !== true) {
      return;
    }
  } else if (skipUpUntil != null && skipUpUntil > Date.now()) {
    return;
  }

  if (rippleTarget != null) {
    evt.__svRipplePrevent = true;
    const { left, top } = rippleTarget.getBoundingClientRect();
    const offsetX = evt.pageX - left;
    const offsetY = evt.pageY - top;
    activate(`${ offsetX / rippleTarget.clientWidth * 100 }%`, `${ offsetY / rippleTarget.clientHeight * 100 }%`);
  }
}

function onKeydown(evt: KeyboardEvent & { __svRipplePrevent?: true; }) {
  if (props.disabled === true || props.keyDown === false || evt.defaultPrevented === true || evt.__svRipplePrevent === true || evt.repeat === true || evt.isComposing === true) {
    return;
  }
  if (Array.isArray(props.keyDown)) {
    if (props.keyDown.includes(evt.key) === false) {
      return;
    }
  } else if (typeof props.keyDown === 'function' && props.keyDown(evt) !== true) {
    return;
  }

  skipUpUntil = Date.now() + 300;
  evt.__svRipplePrevent = true;
  activate('50%', '50%');
}

function onKeyup(evt: KeyboardEvent & { __svRipplePrevent?: true; }) {
  if (props.disabled === true || props.keyUp === false || evt.defaultPrevented === true || evt.__svRipplePrevent === true || evt.repeat === true || evt.isComposing === true) {
    return;
  }
  if (typeof props.keyUp === 'function') {
    if (props.keyUp(evt, skipUpUntil) !== true) {
      return;
    }
  } else if (skipUpUntil != null && skipUpUntil > Date.now()) {
    return;
  } else if (Array.isArray(props.keyUp) && props.keyUp.includes(evt.key) === false) {
    return;
  }

  evt.__svRipplePrevent = true;
  activate('50%', '50%');
}

function setup([ el, disabled, targetFn ]: [ HTMLElement | null | undefined, boolean, typeof props.target ]) {
  cleanup();

  if (el == null || disabled === true || typeof targetFn !== 'function') {
    return;
  }

  rippleTarget = targetFn(el) ?? undefined;

  if (rippleTarget != null) {
    cleanup = () => {
      if (rippleTarget != null) {
        rippleTarget.removeEventListener('pointerdown', onPointerdown);
        rippleTarget.removeEventListener('pointerup', onPointerup);
        rippleTarget.removeEventListener('keydown', onKeydown);
        rippleTarget.removeEventListener('keyup', onKeyup);
      }
      cleanup = noop;
      rippleTarget = undefined;
    };

    rippleTarget.addEventListener('pointerdown', onPointerdown);
    rippleTarget.addEventListener('pointerup', onPointerup);
    rippleTarget.addEventListener('keydown', onKeydown);
    rippleTarget.addEventListener('keyup', onKeyup);
  }
}

let stopWatching: WatchHandle | undefined;
onMounted(() => {
  stopWatching = watch([ elRef, () => props.disabled, () => props.target ], setup, { flush: 'post', immediate: true });
});

onBeforeUnmount(() => {
  if (stopWatching != null) {
    stopWatching();
    stopWatching = undefined;
  }
  cleanup();
});
</script>

<template>
  <span ref="elRef" class="sv-ripple" />
</template>
