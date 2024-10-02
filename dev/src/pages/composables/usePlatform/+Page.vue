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
    <div class="sv-t--body-large sv-platform__details">
      <div>
        <div :class="hasPointer ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">hasPointer: {{ String(hasPointer) }}</div>
        <div :class="hasTouch ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">hasTouch: {{ String(hasTouch) }}</div>
        <div :class="hasHover ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">hasHover: {{ String(hasHover) }}</div>
        <hr />
        <div :class="isDesktop ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isDesktop: {{ String(isDesktop) }}</div>
        <div :class="isMobile ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isMobile: {{ String(isMobile) }}</div>
        <hr />
        <div :class="isStandalone ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isStandalone: {{ String(isStandalone) }}</div>
        <div :class="isEmulated ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isEmulated: {{ String(isEmulated) }}</div>
      </div>
      <div>
        <div :class="isAndroid ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isAndroid: {{ String(isAndroid) }}</div>
        <div :class="isIos ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isIos: {{ String(isIos) }}</div>
        <div :class="isLinux ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isLinux: {{ String(isLinux) }}</div>
        <div :class="isMacos ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isMacos: {{ String(isMacos) }}</div>
        <div :class="isWindows ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isWindows: {{ String(isWindows) }}</div>
        <div :class="isChromeos ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isChromeos: {{ String(isChromeos) }}</div>
      </div>
      <div>
        <div :class="isChrome ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isChrome: {{ String(isChrome) }}</div>
        <div :class="isFirefox ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isFirefox: {{ String(isFirefox) }}</div>
        <div :class="isSafari ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isSafari: {{ String(isSafari) }}</div>
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
