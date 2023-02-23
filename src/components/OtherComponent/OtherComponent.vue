<script setup lang="ts">
import { useMouse } from '@vueuse/core'

const props = defineProps<{
  /**
   * @description Here is description of this prop
   */
  msg?: string
  color?: string
  test?: boolean
}>()

const { x, y } = useMouse()
</script>

<template>
  <div class="the-component">
    <h1>{{ props.msg }} / {{ props.test }}</h1>
    <h2>This is a component use @vueuse/core</h2>
    <span>x: {{ x }}, y: {{ y }}</span>
    <span :class="$style.pdan_module">pdan</span>
  </div>
</template>

<style>
.pdan {
  color: pdan_color
}
</style>

<style module>
.pdan_module {
  color: pdan_color_module
}
</style>

<style scoped>
.pdan_scoped {
  color: v-bind(color)
}
</style>

