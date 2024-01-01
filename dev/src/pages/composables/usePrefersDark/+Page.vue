<script setup lang="ts">
import { useDark } from '$dev/utils/theme';

const { forceDark, isDark } = useDark();
</script>

<template>
  <h1>usePrefersDark</h1>
  <pre>forceDark: {{ String(forceDark) }}</pre>
  <pre>isDark: {{ String(isDark) }}</pre>
</template>
