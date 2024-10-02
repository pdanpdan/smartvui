<script setup lang="ts">
import { VueKeyboardTrapDirectiveFactory } from '@pdanpdan/vue-keyboard-trap';
import { usePageContext } from 'vike-vue/usePageContext';
import { ref } from 'vue';

import type { SvSurfaceAnimationPropType, SvSurfaceTypeModal as SvSurfaceType } from '$lib/index';

import { SvSurfaceModal, useScreen } from '$lib/index';

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
</script>

<template>
  <div class="sv-page--padded sv-modal">
    <h1>SvSurfaceModal</h1>
    <div>reqViewport: <samp>{{ viewport }}</samp></div>

    <input type="text" class="sv-t--body-large" />

    <div class="sv-t--body-large sv-modal__details">
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
      <button @click="model1 = model1 !== true">Toggle 1 [{{ model1 }}]</button> |
      <button @click="model2 = model2 !== true">Toggle 2 [{{ model2 }}]</button> |
      <button @click="model3 = model3 !== true">Toggle 3 [{{ model3 }}]</button> |
      <button @click="model4 = model4 !== true">Toggle 4 [{{ model4 }}]</button>
    </p>

    <SvSurfaceModal
      v-slot="{ hide }"
      v-model="model1"
      :ssr="ssr"
      escape-close
      backdrop-close
      class="modal-animation modal-animation--bottom"
      @show-start="log"
      @show-end="log"
      @show-cancel="log"
      @hide-start="log"
      @hide-end="log"
      @hide-cancel="log"
    >
      <div
        v-kbd-trap.autofocus
        style="padding: 32px; background-color: #333;"
      >
        <div>
          Some text 1
        </div>
        <textarea class="sv-t--body-large" rows="2" />
        <textarea class="sv-t--body-large" rows="2" autofocus />
        <button @click="hide">Close (fn)</button> |
        <button @click="model1 = false">Close (model)</button> |
        <button @click="model2 = true">Open 2</button> |
        <button @click="model3 = true">Open 3</button>
      </div>
    </SvSurfaceModal>

    <SvSurfaceModal
      v-slot="{ hide }"
      v-model="model2"
      :ssr="ssr"
      class="modal-transition"
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
        <textarea class="sv-t--body-large" rows="4" />
        <textarea class="sv-t--body-large" rows="4" autofocus />
        <button @click="hide">Close (fn)</button> |
        <button @click="model2 = false">Close (model)</button> |
        <button @click="model1 = true">Open 1</button> |
        <button @click="model3 = true">Open 3</button>
      </div>

      <SvSurfaceModal
        v-model="model5"
        :ssr="ssr"
        class="modal-animation modal-animation--top"
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
            <textarea class="sv-t--body-large" rows="4" />
            <textarea class="sv-t--body-large" rows="4" autofocus />
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
      </SvSurfaceModal>
    </SvSurfaceModal>

    <SvSurfaceModal
      v-model="model3"
      :ssr="ssr"
      class="modal-animation modal-animation--top"
      escape-close
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
          <textarea class="sv-t--body-large" rows="4" />
          <textarea class="sv-t--body-large" rows="4" autofocus />
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
    </SvSurfaceModal>

    <SvSurfaceModal
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
    </SvSurfaceModal>

    <input type="text" class="sv-t--body-large" />

    <div class="sv-t--body-large sv-modal__details">
      <div><span>Page:</span> <samp>{{ screen.pageInlineSize }}</samp> <i>x</i> <samp>{{ screen.pageBlockSize }}</samp></div>
      <div><span>Screen:</span> <samp>{{ screen.screenInlineSize }}</samp> <i>x</i> <samp>{{ screen.screenBlockSize }}</samp></div>
      <div><span>Viewport:</span> <samp>{{ screen.viewInlineSize }}</samp> <i>x</i> <samp>{{ screen.viewBlockSize }}</samp></div>
      <div><span>Scroll:</span> <samp>{{ screen.pageInlineStart }}</samp> <i>/</i> <samp>{{ screen.pageBlockStart }}</samp></div>
      <div><span>Scale:</span> <samp>{{ screen.viewScale }}</samp></div>
    </div>

    <textarea class="sv-t--body-large" rows="4" />
  </div>
</template>

<style scoped lang="sass">
.sv-modal
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
:deep(.modal-animation)
  transition: display $time allow-discrete, overlay $time allow-discrete

  &::backdrop
    transition: display $time allow-discrete, overlay $time allow-discrete
    animation: backdrop-hide $time ease-in forwards

  &[data-sv-surface-open]::backdrop
    animation: backdrop-show $time ease-in forwards

:deep(.modal-animation--bottom)
  margin-block-end: 0
  margin-inline-start: 0
  animation: slide-out-bottom $time ease-in, fade-out $time ease-in

  &[data-sv-surface-open]
    animation: slide-in-bottom $time ease-in, fade-in $time ease-in

:deep(.modal-animation--top)
  margin-block-start: 0
  margin-inline-end: 0
  animation: slide-out-top $time ease-in, fade-out $time ease-in

  &[data-sv-surface-open]
    animation: slide-in-top $time ease-in, fade-in $time ease-in

:deep(.modal-transition)
  transition: display $time allow-discrete, overlay $time allow-discrete, transform $time
  transform: scale(.1, .1)

  &[data-sv-surface-open]
    transform: scale(1, 1)

    @starting-style
      transform: scale(.1, .1)

@keyframes slide-in-bottom
  from
    transform: translateY(100%)
  to
    transform: translateY(0)

@keyframes slide-out-bottom
  from
    transform: translateY(0)
  to
    transform: translateY(100%)

@keyframes slide-in-top
  from
    transform: translateY(-100%)
  to
    transform: translateY(0)

@keyframes slide-out-top
  from
    transform: translateY(0)
  to
    transform: translateY(-100%)

@keyframes fade-in
  from
    opacity: 0
  to
    opacity: 1

@keyframes fade-out
  from
    opacity: 1
  to
    opacity: .3

@keyframes backdrop-show
  from
    background-color: rgba(0 0 0 / 0%)
  to
    background-color: rgba(0 0 0 / 50%)

@keyframes backdrop-hide
  from
    background-color: rgba(0 0 0 / 50%)
  to
    background-color: rgba(0 0 0 / 0%)
</style>
