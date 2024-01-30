<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePlatform } from '$lib/composables';

import { usePageContext } from '$dev/renderer/usePageContext';

const { userAgent: userAgentReq } = usePageContext();

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
} = usePlatform({ forceUserAgent: userAgentReq });

const userAgent = ref(userAgentReq);
onMounted(() => {
  userAgent.value = navigator.userAgent;
});
</script>

<template>
  <h1>usePlatform</h1>
  <div>{{ userAgent }}</div>
  <div style="display: flex; flex-direction: row; gap: 1em; margin: 1em">
    <div>
      <div :style="{ color: hasPointer ? 'green' : 'red' }">hasPointer: {{ String(hasPointer) }}</div>
      <div :style="{ color: hasTouch ? 'green' : 'red' }">hasTouch: {{ String(hasTouch) }}</div>
      <div :style="{ color: hasHover ? 'green' : 'red' }">hasHover: {{ String(hasHover) }}</div>
      <hr />
      <div :style="{ color: isDesktop ? 'green' : 'red' }">isDesktop: {{ String(isDesktop) }}</div>
      <div :style="{ color: isMobile ? 'green' : 'red' }">isMobile: {{ String(isMobile) }}</div>
      <hr />
      <div :style="{ color: isStandalone ? 'green' : 'red' }">isStandalone: {{ String(isStandalone) }}</div>
      <div :style="{ color: isEmulated ? 'green' : 'red' }">isEmulated: {{ String(isEmulated) }}</div>
    </div>
    <div>
      <div :style="{ color: isAndroid ? 'green' : 'red' }">isAndroid: {{ String(isAndroid) }}</div>
      <div :style="{ color: isIos ? 'green' : 'red' }">isIos: {{ String(isIos) }}</div>
      <div :style="{ color: isLinux ? 'green' : 'red' }">isLinux: {{ String(isLinux) }}</div>
      <div :style="{ color: isMacos ? 'green' : 'red' }">isMacos: {{ String(isMacos) }}</div>
      <div :style="{ color: isWindows ? 'green' : 'red' }">isWindows: {{ String(isWindows) }}</div>
      <div :style="{ color: isChromeos ? 'green' : 'red' }">isChromeos: {{ String(isChromeos) }}</div>
    </div>
    <div>
      <div :style="{ color: isChrome ? 'green' : 'red' }">isChrome: {{ String(isChrome) }}</div>
      <div :style="{ color: isFirefox ? 'green' : 'red' }">isFirefox: {{ String(isFirefox) }}</div>
      <div :style="{ color: isSafari ? 'green' : 'red' }">isSafari: {{ String(isSafari) }}</div>
    </div>
  </div>
</template>
