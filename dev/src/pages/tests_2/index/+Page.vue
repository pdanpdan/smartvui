<script setup lang="ts">
import CounterButton from '$dev/components/CounterButton.vue';
import InlineCode from '$dev/components/InlineCode.vue';
import { usePageContext } from '$dev/renderer/usePageContext';

const { data } = usePageContext();
</script>

<template>
  <pre>PageContext data: {{ data }}</pre>

  <p>Welcome to a small example project showcasing of some of <InlineCode>vite-plugin-ssr</InlineCode>'s rendering modes. Press any one of them above to see it in action.</p>
  <p>You can also explore this example to learn about rendering modes in general.</p>
  <CounterButton />
</template>
