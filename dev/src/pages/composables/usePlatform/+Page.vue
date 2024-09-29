<script setup lang="ts">
import { usePageContext } from 'vike-vue/usePageContext';
import { onMounted, ref } from 'vue';

import { usePlatform } from '$lib/composables';

const { forceUserAgent } = usePageContext();

const {
  hasPointer,
  hasTouch,
  hasHover,
  isDesktop,
  isMobile,
  isStandalone,
  isEmulated,
  isAndroid,
  isIos,
  isLinux,
  isMacos,
  isWindows,
  isChromeos,
  isChrome,
  isFirefox,
  isSafari,
} = usePlatform();

const userAgent = ref(forceUserAgent);
onMounted(() => {
  userAgent.value = navigator.userAgent;
});
</script>

<template>
  <div class="sv-page--padded">
    <h1>usePlatform</h1>
    <div>reqUserAgent: <samp>{{ userAgent }}</samp></div>
    <div class="sv-body-large sv-platform__details">
      <div>
        <div :class="hasPointer ? 'sv-tertiary--text' : 'sv-error--text'">hasPointer: {{ String(hasPointer) }}</div>
        <div :class="hasTouch ? 'sv-tertiary--text' : 'sv-error--text'">hasTouch: {{ String(hasTouch) }}</div>
        <div :class="hasHover ? 'sv-tertiary--text' : 'sv-error--text'">hasHover: {{ String(hasHover) }}</div>
        <hr />
        <div :class="isDesktop ? 'sv-tertiary--text' : 'sv-error--text'">isDesktop: {{ String(isDesktop) }}</div>
        <div :class="isMobile ? 'sv-tertiary--text' : 'sv-error--text'">isMobile: {{ String(isMobile) }}</div>
        <hr />
        <div :class="isStandalone ? 'sv-tertiary--text' : 'sv-error--text'">isStandalone: {{ String(isStandalone) }}</div>
        <div :class="isEmulated ? 'sv-tertiary--text' : 'sv-error--text'">isEmulated: {{ String(isEmulated) }}</div>
      </div>
      <div>
        <div :class="isAndroid ? 'sv-tertiary--text' : 'sv-error--text'">isAndroid: {{ String(isAndroid) }}</div>
        <div :class="isIos ? 'sv-tertiary--text' : 'sv-error--text'">isIos: {{ String(isIos) }}</div>
        <div :class="isLinux ? 'sv-tertiary--text' : 'sv-error--text'">isLinux: {{ String(isLinux) }}</div>
        <div :class="isMacos ? 'sv-tertiary--text' : 'sv-error--text'">isMacos: {{ String(isMacos) }}</div>
        <div :class="isWindows ? 'sv-tertiary--text' : 'sv-error--text'">isWindows: {{ String(isWindows) }}</div>
        <div :class="isChromeos ? 'sv-tertiary--text' : 'sv-error--text'">isChromeos: {{ String(isChromeos) }}</div>
      </div>
      <div>
        <div :class="isChrome ? 'sv-tertiary--text' : 'sv-error--text'">isChrome: {{ String(isChrome) }}</div>
        <div :class="isFirefox ? 'sv-tertiary--text' : 'sv-error--text'">isFirefox: {{ String(isFirefox) }}</div>
        <div :class="isSafari ? 'sv-tertiary--text' : 'sv-error--text'">isSafari: {{ String(isSafari) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.sv-platform
  &__details
    display: flex
    flex-direction: row
    gap: .2em
    margin-block-start: 1rem

    > div > div
      padding: 6px 0
</style>
