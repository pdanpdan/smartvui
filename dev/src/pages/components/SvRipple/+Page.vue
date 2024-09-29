<script setup lang="ts">
import { SvRipple } from '$lib/index';

function getErrorTarget() {
  return document.getElementById('ripple-error');
}
</script>

<template>
  <div class="sv-page--padded">
    <h1>SvRipple</h1>

    <div class="container">
      <div class="test sv-primary sv-on-primary" tabindex="0">
        <SvRipple />
        <strong>sv-primary</strong>
      </div>

      <div class="test sv-secondary sv-on-secondary" tabindex="0">
        <SvRipple />
        <strong>sv-secondary</strong>
      </div>

      <div class="test sv-tertiary sv-on-tertiary" tabindex="0">
        <SvRipple style="color: orangered" :target="getErrorTarget" />
        <strong>sv-tertiary, trigger from sv-error</strong>
      </div>

      <div id="ripple-error" class="test test--round sv-error sv-on-error" tabindex="0">
        <SvRipple :pointer-down="false" pointer-up :key-down="false" :key-up="['Enter', ' ']" />
        <strong>sv-error, lazy</strong>
      </div>
    </div>

    <div class="container">
      <div class="test test--thin sv-primary-container sv-on-primary-container" tabindex="0">
        <SvRipple />
        <strong>sv-primary-container</strong>
      </div>

      <div class="test sv-secondary-container sv-on-secondary-container" tabindex="0">
        <SvRipple />
        <strong>sv-secondary-container</strong>
      </div>

      <div class="test test--square sv-tertiary-container sv-on-tertiary-container" tabindex="0">
        <SvRipple />
        <strong>sv-tertiary-container</strong>
      </div>

      <div class="test sv-error-container sv-on-error-container" tabindex="0">
        <SvRipple pointer-up :key-up="['Enter', ' ']" />
        <strong>sv-error-container, eager and lazy</strong>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.container
  display: flex
  flex-wrap: wrap
  align-items: center
  gap: .5rem
  margin-block: .5rem

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
