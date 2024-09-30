<script setup lang="ts">
import { SvLayerFocusIndicator } from '$lib/index';
</script>

<template>
  <div class="sv-page--padded">
    <h1>SvLayerFocusIndicator</h1>

    <div class="container">
      <div class="test sv-primary sv-on-primary" tabindex="0">
        <SvLayerFocusIndicator />
        <strong>sv-primary</strong>
      </div>

      <div class="test sv-secondary sv-on-secondary" tabindex="0">
        <SvLayerFocusIndicator />
        <strong>sv-secondary</strong>
      </div>

      <div class="test sv-tertiary sv-on-tertiary" tabindex="0">
        <SvLayerFocusIndicator />
        <strong>sv-tertiary</strong>
      </div>

      <div id="ripple-error" class="test test--round sv-error sv-on-error" tabindex="0">
        <SvLayerFocusIndicator />
        <strong>sv-error</strong>
      </div>
    </div>

    <div class="container">
      <div class="test test--thin sv-primary-container sv-on-primary-container" tabindex="0">
        <SvLayerFocusIndicator />
        <strong>sv-primary-container</strong>
      </div>

      <div class="test sv-secondary-container sv-on-secondary-container" tabindex="0">
        <SvLayerFocusIndicator />
        <strong>sv-secondary-container</strong>
      </div>

      <div class="test test--square sv-tertiary-container sv-on-tertiary-container" tabindex="0">
        <SvLayerFocusIndicator />
        <strong>sv-tertiary-container</strong>
      </div>

      <div class="test sv-error-container sv-on-error-container" tabindex="0">
        <SvLayerFocusIndicator />
        <strong>sv-error-container</strong>
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
  outline: none
  --sv-layer-focus-indicator-thickness: 0
  --sv-layer-focus-indicator-color: var(--sv-sys-color-secondary)

  &:focus-visible
    --sv-layer-focus-indicator-thickness: 3px

  &--square
    aspect-ratio: 1/1

  &--thin
    aspect-ratio: 8/1

  &--round
    aspect-ratio: 1/1
    inline-size: 8rem
    border-radius: 50%
</style>
