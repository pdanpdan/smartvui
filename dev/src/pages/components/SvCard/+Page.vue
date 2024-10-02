<script setup lang="ts">
import { SvCard } from '$lib/index';

const surfaces = [
  'sv-surface-container-lowest',
  'sv-surface-container-low',
  'sv-surface-container',
  'sv-surface-container-high',
  'sv-surface-container-highest',
];

const colors = [
  'primary',
  'secondary',
  'tertiary',
  'error',
];
</script>

<template>
  <div class="sv-page--padded">
    <h1>SvCard</h1>

    <template v-for="surface in surfaces" :key="surface">
      <template v-for="color in colors" :key="color">
        <div class="container">
          <SvCard
            class="test"
            :class="`${ surface } sv-${ color }--text`"
          >
            <div data-sv-full-width>Elevated card</div>
          </SvCard>

          <SvCard
            class="test"
            :class="`${ surface } sv-${ color }--text`"
            interactive
          >
            <div data-sv-full-width>Elevated card</div>
            <div>Interactive</div>
          </SvCard>

          <SvCard
            class="test"
            :class="`${ surface } sv-${ color }--text`"
            disabled
          >
            <div data-sv-full-width>Elevated card</div>
            <div>Disabled</div>
          </SvCard>

          <SvCard
            class="test"
            :class="`${ surface } sv-${ color }--text`"
            interactive
            disabled
          >
            <div data-sv-full-width>Elevated card</div>
            <div>Interactive</div>
            <div>Disabled</div>
          </SvCard>
        </div>
      </template>
    </template>

    <template v-for="color in colors" :key="color">
      <div class="container">
        <SvCard
          class="test"
          :class="`sv-${ color }-container sv-on-${ color }-container`"
          variant="filled"
        >
          <div data-sv-full-width>Filled card</div>
        </SvCard>

        <SvCard
          class="test"
          :class="`sv-${ color }-container sv-on-${ color }-container`"
          variant="filled"
          interactive
        >
          <div data-sv-full-width>Filled card</div>
          <div>Interactive</div>
        </SvCard>

        <SvCard
          class="test"
          :class="`sv-${ color }-container sv-on-${ color }-container`"
          variant="filled"
          disabled
        >
          <div data-sv-full-width>Filled card</div>
          <div>Disabled</div>
        </SvCard>

        <SvCard
          class="test"
          :class="`sv-${ color }-container sv-on-${ color }-container`"
          variant="filled"
          interactive
          disabled
        >
          <div data-sv-full-width>Filled card</div>
          <div>Interactive</div>
          <div>Disabled</div>
        </SvCard>
      </div>
    </template>

    <template v-for="surface in surfaces" :key="surface">
      <template v-for="color in colors" :key="color">
        <div class="container">
          <SvCard
            class="test"
            :class="`${ surface } sv-${ color }--text`"
            variant="outlined"
          >
            <div data-sv-full-width>Outlined card</div>
          </SvCard>

          <SvCard
            class="test"
            :class="`${ surface } sv-${ color }--text`"
            variant="outlined"
            interactive
          >
            <div data-sv-full-width>Outlined card</div>
            <div>Interactive</div>
          </SvCard>

          <SvCard
            class="test"
            :class="`${ surface } sv-${ color }--text`"
            variant="outlined"
            disabled
          >
            <div data-sv-full-width>Outlined card</div>
            <div>Disabled</div>
          </SvCard>

          <SvCard
            class="test"
            :class="`${ surface } sv-${ color }--text`"
            variant="outlined"
            interactive
            disabled
          >
            <div data-sv-full-width>Outlined card</div>
            <div>Interactive</div>
            <div>Disabled</div>
          </SvCard>
        </div>
      </template>
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
