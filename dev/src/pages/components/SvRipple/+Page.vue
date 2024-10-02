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
      <div class="test sv-bg--primary-container sv-c--on-primary-container" tabindex="0">
        <SvRipple />
        <strong>primary cont</strong>
      </div>

      <div class="test sv-bg--secondary-container sv-c--on-secondary-container" tabindex="0">
        <SvRipple />
        <strong>secondary cont</strong>
      </div>

      <div class="test sv-bg--tertiary-container sv-c--on-tertiary-container" tabindex="0">
        <SvRipple style="color: orangered" :target="getErrorTarget" />
        <strong>tertiary cont<br />trigger from error cont</strong>
      </div>

      <div id="ripple-error" class="test test--round sv-bg--error-container sv-c--on-error-container" tabindex="0">
        <SvRipple :pointer-down="false" pointer-up :key-down="false" :key-up="['Enter', ' ']" />
        <strong>error cont<br />lazy</strong>
      </div>
    </div>

    <div class="container">
      <div class="test test--thin sv-bg--surface-container-highest sv-c--on-surface" tabindex="0">
        <SvRipple />
        <strong>surface cont highest</strong>
      </div>

      <div class="test sv-bg--surface-container-low sv-c--on-surface--variant" tabindex="0">
        <SvRipple />
        <strong>surface cont low</strong>
      </div>

      <div class="test test--square sv-bg--surface-container sv-c--on-surface" tabindex="0">
        <SvRipple />
        <strong>surface cont</strong>
      </div>

      <div class="test sv-bg--surface-container-high sv-c--on-surface" tabindex="0">
        <SvRipple pointer-up :key-up="['Enter', ' ']" />
        <strong>surface cont high<br />eager and lazy</strong>
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

  &--square
    aspect-ratio: 1/1

  &--thin
    aspect-ratio: 8/1

  &--round
    aspect-ratio: 1/1
    inline-size: 8rem
    border-radius: 50%
</style>
