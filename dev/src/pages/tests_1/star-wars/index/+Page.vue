<script setup lang="ts">
import type { Movie } from '../types';
import Link from '$dev/components/Link.vue';

withDefaults(defineProps<{
  movies: Movie[];
}>(), {
  movies: () => ([]),
});
</script>

<template>
  <h1>Star Wars Movies</h1>
  <ol>
    <li v-for="item in movies" :key="item.id">
      <Link :href="`/tests_1/star-wars/${ item.id }`">{{ item.title }}</Link> ({{ item.release_date }})
    </li>
  </ol>
  <p>Source: <a href="https://star-wars.brillout.com">star-wars.brillout.com</a>.</p>
  <p>Data can be fetched by using the <code>onBeforeRender()</code> hook.</p>
</template>
