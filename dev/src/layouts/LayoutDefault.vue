<script setup lang="ts">
import { visibility } from '$dev/utils/panels';
import { useColorTheme, useDark } from '$dev/utils/theme';

import { links } from '$dev/utils/menuStructure';
import NavigationList from '$dev/components/NavigationList.vue';

const { forceDark, isDark } = useDark();

const {
  sourceColor,
  attrs,
  style,
} = useColorTheme(isDark);
</script>

<template>
  <div class="sv-layout sv-background sv-on-background" v-bind.attr="attrs" :style="style">
    <header class="sv-layout__header" :class="`sv-layout__header--${ visibility.header ? '' : 'in' }visible`">
      <slot name="header" :visibility="visibility">
        <div class="sv-panels__config">
          <fieldset>
            <legend>Panels</legend>
            <input v-model="visibility.header" type="checkbox" :value="true" data-label="Header" />
            <input v-model="visibility.footer" type="checkbox" :value="true" data-label="Footer" />
            <input v-model="visibility.main" type="checkbox" :value="true" data-label="Main" />
            <input v-model="visibility.asideBefore" type="checkbox" :value="true" data-label="Before" />
            <input v-model="visibility.asideAfter" type="checkbox" :value="true" data-label="After" />
          </fieldset>
        </div>
      </slot>
    </header>

    <footer class="sv-layout__footer" :class="`sv-layout__footer--${ visibility.footer ? '' : 'in' }visible`">
      <slot name="footer" :visibility="visibility">
        <div class="sv-theme__config">
          <fieldset>
            <legend>Color</legend>
            <input v-model="sourceColor" type="color" />
            <input v-model="sourceColor" type="text" class="sv-body-medium" />
          </fieldset>

          <fieldset>
            <legend>Dark</legend>
            <input v-model="forceDark" type="radio" :value="true" data-label="On" />
            <input v-model="forceDark" type="radio" :value="false" data-label="Off" />
            <input v-model="forceDark" type="radio" :value="null" data-label="Auto" />
          </fieldset>
        </div>
      </slot>
    </footer>

    <aside class="sv-layout__aside-before" :class="`sv-layout__aside-before--${ visibility.asideBefore ? '' : 'in' }visible`">
      <slot name="aside-before" :visibility="visibility">
        <nav class="sv-surface-container-high sv-on-surface" style="padding: 1rem 1.5rem; min-height: 100%">
          <NavigationList :links="links" />
        </nav>
      </slot>
    </aside>

    <aside class="sv-layout__aside-after" :class="`sv-layout__aside-after--${ visibility.asideAfter ? '' : 'in' }visible`">
      <slot name="aside-after" :visibility="visibility">
        <div class="sv-surface-container-highest sv-on-surface" style="padding: 1rem">
          <div v-for="i in 50" :key="i">Aside after #{{ i + 1 }}</div>
        </div>
      </slot>
    </aside>

    <main class="sv-layout__main" :class="`sv-layout__main--${ visibility.main ? '' : 'in' }visible`">
      <slot :visibility="visibility" />
    </main>

    <div v-if="visibility.header !== true" class="sv-panels__config" style="position: fixed; inset: auto 0 0 auto; z-index: 1">
      <fieldset>
        <legend>Panels</legend>
        <input v-model="visibility.header" type="checkbox" :value="true" data-label="Header" />
      </fieldset>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use "../assets/styles/variables" as *

.sv-layout
  --grid-gap: 0

  display: grid
  min-height: 100dvh
  gap: var(--grid-gap)

  @media print, screen and (max-width: #{$bp-mobile})
    grid-template-areas: "h" "ab" "aa" "m" "." "f"
    grid-template-columns: 100%
    grid-template-rows: min-content min-content min-content min-content 1fr min-content

  @media screen and (min-width: #{$bp-mobile + 1px}) and (max-width: #{$bp-tablet})
    grid-template-areas: "h h h" "ab m aa" "f f f"
    grid-template-columns: minmax(150px, 250px) 1fr 0
    grid-template-rows: min-content 1fr min-content
    height: 100dvh
    overflow: hidden

    &:has(.sv-layout__aside-before:empty, .sv-layout__aside-before--invisible) .sv-layout__main
      grid-column-start: ab-start

  @media screen and (min-width: #{$bp-tablet + 1px})
    grid-template-areas: "h h h h h" ". ab m aa ." "f f f f f"
    grid-template-columns: minmax(0, 1fr) minmax(200px, 300px) minmax(auto, 80ch) minmax(200px, 300px) minmax(0, 1fr)
    grid-template-rows: min-content 1fr min-content
    height: 100dvh
    overflow: hidden

    &:has(.sv-layout__aside-before:empty, .sv-layout__aside-before--invisible) .sv-layout__main
      grid-column-start: ab-start

    &:has(.sv-layout__aside-after:empty, .sv-layout__aside-after--invisible) .sv-layout__main
      grid-column-end: aa-end

  &[data-sv-theme="auto"]
    --md-sys-color-smartvui: var(--md-sys-color-smartvui-light)
    --md-sys-color-on-smartvui: var(--md-sys-color-on-smartvui-light)
    --md-sys-color-smartvui-container: var(--md-sys-color-smartvui-container-light)
    --md-sys-color-on-smartvui-container: var(--md-sys-color-on-smartvui-container-light)

    @media screen and (prefers-color-scheme: dark)
      --md-sys-color-smartvui: var(--md-sys-color-smartvui-dark)
      --md-sys-color-on-smartvui: var(--md-sys-color-on-smartvui-dark)
      --md-sys-color-smartvui-container: var(--md-sys-color-smartvui-container-dark)
      --md-sys-color-on-smartvui-container: var(--md-sys-color-on-smartvui-container-dark)

  &__header,
  &__footer,
  &__aside-before,
  &__aside-after,
  &__main
    position: relative
    overflow: auto

    &:empty,
    &--invisible
      width: 0
      height: 0
      overflow: hidden

  &__header
    grid-area: h

  &__footer
    grid-area: f

  &__aside-before
    grid-area: ab

  &__aside-after
    grid-area: aa

    @media screen and (min-width: #{$bp-mobile + 1px}) and (max-width: #{$bp-tablet})
      overflow: visible
      height: unset

      & :deep(> *)
        position: absolute
        z-index: 1
        inset: 0 0 0 auto
        min-width: 200px
        max-width: 90vw
        overflow: auto
        transform: translateX(100%) #{"/* !rtl:translateX(0) */"}
        transition: transform .3s ease-in-out

      &--visible :deep(> *)
        transform: translateX(0) #{"/* !rtl:translateX(100%) */"}

  &__main
    grid-area: m

    &--transition-same
      transition: opacity .3s ease-in-out
      opacity: .8

.sv-theme__config,
.sv-panels__config
  background-color: var(--md-sys-color-smartvui-container)
  color: var(--md-sys-color-on-smartvui-container)
  display: flex
  flex-wrap: wrap
  gap: .5rem .8rem
  align-items: stretch
  max-width: 100%
  padding: .2rem .5rem .3rem

  fieldset
    display: flex
    gap: .2rem .4rem
    align-items: center
    border: 1px solid color-mix(in srgb, var(--md-sys-color-on-smartvui-container) 30%, transparent)
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
    background-color: color-mix(in srgb, var(--md-sys-color-on-smartvui-container) 8%, transparent)
    color: var(--md-sys-color-on-smartvui-container)

    &:focus-visible
      outline: 2px solid
      outline-offset: 2px
      border-radius: .2rem

    &[type="radio"],
    &[type="checkbox"]
      appearance: none
      width: auto
      margin: 0
      padding: .1rem
      align-items: center
      background-color: transparent
      cursor: pointer

      &:before
        content: ''
        display: block
        width: 1.2rem
        height: 1.2rem
        padding: .2rem
        background-clip: content-box
        border: 2px solid var(--md-sys-color-on-smartvui-container)
        border-radius: .2rem
        background-color: transparent
        transition: background-color .3s ease-in-out

      &:checked:before
        background-color: var(--md-sys-color-on-smartvui-container)

      &:after
        content: attr(data-label)
        padding-inline-start: 1ch

    &[type="color"]
      margin: 0
      padding: 0
      height: 1.4rem
      border: none

      &::-webkit-color-swatch-wrapper
        padding: 0

    &[type="text"]
      font-size: 16px
      margin: 0
      padding: .1rem .5rem
      align-self: stretch
      border: none
      width: 9ch
</style>
