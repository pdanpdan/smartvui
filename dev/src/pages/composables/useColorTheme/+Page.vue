<script setup lang="ts">
import { usePrefersDark } from '$lib/composables/usePrefersDark';

function genStyle(bg: string, fg: string) {
  return {
    backgroundColor: `var(--md-sys-color-${ bg })`,
    color: `var(--md-sys-color-${ fg })`,
  };
}

const { isDark } = usePrefersDark();
</script>

<template>
  <div class="sv-page--padded">
    <h1>useTheme</h1>
    <div class="sv-color-theme sv-title-medium">
      <div
        v-for="(color, i) in ['primary', 'secondary', 'tertiary', 'error']"
        :key="i"
        :class="`sv-color-theme__r1 sv-color-theme__c${ i + 1 }`"
      >
        <div :class="`sv-${ color } sv-on-${ color }`">
          {{ color[0].toUpperCase() }}{{ color.slice(1) }}
          <i class="sv-body-small">{{ color[0].toUpperCase() }}-{{ isDark ? '80' : '40' }}</i>
        </div>

        <div :style="genStyle(`on-${ color }`, color)">
          On {{ color[0].toUpperCase() }}{{ color.slice(1) }}
          <i class="sv-body-small">{{ color[0].toUpperCase() }}-{{ isDark ? '20' : '100' }}</i>
        </div>

        <div />

        <div :class="`sv-${ color }-container sv-on-${ color }-container`">
          {{ color[0].toUpperCase() }}{{ color.slice(1) }} Container
          <i class="sv-body-small">{{ color[0].toUpperCase() }}-{{ isDark ? '30' : '90' }}</i>
        </div>

        <div :style="genStyle(`on-${ color }-container`, `${ color }-container`)">
          On {{ color[0].toUpperCase() }}{{ color.slice(1) }} Container
          <i class="sv-body-small">{{ color[0].toUpperCase() }}-{{ isDark ? '90' : '10' }}</i>
        </div>
      </div>

      <div
        v-for="(color, i) in ['primary', 'secondary', 'tertiary']"
        :key="i"
        :class="`sv-color-theme__r2 sv-color-theme__c${ i + 1 }`"
      >
        <div :class="`sv-${ color }-fixed sv-on-${ color }-fixed`">
          {{ color[0].toUpperCase() }}{{ color.slice(1) }} Fixed
          <i class="sv-body-small">{{ color[0].toUpperCase() }}-90</i>
        </div>

        <div :class="`sv-${ color }-fixed-dim sv-on-${ color }-fixed`">
          {{ color[0].toUpperCase() }}{{ color.slice(1) }} Fixed Dim
          <i class="sv-body-small">{{ color[0].toUpperCase() }}-80</i>
        </div>

        <div :style="genStyle(`on-${ color }-fixed`, `${ color }-fixed`)">
          On {{ color[0].toUpperCase() }}{{ color.slice(1) }} Fixed
          <i class="sv-body-small">{{ color[0].toUpperCase() }}-10</i>
        </div>

        <div :style="genStyle(`on-${ color }-fixed-variant`, `${ color }-fixed`)">
          On {{ color[0].toUpperCase() }}{{ color.slice(1) }} Fixed Variant
          <i class="sv-body-small">{{ color[0].toUpperCase() }}-30</i>
        </div>
      </div>

      <div class="sv-color-theme__r3 sv-color-theme__c1-3">
        <div>
          <div class="sv-surface-dim sv-on-surface">
            Surface Dim
            <i class="sv-body-small">N-{{ isDark ? '6' : '87' }}</i>
          </div>

          <div class="sv-surface sv-on-surface">
            Surface
            <i class="sv-body-small">N-{{ isDark ? '6' : '98' }}</i>
          </div>

          <div class="sv-surface-bright sv-on-surface">
            Surface Bright
            <i class="sv-body-small">N-{{ isDark ? '24' : '98' }}</i>
          </div>
        </div>

        <div>
          <div class="sv-surface-container-lowest sv-on-surface">
            Surface Container Lowest
            <i class="sv-body-small">N-{{ isDark ? '4' : '100' }}</i>
          </div>

          <div class="sv-surface-container-low sv-on-surface">
            Surface Container Low
            <i class="sv-body-small">N-{{ isDark ? '10' : '96' }}</i>
          </div>

          <div class="sv-surface-container sv-on-surface">
            Surface Container
            <i class="sv-body-small">N-{{ isDark ? '12' : '94' }}</i>
          </div>

          <div class="sv-surface-container-high sv-on-surface">
            Surface Container High
            <i class="sv-body-small">N-{{ isDark ? '17' : '92' }}</i>
          </div>

          <div class="sv-surface-container-highest sv-on-surface">
            Surface Container Highest
            <i class="sv-body-small">N-{{ isDark ? '22' : '90' }}</i>
          </div>
        </div>

        <div>
          <div :style="genStyle('on-surface', 'surface')">
            On Surface
            <i class="sv-body-small">N-{{ isDark ? '90' : '10' }}</i>
          </div>

          <div :style="genStyle('on-surface-variant', 'surface')">
            On Surface Variant
            <i class="sv-body-small">NV-{{ isDark ? '80' : '30' }}</i>
          </div>

          <div :style="genStyle('outline', 'surface')">
            Outline
            <i class="sv-body-small">NV-{{ isDark ? '60' : '50' }}</i>
          </div>

          <div :style="genStyle('outline-variant', 'on-surface')">
            Outline Variant
            <i class="sv-body-small">NV-{{ isDark ? '30' : '80' }}</i>
          </div>
        </div>
      </div>

      <div class="sv-color-theme__r3 sv-color-theme__c4">
        <div class="sv-inverse-surface sv-inverse-on-surface">
          Inverse Surface
          <i class="sv-body-small">N-{{ isDark ? '90' : '20' }}</i>
        </div>

        <div :style="genStyle('inverse-on-surface', 'inverse-surface')">
          Inverse On Surface
          <i class="sv-body-small">N-{{ isDark ? '20' : '95' }}</i>
        </div>

        <div :style="genStyle('inverse-primary', 'inverse-surface')">
          Inverse Primary
          <i class="sv-body-small">P-{{ isDark ? '40' : '80' }}</i>
        </div>

        <div>
          <div :style="genStyle('scrim', 'primary-fixed')">
            Scrim
            <i class="sv-body-small">N-{{ isDark ? '0' : '0' }}</i>
          </div>

          <div :style="genStyle('shadow', 'primary-fixed')">
            Shadow
            <i class="sv-body-small">N-{{ isDark ? '0' : '0' }}</i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use "$dev/assets/styles/variables" as *

.sv-color-theme
  display: grid
  gap: 1rem
  grid-template-columns: [c1-start] 1fr [c1-end c2-start] 1fr [c2-end c3-start] 1fr [c3-end c4-start] 1fr [c4-end]
  grid-template-rows: [r1-start] auto [r1-end r2-start] auto [r2-end r3-start] auto [r3-end r2-start]

  @media print, screen and (max-width: #{$bp-tablet})
    display: flex
    flex-direction: column

  div:not(:has(div))
    padding: .8rem .5rem
    display: flex
    justify-content: center
    align-items: center
    text-align: center
    position: relative

    &:not(:empty)
      box-shadow: 0 0 1px 0 var(--md-sys-color-inverse-surface)

    > i
      position: absolute
      inset-inline-end: .4rem
      inset-block-end: .1rem
      white-space: nowrap

  &__r1
    grid-row: r1
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: 1.5fr 1fr .3rem 1.5fr 1fr

  &__r2
    grid-row: r2
    display: grid
    grid-template-areas: "p1 p2" "p3 p3" "p4 p4"

    > *:nth-child(3)
      grid-area: p3

    > *:nth-child(4)
      grid-area: p4

  &__r3
    grid-row: r3

    &.sv-color-theme__c1-3
      display: grid
      grid-template-rows: [r1-start] 1.4fr [r1-end] .3rem [r2-start] 1.8fr [r2-end] .3rem [r3-start] 1fr [r3-end]

      @media print, screen and (max-width: #{$bp-tablet})
        display: flex
        flex-direction: column

      > *:nth-child(1)
        grid-row: r1
        display: grid
        grid-template-columns: 1fr 1fr 1fr

      > *:nth-child(2)
        grid-row: r2
        display: grid
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr

      > *:nth-child(3)
        grid-row: r3
        display: grid
        grid-template-columns: 1fr 1fr 1fr 1fr

      @media print, screen and (max-width: #{$bp-tablet})
        > *:nth-child(1n)
          display: flex
          flex-direction: column

    &.sv-color-theme__c4
      display: grid
      grid-template-rows: 1fr 1fr 1fr .3rem [p4-start] 1fr [p4-end]

      > *:nth-child(4)
        grid-row: p4
        display: grid
        grid-template-columns: 1fr .3rem [shadow-start] 1fr [shadow-end]

        > *:nth-child(2)
          grid-column: shadow

  &__c1
    grid-column: c1

  &__c2
    grid-column: c2

  &__c3
    grid-column: c3

  &__c4
    grid-column: c4

  &__c1-3
    grid-column-start: c1-start
    grid-column-end: c3-end
</style>
