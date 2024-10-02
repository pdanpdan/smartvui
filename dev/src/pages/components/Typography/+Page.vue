<script setup lang="ts">
const list = [
  'sv-t--display-large',
  'sv-t--display-medium',
  'sv-t--display-small',
  'sv-t--headline-large',
  'sv-t--headline-medium',
  'sv-t--headline-small',
  'sv-t--title-large',
  'sv-t--title-medium',
  'sv-t--title-small',
  'sv-t--body-large',
  'sv-t--body-medium',
  'sv-t--body-small',
  'sv-t--label-large',
  'sv-t--label-medium',
  'sv-t--label-small',
];
</script>

<template>
  <div class="sv-page--padded">
    <h1>SvCardContent</h1>

    <div class="container">
      <div v-for="c in list" :key="c" class="test sv-bg--surface-container-low sv-t--on-surface" :class="c">
        {{ c }}
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.container
  display: flex
  flex-direction: column
  gap: .5rem

.test
  border-radius: 4px
</style>
