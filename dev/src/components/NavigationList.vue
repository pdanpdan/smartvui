<script setup lang="ts">
import type { ILinkItem } from '$dev/utils/menuStructure';

import Link from '$dev/components/Link.vue';

defineProps<{
  links: ILinkItem[];
}>();
</script>

<template>
  <ul class="sv-navigation-list">
    <li v-for="({ url, name, children }, i) in links" :key="i">
      <Link :href="url" :exact="url === '/'">{{ name }}</Link>

      <NavigationList v-if="children" :links="children" />
    </li>
  </ul>
</template>

<style scoped lang="sass">
ul
  list-style: none
  padding: 0
  margin: 0

li > ul
  padding-inline-start: 1.5rem

  > li
    position: relative

    &:before,
    &:after
      content: ''
      display: block
      position: absolute
      inset-inline-start: -1rem
      inset-block-start: 0
      inline-size: .8rem
      block-size: 1.05rem
      border: 0 solid currentColor
      opacity: .5

    &:before
      border-inline-start-width: 1px

    &:after
      border-block-end-width: 1px

    &:has(+ li):before
      inset-block-end: 0
      block-size: auto

.sv-link
  display: flex
</style>
