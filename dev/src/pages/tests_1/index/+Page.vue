<script setup lang="ts">
import { navigate } from 'vike/client/router';
import CounterButton from '$dev/components/CounterButton.vue';
import normalizeUrl from '$dev/utils/normalizeUrl';
import { usePageContext } from '$dev/renderer/usePageContext';

function randomNavigation() {
  const randomIndex = Math.floor(Math.random() * 3);
  navigate(normalizeUrl([ '/tests_1/markdown', '/tests_1/star-wars', '/tests_1/hello/alice' ][ randomIndex ]));
}

const { data } = usePageContext();
</script>

<template>
  <h1 class="pb-4 text-3xl font-bold">My Vike app</h1>

  <pre>PageContext data: {{ data }}</pre>

  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive. <CounterButton /></li>
  </ul>
  <p>
    <button tabindex="0" class="sv-btn--accent" @click="randomNavigation">Random Page</button>
  </p>
</template>
