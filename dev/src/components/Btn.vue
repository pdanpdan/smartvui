<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<{
  icon?: boolean;
  theme?: 'standard' | 'outlined' | 'filled' | 'filled-tonal';
  href?: string;
  noRipple?: boolean;
}>(), {
  theme: 'standard',
  href: undefined,
});

const modelValue = defineModel<boolean | null>({ default: null });

const attrs = useAttrs();

const tagName = computed(() => typeof props.href === 'string' && props.href.trim().length > 0 ? 'a' : 'button');

const showRipple = computed(() => props.noRipple !== true && (attrs.disabled === undefined || attrs.disabled === 'false'));

const classes = computed(() => ({
  'sv-btn': true,
  [ `sv-btn--${ modelValue.value !== true ? 'un' : '' }selected` ]: modelValue.value !== null,
  'sv-btn--icon': props.icon,
  [ `sv-btn--${ props.theme }` ]: true,
}));

const bindProps = computed(() => ({
  tabindex: 0,
  ...(tagName.value === 'button' ? { type: 'button' } : undefined),
  ...attrs,
  class: [ classes.value, attrs.class ],
  ...(showRipple.value === true ? { onPointerdown: setRippleOrigin } : undefined),
  ...(modelValue.value !== null ? { onClick: toggleModel } : undefined),
}));

function setRippleOrigin(ev: PointerEvent) {
  if (ev.target) {
    const { style } = ev.target as HTMLElement;
    style.setProperty('--sv-ripple-x', `${ ev.offsetX }px`);
    style.setProperty('--sv-ripple-y', `${ ev.offsetY }px`);

    const { classList } = (ev.target as HTMLElement).querySelector('.sv-btn__state') as HTMLElement;
    classList.add('sv-ripple--enabled');
    requestAnimationFrame(() => {
      classList.remove('sv-ripplex--enabled');
    });
  }

  if (typeof attrs.onPointerdown === 'function') {
    attrs.onPointerdown(ev);
  }
}

function toggleModel(ev: unknown) {
  modelValue.value = modelValue.value !== true;

  if (typeof attrs.onClick === 'function') {
    attrs.onClick(ev);
  }
}
</script>

<template>
  <component :is="tagName" v-bind="bindProps">
    <div class="sv-btn__state" :class="{ 'sv-ripplex': showRipple }">
      <div class="sv-btn__outline" />
      <slot />
    </div>
  </component>
</template>

<style scoped lang="sass">
.sv-btn
  display: inline-flex
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)
  transition-duration: 300ms

  &__state
    position: relative
    overflow: hidden
    display: inline-flex
    border-radius: inherit

    &:before
      position: absolute
      inset: 0
      content: ""

  &__outline
    position: absolute
    inset: 0
    border-radius: inherit

  > :deep(*)
    pointer-events: none

  &--unselected
    --sv-text-opacity: 1
    color: rgb(163 163 163 / var(--sv-text-opacity))

  &--icon
    outline: none
    border-radius: 50%
    padding: 0

    > .sv-btn__state
      padding: .5rem
      margin: .25rem
      user-select: none

    &:enabled
      cursor: pointer

    &:disabled
      cursor: default

      > .sv-btn__state
        opacity: .38

  &--standard,
  &--outlined
    background-color: transparent

    > .sv-btn__state:before
      --sv-bg-opacity: 1
      background-color: rgb(163 163 163 / var(--sv-bg-opacity))
      opacity: 0
      transition: opacity .3s

    &.sv-btn--selected > .sv-btn__state:before
      background-color: currentColor

    &:enabled
      &:hover
        > .sv-btn__state:before
          opacity: .08
      &:focus-visible,
      &:active
        > .sv-btn__state:before
          opacity: .1

  &--outlined
    > .sv-btn__state > .sv-btn__outline
      border-width: 1px
      border-color: currentColor

    &:disabled > .sv-btn__state > .sv-btn__outline
      opacity: .32

    // &--filled

// [ 'sv-btn', 'bg-primary c-paper-primary px-4 py-1 rounded inline-block cursor-pointer outline-offset-2 transition-colors hover:enabled:(bg-opacity-90) disabled:(cursor-default opacity-50)' ],
// [ 'sv-btn--accent', 'bg-accent c-paper-primary px-4 py-1 rounded inline-block cursor-pointer outline-offset-2 transition-colors hover:enabled:(bg-opacity-90) disabled:(cursor-default opacity-50)' ],
// [ 'sv-btn--icon', 'bg-transparent c-primary pa-1 b-rd-50% inline-block cursor-pointer outline-offset-2 transition-colors hover:enabled:(c-opacity-80) disabled:(cursor-default opacity-50) select-none' ],
// [ 'sv-btn--icon--accent', 'c-accent pa-2 b-rd-50% inline-block cursor-pointer outline-offset-2 transition-colors hover:enabled:(c-opacity-80) disabled:(cursor-default opacity-50) select-none' ],

.sv-ripplex
  &:after
    position: absolute
    block-size: 100%
    inline-size: 100%
    opacity: 0
    content: ""
    background-image: radial-gradient(circle, currentColor 10%, transparent 10.01%)
    background-repeat: no-repeat
    inset-inline-start: calc(var(--sv-ripple-x, 0) - 50%)
    inset-block-start: calc(var(--sv-ripple-y, 0) - 50%)
    transform: scale(20, 20)
    transition: transform 1s, opacity 1s

  &--enabled:after
    opacity: .2
    transform: scale(0, 0)
    transition: 0s
</style>
