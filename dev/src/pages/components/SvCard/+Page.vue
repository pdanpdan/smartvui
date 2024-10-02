<script setup lang="ts">
import { SvCard } from '$lib/index';

const colors = [
  'sv-c--on-surface',
  'sv-bg--surface-container-lowest sv-c--on-surface',
  'sv-bg--surface-container-low sv-c--on-surface',
  'sv-bg--surface-container sv-c--on-surface',
  'sv-bg--surface-container-high sv-c--on-surface',
  'sv-bg--surface-container-highest sv-c--on-surface',
  'sv-bg--primary-container sv-c--on-primary-container',
  'sv-bg--secondary-container sv-c--on-secondary-container',
  'sv-bg--tertiary-container sv-c--on-tertiary-container',
  'sv-bg--error-container sv-c--on-error-container',
];
</script>

<template>
  <div class="sv-page--padded">
    <h1>SvCard</h1>

    <template v-for="color in colors" :key="color">
      <div class="sv-t--title-large sv-c--on-surface">Color: {{ color }}</div>
      <div class="container">
        <SvCard
          class="test"
          :class="color"
        >
          <div data-sv-full-width>Elevated card</div>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          interactive
        >
          <div data-sv-full-width>Elevated card</div>
          <div>Button</div>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          href="#"
        >
          <div data-sv-full-width>Elevated card</div>
          <div>Link</div>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          disabled
        >
          <div data-sv-full-width>Elevated card</div>
          <div>Disabled</div>
        </SvCard>
      </div>
    </template>

    <template v-for="color in colors" :key="color">
      <div class="sv-t--title-large sv-c--on-surface">Color: {{ color }}</div>
      <div class="container">
        <SvCard
          class="test"
          :class="color"
          variant="filled"
        >
          <div data-sv-full-width>Filled card</div>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          variant="filled"
          interactive
        >
          <div data-sv-full-width>Filled card</div>
          <div>Button</div>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          variant="filled"
          href="#"
        >
          <div data-sv-full-width>Filled card</div>
          <div>Link</div>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          variant="filled"
          disabled
        >
          <div data-sv-full-width>Filled card</div>
          <div>Disabled</div>
        </SvCard>
      </div>
    </template>

    <template v-for="color in colors" :key="color">
      <div class="sv-t--title-large sv-c--on-surface">Color: {{ color }}</div>
      <div class="container">
        <SvCard
          class="test"
          :class="color"
          variant="outlined"
        >
          <div data-sv-full-width>Outlined card</div>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          variant="outlined"
          interactive
        >
          <div data-sv-full-width>Outlined card</div>
          <div>Button</div>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          variant="outlined"
          href="#"
        >
          <div data-sv-full-width>Outlined card</div>
          <div>Link</div>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          variant="outlined"
          disabled
        >
          <div data-sv-full-width>Outlined card</div>
          <div>Disabled</div>
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
  justify-content: stretch
  gap: 1.5rem
  margin-block: 1.5rem

.test
  flex: 1 0 1px
  min-inline-size: 10rem
  max-inline-size: 50%
  block-size: auto
  aspect-ratio: 2/1
  font-size: 18px

  &--square
    aspect-ratio: 1/1

  &--thin
    aspect-ratio: 8/1

  &--round
    aspect-ratio: 1/1
    inline-size: 8rem
    border-radius: 50%

[data-sv-full-width]
  grid-column: full-width
  background-color: rgba(128, 128, 128, .2)
  text-align: center
  border-start-start-radius: inherit
  border-start-end-radius: inherit
  padding-block: 8px
  margin-block-end: 8px
</style>
