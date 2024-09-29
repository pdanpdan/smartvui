<script setup lang="ts">
import { usePageContext } from 'vike-vue/usePageContext';
import { computed } from 'vue';

import normalizeUrl from '$dev/utils/normalizeUrl';

const props = defineProps<{
  href?: string;
  exact?: boolean;
}>();

const ctx = usePageContext();

const normalizedHref = computed(() => typeof props.href === 'string' ? normalizeUrl(props.href) : undefined);
const classes = computed(() => {
  if (typeof props.href !== 'string') {
    return 'sv-link--disabled';
  }

  const { urlPathname } = ctx;
  const isActive = props.exact
    ? `${ urlPathname }/`.startsWith(`${ props.href }/`)
    : urlPathname.startsWith(props.href);

  return isActive ? 'sv-link--enabled sv-link--active' : 'sv-link--enabled';
});
</script>

<template>
  <a class="sv-link" :class="classes" :href="normalizedHref">
    <slot />
  </a>
</template>

<style scoped lang="sass">
.sv-link
  padding-inline: .25rem
  line-height: 2rem
  color: currentColor

  &--enabled
    text-decoration: underline
    text-decoration-thickness: 1px
    text-decoration-style: dashed
    text-decoration-color: currentColor
    text-underline-offset: 6px

    &:hover
      text-decoration-thickness: 2px

  &--active
    text-decoration-style: solid
</style>
