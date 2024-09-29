<script setup lang="ts">
const props = defineProps({
  s: {
    type: String,
    required: true,
  },
  hue: {
    type: String,
    required: false,
    default: '0',
  },
});
</script>

<template>
  <span class="help-step">
    {{ props.s }}
  </span>
</template>

<style scoped lang="sass">
@function hsl($h, $s, $l)
  @return unquote('hsl(#{$h}, #{$s}, #{$l})')

.help-step
  display: inline-grid
  place-items: center
  inline-size: 20px
  block-size: 20px
  margin-block-start: -2px
  margin-inline-end: 3px
  border-radius: 10px
  background-color: hsl(v-bind('props.hue'), 50%, 45%)
  color: white
  font-weight: bold
  font-size: 0.7em
  vertical-align: middle
  line-height: 0
</style>
