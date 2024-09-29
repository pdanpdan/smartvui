<script setup lang="ts">
import type { PageContext } from 'vike/types';

import { usePageContext } from 'vike-vue/usePageContext';

const ctx = usePageContext() as PageContext;
let { abortReason, is404 } = ctx;

if (!abortReason) {
  abortReason = is404 ? 'This page could not be found.' : 'Something went wrong.';
}
const heading = is404 ? '404 Page Not Found' : '500 Internal Server Error';
</script>

<template>
  <div class="sv-page--padded">
    <h1>{{ heading }}</h1>
    <p>{{ abortReason }}</p>
  </div>
</template>
