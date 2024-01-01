<script setup lang="ts">
import type { PageContext } from 'vike/types';
import { usePageContext } from '$dev/renderer/usePageContext';

const props = defineProps<{
  is404: boolean;
}>();

const ctx = usePageContext() as PageContext;
let { abortReason } = ctx;

if (!abortReason) {
  abortReason = props.is404 ? 'This page could not be found.' : 'Something went wrong.';
}
const heading = props.is404 ? '404 Page Not Found' : '500 Internal Server Error';
</script>

<template>
  <div>
    <h1>{{ heading }}</h1>
    <p>{{ abortReason }}</p>
  </div>
</template>
