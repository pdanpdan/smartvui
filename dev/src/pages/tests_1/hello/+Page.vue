<script setup lang="ts">
import Link from '$dev/components/Link.vue';

defineProps<{
  name: string;
}>();
</script>

<template>
  <h1>Hello</h1>
  <p>
    Hi <b>{{ name }}</b>.
  </p>
  <ul>
    <li>
      <Link href="/tests_1/hello/eli">
        /hello/eli
      </Link>
    </li>
    <li>
      <Link href="/tests_1/hello/jon">/hello/jon</Link>
    </li>
  </ul>
  <p>
    Parameterized routes can be defined by exporting a route string in
    <code>+route.ts</code>.
  </p>
</template>
