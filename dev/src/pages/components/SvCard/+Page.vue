<script setup lang="ts">
import { SvCard, SvCardContent, SvCardHeader } from '$lib/index';

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
          <SvCardHeader class="sv-t--title-large">Elevated card</SvCardHeader>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          interactive
        >
          <SvCardHeader class="sv-t--title-large">Elevated card</SvCardHeader>
          <SvCardContent class="sv-t--body-large">Button</SvCardContent>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          href="#"
        >
          <SvCardHeader class="sv-t--title-large">Elevated card</SvCardHeader>
          <SvCardContent class="sv-t--body-large">Link</SvCardContent>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          disabled
        >
          <template #layer-bottom>
            <div class="sv-c--on-tertiary-container" style="position: absolute; inset: auto 8px 8px auto">disabled</div>
          </template>

          <SvCardHeader class="sv-t--title-large">Elevated card</SvCardHeader>
          <SvCardContent class="sv-t--body-large">Disabled</SvCardContent>
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
          <SvCardHeader class="sv-t--title-large">Filled card</SvCardHeader>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          variant="filled"
          interactive
        >
          <SvCardHeader class="sv-t--title-large">Filled card</SvCardHeader>
          <SvCardContent class="sv-t--body-large">Button</SvCardContent>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          variant="filled"
          href="#"
        >
          <SvCardHeader class="sv-t--title-large">Filled card</SvCardHeader>
          <SvCardContent class="sv-t--body-large">Link</SvCardContent>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          variant="filled"
          disabled
        >
          <template #layer-bottom>
            <div class="sv-c--on-tertiary-container" style="position: absolute; inset: auto 8px 8px auto">disabled</div>
          </template>

          <SvCardHeader class="sv-t--title-large">Filled card</SvCardHeader>
          <SvCardContent class="sv-t--body-large">Disabled</SvCardContent>
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
          <SvCardHeader class="sv-t--title-large">Outlined card</SvCardHeader>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          variant="outlined"
          interactive
        >
          <SvCardHeader class="sv-t--title-large">Outlined card</SvCardHeader>
          <SvCardContent class="sv-t--body-large">Button</SvCardContent>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          variant="outlined"
          href="#"
        >
          <SvCardHeader class="sv-t--title-large">Outlined card</SvCardHeader>
          <SvCardContent class="sv-t--body-large">Link</SvCardContent>
        </SvCard>

        <SvCard
          class="test"
          :class="color"
          variant="outlined"
          disabled
        >
          <template #layer-bottom>
            <div class="sv-c--on-tertiary-container" style="position: absolute; inset: auto 8px 8px auto">disabled</div>
          </template>

          <SvCardHeader class="sv-t--title-large">Outlined card</SvCardHeader>
          <SvCardContent class="sv-t--body-large">Disabled</SvCardContent>
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
</style>
