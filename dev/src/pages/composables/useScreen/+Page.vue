<script setup lang="ts">
import { usePageContext } from 'vike-vue/usePageContext';
import { nextTick, ref } from 'vue';

import { useScreen } from '$lib/composables';

const { viewport } = usePageContext();

const screen = useScreen();
const { scrollLockRequested } = screen;
const addScroll = ref<boolean>(false);

function onScrollToBottom() {
  addScroll.value = true;
  nextTick(() => {
    screen.onScrollUnlocked(() => {
      const target = document.querySelector('.bottom-scroll');
      target?.scrollIntoView();
    });
  });
}
</script>

<template>
  <div class="sv-page--padded sv-screen">
    <h1>useScreen</h1>
    <div>reqViewport: <samp>{{ viewport }}</samp></div>

    <input type="text" class="sv-body-large" />

    <div class="sv-body-large sv-screen__details">
      <div><span>Page:</span> <samp>{{ screen.pageInlineSize }}</samp> <i>x</i> <samp>{{ screen.pageBlockSize }}</samp></div>
      <div><span>Screen:</span> <samp>{{ screen.screenInlineSize }}</samp> <i>x</i> <samp>{{ screen.screenBlockSize }}</samp></div>
      <div><span>Viewport:</span> <samp>{{ screen.viewInlineSize }}</samp> <i>x</i> <samp>{{ screen.viewBlockSize }}</samp></div>
      <div><span>Gutter:</span> <samp>{{ screen.scrollInlineGutter }}</samp> <i>/</i> <samp>{{ screen.scrollBlockGutter }}</samp></div>
      <div><span>Scroll:</span> <samp>{{ screen.pageInlineStart }}</samp> <i>/</i> <samp>{{ screen.pageBlockStart }}</samp></div>
      <div><span>Scale:</span> <samp>{{ screen.viewScale }}</samp></div>
      <div><span>Kbd:</span> <samp>{{ String(screen.virtualKeyboardOpen.value) }}</samp></div>
      <div><span>ScrLock:</span> <samp>{{ screen.scrollLocked.value ? 'LOCKED' : 'UNLOCKED' }}</samp></div>
      <div><span>ScrLockReq:</span> <samp>{{ screen.scrollLockRequested.value ? 'YES' : 'NO' }}</samp></div>
      <div :style="addScroll ? 'text-align: center' : ''">
        <button type="button" @click="scrollLockRequested = true">Lock</button> |
        <button type="button" @click="scrollLockRequested = false">Unlock</button>
      </div>

      <textarea rows="5" />

      <div :style="addScroll ? 'text-align: center' : ''">
        <button type="button" @click="addScroll = addScroll !== true">Add / remove content</button> |
        <button type="button" @click="onScrollToBottom">Scroll to bottom after unlock</button>
      </div>

      <template v-if="addScroll">
        <div v-for="i in 100" :key="i" style="width: 120vw">Row {{ i }} with some content. Forces width overflow.</div>

        <div class="bottom-scroll" :style="addScroll ? 'text-align: center' : ''">
          <button type="button" @click="scrollLockRequested = true">Lock</button> |
          <button type="button" @click="scrollLockRequested = false">Unlock</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="sass">
.sv-screen
  input[type="text"],
  textarea
    display: block
    padding: 4px 8px
    margin-block: 16px
    min-inline-size: 30ch

  input[type="checkbox"]
    inline-size: 24px
    block-size: 24px
    vertical-align: middle
    margin-inline: 16px

  input,
  textarea
    font-size: 16px

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
</style>
