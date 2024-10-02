<script setup lang="ts">
import { usePrefersDark } from '$lib/composables/usePrefersDark';

const { forceDark, isDark } = usePrefersDark();
const { forceDark: forceDarkInt, isDark: isDarkInt } = usePrefersDark({ group: 'internal' });
</script>

<template>
  <div class="sv-page--padded">
    <h1>usePrefersDark</h1>
    <div class="sv-t--body-large sv-prefers-dark sv-prefers-dark__details">
      <div :class="forceDark ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">forceDark: {{ String(forceDark) }}</div>
      <div :class="isDark ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isDark: {{ String(isDark) }}</div>
    </div>

    <div class="sv-t--body-large sv-prefers-dark sv-prefers-dark__details">
      <fieldset style="margin-top: 24px; display: inline-block">
        <legend>Dark internal</legend>
        <input v-model="forceDarkInt" type="radio" :value="true" data-label="On" />
        <input v-model="forceDarkInt" type="radio" :value="false" data-label="Off" />
        <input v-model="forceDarkInt" type="radio" :value="null" data-label="Auto" />
      </fieldset>
      <div :class="forceDarkInt ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">forceDarkInt: {{ String(forceDarkInt) }}</div>
      <div :class="isDarkInt ? 'sv-c--on-tertiary-container' : 'sv-c--on-error-container'">isDarkInt: {{ String(isDarkInt) }}</div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.sv-prefers-dark
  &__details
    > div
      padding: 6px 0

  fieldset
    display: flex
    gap: .2rem .3rem
    align-items: center
    border: 1px solid color-mix(in srgb, var(--sv-sys-color-on-smartvui-container) 30%, transparent)
    border-radius: .5rem
    margin: 0
    padding: .2rem .6rem .5rem

  legend
    font-size: .8rem
    padding: 0 .5rem

  input
    display: inline-flex
    flex-grow: 0
    flex-shrink: 0
    background-color: color-mix(in srgb, var(--sv-sys-color-on-smartvui-container) 8%, transparent)
    color: var(--sv-sys-color-on-smartvui-container)

    &:focus-visible
      outline: 2px solid
      outline-offset: 2px
      border-radius: .2rem

    &[type="radio"],
    &[type="checkbox"]
      appearance: none
      inline-size: auto
      margin: 0
      padding: .1rem
      align-items: center
      background-color: transparent
      cursor: pointer

      &:before
        content: ''
        display: block
        inline-size: 1.2rem
        block-size: 1.2rem
        padding: .2rem
        background-clip: content-box
        border: 2px solid var(--sv-sys-color-on-smartvui-container)
        border-radius: .2rem
        background-color: transparent
        transition: background-color .3s ease-in-out

      &:checked:before
        background-color: var(--sv-sys-color-on-smartvui-container)

      &:after
        content: attr(data-label)
        padding-inline: 1ch 2ch

    &[type="radio"]
      &:before
        border-radius: 50%
</style>
