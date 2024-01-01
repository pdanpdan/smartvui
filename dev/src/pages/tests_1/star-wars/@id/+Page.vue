<script setup lang="ts">
import type { MovieDetails } from '../types';

withDefaults(defineProps<{
  movie: MovieDetails;
}>(), {
  movie: () => ({} as MovieDetails),
});
</script>

<template>
  <h1>{{ movie.title }}</h1>
  Release Date: {{ movie.release_date }}
  <br />
  Director: {{ movie.director }}
  <br />
  Producer: {{ movie.producer }}
</template>
