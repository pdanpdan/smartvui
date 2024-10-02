<script setup lang="ts">
import { SvLayerElevation } from '$lib/index';
</script>

<template>
  <div class="sv-page--padded">
    <h1>SvElevation</h1>

    <div class="container">
      <div class="test sv-bg--primary-container sv-c--on-primary-container test-elevation--5" tabindex="0">
        <SvLayerElevation />
        <strong>primary cont<br />el 5</strong>
      </div>

      <div class="test sv-bg--secondary-container sv-c--on-secondary-container test-elevation--4" tabindex="0">
        <SvLayerElevation />
        <strong>secondary cont<br />el 4</strong>
      </div>

      <div class="test sv-bg--tertiary-container sv-c--on-tertiary-container test-elevation--3" tabindex="0">
        <SvLayerElevation />
        <strong>tertiary cont<br />el 3</strong>
      </div>

      <div id="ripple-error" class="test test--round sv-bg--error-container sv-c--on-error-container test-elevation--2" tabindex="0">
        <SvLayerElevation />
        <strong>error cont<br />el 2</strong>
      </div>
    </div>

    <div class="container">
      <div class="test test--thin sv-bg--surface-container-low sv-c--on-surface test-elevation--1" tabindex="0">
        <SvLayerElevation />
        <strong>surface cont low<br />el 1</strong>
      </div>

      <div class="test sv-bg--surface-container sv-c--on-surface-variant test-elevation--2" tabindex="0">
        <SvLayerElevation />
        <strong>surface cont<br />el 2</strong>
      </div>

      <div class="test test--square sv-bg--surface-container-high sv-c--on-surface test-elevation--3" tabindex="0">
        <SvLayerElevation />
        <strong>surface cont high<br />el 3</strong>
      </div>

      <div class="test sv-bg--surface-container-highest sv-c--on-surface test-elevation--4" tabindex="0">
        <SvLayerElevation />
        <strong>surface cont highest<br />el 4</strong>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.container
  display: flex
  flex-wrap: wrap
  align-items: center
  gap: 1.5rem
  margin-block: .5rem

.test
  position: relative
  inline-size: 20rem
  block-size: auto
  aspect-ratio: 2/1
  display: flex
  justify-content: center
  align-items: center
  z-index: 0

  &--square
    aspect-ratio: 1/1

  &--thin
    aspect-ratio: 8/1

  &--round
    aspect-ratio: 1/1
    inline-size: 8rem
    border-radius: 50%

  &-elevation
    &--0
      --sv-layer-elevation-level: 0

      &:hover
        --sv-layer-elevation-level: 1

    &--1
      --sv-layer-elevation-level: 1

      &:hover
        --sv-layer-elevation-level: 2

    &--2
      --sv-layer-elevation-level: 2

      &:hover
        --sv-layer-elevation-level: 3

    &--3
      --sv-layer-elevation-level: 3

      &:hover
        --sv-layer-elevation-level: 3

    &--4
      --sv-layer-elevation-level: 4

      &:hover
        --sv-layer-elevation-level: 5

    &--5
      --sv-layer-elevation-level: 5
</style>
