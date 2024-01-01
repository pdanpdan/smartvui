<script setup lang="ts">
import { reactive } from 'vue';

const visibility = reactive({
  header: true,
  footer: true,
  asideBefore: true,
  asideAfter: false,
});

function setVisibility(section: 'header' | 'footer' | 'asideBefore' | 'asideAfter', visible: boolean) {
  visibility[ section ] = visible === true;
}
</script>

<template>
  <div class="sv-layout">
    <header class="sv-layout__header" :class="{ 'sv-layout__header--visible': visibility.header }">
      <slot name="header" :visibility="visibility" :set-visibility="setVisibility" />
    </header>

    <footer class="sv-layout__footer" :class="{ 'sv-layout__footer--visible': visibility.footer }">
      <slot name="footer" :visibility="visibility" :set-visibility="setVisibility" />
    </footer>

    <aside class="sv-layout__aside-before" :class="{ 'sv-layout__aside-before--visible': visibility.asideBefore }">
      <slot name="aside-before" :visibility="visibility" :set-visibility="setVisibility" />
    </aside>

    <aside class="sv-layout__aside-after" :class="{ 'sv-layout__aside-after--visible': visibility.asideAfter }">
      <slot name="aside-after" :visibility="visibility" :set-visibility="setVisibility" />
    </aside>

    <main class="sv-layout__main">
      <slot :visibility="visibility" :set-visibility="setVisibility" />
    </main>
  </div>
</template>

<style scoped lang="sass">
.sv-layout
  --grid-gap: 0

  display: grid
  min-height: 100dvh
  gap: var(--grid-gap)

  @media print, screen and (max-width: 640px)
    grid-template-areas: "h" "ab" "m" "aa" "f"
    grid-template-columns: 1fr
    grid-template-rows: min-content min-content 1fr min-content min-content

  @media screen and (min-width: 641px) and (max-width: 1280px)
    grid-template-areas: "h h h" "ab m aa" "f f f"
    grid-template-columns: minmax(200px, 300px) 1fr 0
    grid-template-rows: min-content 1fr min-content

  @media screen and (min-width: 1281px)
    grid-template-areas: "h h h h h" ". ab m aa ." "f f f f f"
    grid-template-columns: minmax(0, 1fr) minmax(200px, 300px) minmax(auto, 80ch) minmax(200px, 300px) minmax(0, 1fr)
    grid-template-rows: min-content 1fr min-content

  &__header,
  &__footer,
  &__aside-before,
  &__aside-after,
  &__main
    position: relative

  &__header
    grid-area: h

  &__footer
    grid-area: f

  &__aside-before
    grid-area: ab

  &__aside-after
    grid-area: aa

    @media screen and (min-width: 641px) and (max-width: 1280px)
      & :deep(> *)
        position: fixed
        z-index: 1
        inset: 0 0 0 auto
        min-width: 200px
        transform: translateX(100%) #{"/* rtl:ignore */"}
        transition: transform .3s ease-in-out

      &--visible :deep(> *)
        transform: translateX(0) #{"/* rtl:ignore */"}

  &__main
    grid-area: m

    &--transition-same
      transition: opacity 0.3s ease-in-out
      opacity: .8
</style>
