<script setup lang="ts">
import { SvCard } from '$lib/index';

const classColors = [
  '',
  'sv-primary-container sv-on-primary-container',
  'sv-secondary-container sv-on-secondary-container',
  'sv-tertiary-container sv-on-tertiary-container',
  'sv-error-container sv-on-error-container',
];
</script>

<template>
  <div class="sv-page--padded">
    <h1>SvCard</h1>

    <template v-for="classColor in classColors" :key="classColor">
      <div class="container">
        <SvCard
          class="test"
          :class="classColor"
        >
          Elevated card
        </SvCard>

        <SvCard
          class="test"
          :class="classColor"
          interactive
        >
          Elevated card, Interactive
        </SvCard>

        <SvCard
          class="test"
          :class="classColor"
          disabled
        >
          Elevated card, Disabled
        </SvCard>

        <SvCard
          class="test"
          :class="classColor"
          interactive
          disabled
        >
          Elevated card, Interactive, Disabled
        </SvCard>
      </div>

      <div class="container">
        <SvCard
          class="test"
          :class="classColor"
          aspect="filled"
        >
          Filled card
        </SvCard>

        <SvCard
          class="test"
          :class="classColor"
          aspect="filled"
          interactive
        >
          Filled card, Interactive
        </SvCard>

        <SvCard
          class="test"
          :class="classColor"
          aspect="filled"
          disabled
        >
          Filled card, Disabled
        </SvCard>

        <SvCard
          class="test"
          :class="classColor"
          aspect="filled"
          interactive
          disabled
        >
          Filled card, Interactive, Disabled
        </SvCard>
      </div>

      <div class="container">
        <SvCard
          class="test"
          :class="classColor"
          aspect="outlined"
        >
          Outlined card
        </SvCard>

        <SvCard
          class="test"
          :class="classColor"
          aspect="outlined"
          interactive
        >
          Outlined card, Interactive
        </SvCard>

        <SvCard
          class="test"
          :class="classColor"
          aspect="outlined"
          disabled
        >
          Outlined card, Disabled
        </SvCard>

        <SvCard
          class="test"
          :class="classColor"
          aspect="outlined"
          interactive
          disabled
        >
          Outlined card, Interactive, Disabled
        </SvCard>
      </div>
    </template>
  </div>
</template>

<style lang="sass" scoped>
.container
  display: flex
  flex-wrap: wrap
  align-items: center
  gap: 1.5rem
  margin-block: 1.5rem

.test
  position: relative
  inline-size: 20rem
  block-size: auto
  aspect-ratio: 2/1
  display: flex
  justify-content: center
  align-items: center

  &--square
    aspect-ratio: 1/1

  &--thin
    aspect-ratio: 8/1

  &--round
    aspect-ratio: 1/1
    inline-size: 8rem
    border-radius: 50%
</style>
