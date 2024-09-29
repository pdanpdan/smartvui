<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue';

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
let cleanup = noop;
let skipUpUntil: number | null = null;

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

  skipUpUntil = Date.now() + 300;
  evt.__svRipplePrevent = true;
  const target = evt.target as HTMLElement;
  if (target != null) {
    activate(`${ evt.offsetX / target.clientWidth * 100 }%`, `${ evt.offsetY / target.clientHeight * 100 }%`);
  } else {
    activate(`${ evt.offsetX }px`, `${ evt.offsetY }px`);
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

  evt.__svRipplePrevent = true;
  const target = evt.target as HTMLElement;
  if (target != null) {
    activate(`${ evt.offsetX / target.clientWidth * 100 }%`, `${ evt.offsetY / target.clientHeight * 100 }%`);
  } else {
    activate(`${ evt.offsetX }px`, `${ evt.offsetY }px`);
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

  const target = targetFn(el);

  if (target != null) {
    cleanup = () => {
      if (target != null) {
        target.removeEventListener('pointerdown', onPointerdown);
        target.removeEventListener('pointerup', onPointerup);
        target.removeEventListener('keydown', onKeydown);
        target.removeEventListener('keyup', onKeyup);
      }
      cleanup = noop;
    };

    target.addEventListener('pointerdown', onPointerdown);
    target.addEventListener('pointerup', onPointerup);
    target.addEventListener('keydown', onKeydown);
    target.addEventListener('keyup', onKeyup);
  }
}

onMounted(() => {
  setup([ elRef.value, props.disabled, props.target ]);

  watch([ elRef, () => props.disabled, () => props.target ], setup);
});

onUnmounted(cleanup);
</script>

<template>
  <span ref="elRef" class="sv-ripple" />
</template>
