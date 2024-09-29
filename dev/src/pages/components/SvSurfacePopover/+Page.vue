<script setup lang="ts">
import { autoUpdate, offset, shift, useFloating } from '@floating-ui/vue';
import { VueKeyboardTrapDirectiveFactory } from '@pdanpdan/vue-keyboard-trap';
import { usePageContext } from 'vike-vue/usePageContext';
import { computed, ref, useTemplateRef } from 'vue';

import type { SvSurfaceAnimationPropType, SvSurfaceTypePopover as SvSurfaceType } from '$lib/index';

import { SvSurfacePopover, useScreen } from '$lib/index';

const { viewport } = usePageContext();

const screen = useScreen();
const { scrollLockRequested } = screen;
const vKbdTrap = VueKeyboardTrapDirectiveFactory().directive;

const model1 = ref<boolean>(false);
const model2 = ref<boolean>(false);
const model3 = ref<boolean>(false);
const model4 = ref<boolean>(false);
const model5 = ref<boolean>(false);

const ssr = false;

function log(evt: unknown) {
  console.info(evt);
}

const counter = ref<number | 'ready'>('ready');
const animationWait: SvSurfaceAnimationPropType<SvSurfaceType> = ({ target }) => {
  counter.value = 0;
  return () => new Promise((resolve) => {
    const cancel = setInterval(() => {
      if (typeof counter.value !== 'number' || counter.value >= 10) {
        counter.value = 'ready';
        clearInterval(cancel);
        resolve(undefined);
      } else {
        counter.value = counter.value + 1;
        if (target.value) {
          const v = 255 - 10 * counter.value;
          target.value.style.color = `rgb(255 ${ v } ${ v })`;
        }
      }
    }, 100);
  });
};

const popover1RefAnchor = useTemplateRef<HTMLButtonElement>('popover1Anchor');
const popover1RefComponent = useTemplateRef<InstanceType<typeof SvSurfacePopover>>('popover1Component');
const popover1Styles = useFloating(popover1RefAnchor, computed(() => popover1RefComponent.value?.surfaceRef), {
  strategy: 'absolute',
  placement: 'bottom-start',
  middleware: [ offset(10), shift() ],
  whileElementsMounted: autoUpdate,
}).floatingStyles;
</script>

<template>
  <div class="sv-page--padded sv-popover">
    <h1>SvSurfacePopover</h1>
    <div>reqViewport: <samp>{{ viewport }}</samp></div>

    <input type="text" class="sv-body-large" />

    <div class="sv-body-large sv-popover__details">
      <div><span>Page:</span> <samp>{{ screen.pageInlineSize }}</samp> <i>x</i> <samp>{{ screen.pageBlockSize }}</samp></div>
      <div><span>Screen:</span> <samp>{{ screen.screenInlineSize }}</samp> <i>x</i> <samp>{{ screen.screenBlockSize }}</samp></div>
      <div><span>Viewport:</span> <samp>{{ screen.viewInlineSize }}</samp> <i>x</i> <samp>{{ screen.viewBlockSize }}</samp></div>
      <div><span>Gutter:</span> <samp>{{ screen.scrollInlineGutter }}</samp> <i>/</i> <samp>{{ screen.scrollBlockGutter }}</samp></div>
      <div><span>Scroll:</span> <samp>{{ screen.pageInlineStart }}</samp> <i>/</i> <samp>{{ screen.pageBlockStart }}</samp></div>
      <div><span>Scale:</span> <samp>{{ screen.viewScale }}</samp></div>
      <div><span>Kbd:</span> <samp>{{ String(screen.virtualKeyboardOpen.value) }}</samp></div>
      <div><span>ScrLock:</span> <samp>{{ screen.scrollLocked.value ? 'LOCKED' : 'UNLOCKED' }}</samp></div>
      <div><span>ScrLockReq:</span> <samp>{{ screen.scrollLockRequested.value ? 'YES' : 'NO' }}</samp></div>
      <div>
        <button type="button" @click="scrollLockRequested = true">Lock</button> |
        <button type="button" @click="scrollLockRequested = false">Unlock</button>
      </div>
    </div>

    <p>
      <button ref="popover1Anchor" @click="model1 = model1 !== true">Toggle 1 [{{ model1 }}]</button> |
      <button @click="model2 = model2 !== true">Toggle 2 [{{ model2 }}]</button> |
      <button @click="model3 = model3 !== true">Toggle 3 [{{ model3 }}]</button> |
      <button @click="model4 = model4 !== true">Toggle 4 [{{ model4 }}]</button>
    </p>

    <SvSurfacePopover
      v-slot="{ hide, isAnimating }"
      ref="popover1Component"
      v-model="model1"
      :ssr="ssr"
      escape-close
      :style="popover1Styles"
      @show-start="log"
      @show-end="log"
      @show-cancel="log"
      @hide-start="log"
      @hide-end="log"
      @hide-cancel="log"
    >
      <div
        v-kbd-trap.autofocus
        :class="isAnimating ? `animate-${ isAnimating }` : ''"
        style="padding: 32px; background-color: #333;"
      >
        <div>
          Some text 1
        </div>
        <textarea class="sv-body-large" rows="2" />
        <textarea class="sv-body-large" rows="2" autofocus />
        <button @click="hide">Close (fn)</button> |
        <button @click="model1 = false">Close (model)</button> |
        <button @click="model2 = true">Open 2</button> |
        <button @click="model3 = true">Open 3</button>
      </div>
    </SvSurfacePopover>

    <SvSurfacePopover
      v-slot="{ hide }"
      v-model="model2"
      :ssr="ssr"
      escape-close
      @show-start="log"
      @show-end="log"
      @show-cancel="log"
      @hide-start="log"
      @hide-end="log"
      @hide-cancel="log"
    >
      <div
        v-kbd-trap.autofocus
        style="padding: 32px; background-color: #533;"
      >
        <div>
          Some text 2
        </div>
        <textarea class="sv-body-large" rows="4" />
        <textarea class="sv-body-large" rows="4" autofocus />
        <button @click="hide">Close (fn)</button> |
        <button @click="model2 = false">Close (model)</button> |
        <button @click="model1 = true">Open 1</button> |
        <button @click="model3 = true">Open 3</button>
      </div>

      <SvSurfacePopover
        v-model="model5"
        :ssr="ssr"
        @show-start="log"
        @show-end="log"
        @show-cancel="log"
        @hide-start="log"
        @hide-end="log"
        @hide-cancel="log"
      >
        <template #default="{ hide: hideInner }">
          <div
            v-kbd-trap.autofocus
            style="padding: 32px; background-color: #335;"
          >
            <div>
              Some text 5
            </div>
            <textarea class="sv-body-large" rows="4" />
            <textarea class="sv-body-large" rows="4" autofocus />
            <button @click="hideInner">Close (fn)</button> |
            <button @click="model5 = false">Close (model)</button> |
          </div>
        </template>

        <template #activator="{ show: showInner, hide: hideInner, toggle: toggleInner, isOpen: isOpenInner }">
          <p style="background-color: #333; display: inline-block; padding: 8px">
            <button type="button" @click="showInner">Open 5</button> |
            <button type="button" @click="hideInner">Close 5</button> |
            <button type="button" @click="toggleInner">Toggle 5</button>
            {{ isOpenInner ? 'OPEN' : 'CLOSED' }}
          </p>
        </template>
      </SvSurfacePopover>
    </SvSurfacePopover>

    <SvSurfacePopover
      v-model="model3"
      :ssr="ssr"
      escape-close
      backdrop-close
      @show-start="log"
      @show-end="log"
      @show-cancel="log"
      @hide-start="log"
      @hide-end="log"
      @hide-cancel="log"
    >
      <template #default="{ hide }">
        <div
          v-kbd-trap.autofocus
          style="padding: 32px; background-color: #335;"
        >
          <div>
            Some text 3
          </div>
          <textarea class="sv-body-large" rows="4" />
          <textarea class="sv-body-large" rows="4" autofocus />
          <button @click="hide">Close (fn)</button> |
          <button @click="model3 = false">Close (model)</button> |
          <button @click="model1 = true">Open 1</button> |
          <button @click="model2 = true">Open 2</button>
        </div>
      </template>

      <template #activator="{ show, hide, toggle, isOpen }">
        <p>
          <button type="button" @click="show">Open 3</button> |
          <button type="button" @click="hide">Close 3</button> |
          <button type="button" @click="toggle">Toggle 3</button>
          {{ isOpen ? 'OPEN' : 'CLOSED' }}
        </p>
      </template>
    </SvSurfacePopover>

    <SvSurfacePopover
      v-slot="{ hide, isAnimating }"
      v-model="model4"
      :ssr="ssr"
      :animation-wait="animationWait"
      @show-start="log"
      @show-end="log"
      @show-cancel="log"
      @hide-start="log"
      @hide-end="log"
      @hide-cancel="log"
    >
      <div
        v-kbd-trap.autofocus
        style="padding: 32px; background-color: #533;"
      >
        <div>
          Some text 4
        </div>
        <p>
          Animation: {{ isAnimating }} [{{ counter }}]
        </p>
        <button @click="hide">Close</button>
      </div>
    </SvSurfacePopover>

    <input type="text" class="sv-body-large" />

    <div class="sv-body-large sv-popover__details">
      <div><span>Page:</span> <samp>{{ screen.pageInlineSize }}</samp> <i>x</i> <samp>{{ screen.pageBlockSize }}</samp></div>
      <div><span>Screen:</span> <samp>{{ screen.screenInlineSize }}</samp> <i>x</i> <samp>{{ screen.screenBlockSize }}</samp></div>
      <div><span>Viewport:</span> <samp>{{ screen.viewInlineSize }}</samp> <i>x</i> <samp>{{ screen.viewBlockSize }}</samp></div>
      <div><span>Scroll:</span> <samp>{{ screen.pageInlineStart }}</samp> <i>/</i> <samp>{{ screen.pageBlockStart }}</samp></div>
      <div><span>Scale:</span> <samp>{{ screen.viewScale }}</samp></div>
    </div>

    <textarea class="sv-body-large" rows="4" />
  </div>
</template>

<style scoped lang="sass">
.sv-popover
  input[type="text"],
  textarea
    display: block
    padding: 4px 8px
    margin-block: 16px
    min-inline-size: 30ch

  &__details
    margin-block-start: 16px

    > div
      padding: 6px 0

    span
      display: inline-block
      min-inline-size: 10ch

    samp
      display: inline-block
      min-inline-size: 6ch
      text-align: end

    i
      display: inline-block
      min-inline-size: 4ch
      text-align: end

$time: 300ms
:deep(.animate-show)
  animation-name: animateShow
  animation-timing-function: cubic-bezier(0.250, 0.460, 0.450, 0.940)
  animation-duration: $time
  animation-fill-mode: both
  transform-origin: 0 0

:deep(.animate-hide)
  animation-name: animateHide
  animation-timing-function: cubic-bezier(0.550, 0.085, 0.680, 0.530)
  animation-duration: $time
  animation-fill-mode: both
  transform-origin: 0 0

@keyframes animateShow
  from
    transform: scale(0)
    opacity: 1

  to
    transform: scale(1)
    opacity: 1

@keyframes animateHide
  from
    transform: scale(1)
    opacity: 1

  to
    transform: scale(0)
    opacity: 1
</style>
