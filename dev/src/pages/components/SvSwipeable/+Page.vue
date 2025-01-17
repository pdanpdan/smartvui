<script setup lang="ts">
import {
  SvCard,
  SvCardContent,
  SvCardHeader,
  SvSwipeable,
} from '$lib/index';
</script>

<template>
  <div class="sv-page--padded">
    <h1>SvSwipeable</h1>

    <div class="container">
      <SvCard
        variant="outlined"
        class="sv-bg--primary sv-c--on-primary"
      >
        <SvSwipeable class="test">
          <template #default="{ size, swiped, side }">
            <SvCard
              variant="filled"
              class="test__content sv-bg--primary-container sv-c--on-primary-container"
              :class="size > 12 || swiped === true ? `test__content--${ side }` : ''"
            >
              <SvCardHeader>
                <div class="sv-t--title-large">Header</div>
              </SvCardHeader>
              <SvCardContent class="sv-t--body-large">
                <div>Some content for the card 1</div>
                <div>Some content for the card 2</div>
                <div>Some content for the card 3</div>
                <div>Some content for the card 4</div>

                <div style="height: 100px; overflow: auto">
                  <div v-for="i in 20" :key="i">Some content for the card {{ 4 + i }}</div>
                </div>
              </SvCardContent>
            </SvCard>
          </template>

          <template #inline-start="{ reset }">
            <div class="test__slot" style="padding-inline-end: 48px; margin-inline-end: -24px; min-width: 200px">
              <div class="sv-t--title-medium">inline start</div>
              <button @click="reset">Action</button>
            </div>
          </template>

          <template #inline-end="{ reset }">
            <div class="test__slot" style="padding-inline-start: 48px; margin-inline-start: -24px">
              <div class="sv-t--title-medium">inline end</div>
              <button @click="reset">Action</button>
            </div>
          </template>

          <template #block-start="{ reset }">
            <div class="test__slot" style="padding-block-end: 48px; margin-block-end: -24px">
              <div class="sv-t--title-medium">block start</div>
              <button @click="reset">Action</button>
            </div>
          </template>

          <template #block-end="{ reset }">
            <div class="test__slot" style="padding-block-start: 48px; margin-block-start: -24px">
              <div class="sv-t--title-medium">block end</div>
              <button @click="reset">Action</button>
            </div>
          </template>
        </SvSwipeable>
      </SvCard>
    </div>

    <div class="container">
      <SvSwipeable class="test" style="border-radius: var(--sv-sys-shape-corner-medium)">
        <template #default="{ size, swiped, side }">
          <SvCard
            variant="outlined"
            class="test__content sv-bg--primary-container sv-c--on-primary-container"
            :class="size > 12 || swiped === true ? `test__content--${ side }` : ''"
          >
            <SvCardHeader>
              <div class="sv-t--title-large">Header</div>
            </SvCardHeader>
            <SvCardContent class="sv-t--body-large">
              <div>Some content for the card 1</div>
              <div>Some content for the card 2</div>
              <div>Some content for the card 3</div>
              <div>Some content for the card 4</div>

              <div style="height: 100px; overflow: auto">
                <div v-for="i in 20" :key="i">Some content for the card {{ 4 + i }}</div>
              </div>
            </SvCardContent>
          </SvCard>
        </template>

        <template #inline-start="{ reset }">
          <div class="test__slot sv-bg--primary sv-c--on-primary" style="padding-inline-end: 48px; margin-inline-end: -24px; min-width: 200px">
            <div class="sv-t--title-medium">inline start</div>
            <button @click="reset">Action</button>
          </div>
        </template>

        <template #inline-end="{ reset }">
          <div class="test__slot sv-bg--secondary sv-c--on-secondary" style="padding-inline-start: 48px; margin-inline-start: -24px">
            <div class="sv-t--title-medium">inline end</div>
            <button @click="reset">Action</button>
          </div>
        </template>

        <template #block-start="{ reset }">
          <div class="test__slot sv-bg--tertiary sv-c--on-tertiary" style="padding-block-end: 48px; margin-block-end: -24px">
            <div class="sv-t--title-medium">block start</div>
            <button @click="reset">Action</button>
          </div>
        </template>

        <template #block-end="{ reset }">
          <div class="test__slot sv-bg--error sv-c--on-error" style="padding-block-start: 48px; margin-block-start: -24px">
            <div class="sv-t--title-medium">block end</div>
            <button @click="reset">Action</button>
          </div>
        </template>
      </SvSwipeable>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.container
  display: flex
  justify-content: center
  align-items: center
  block-size: 400px

.test
  grid-area: full
  --sv-swipeable-overflow-clip: 10px

  &__content
    user-select: none
    transition: border-radius .1s ease-in-out

    &--inline-start
      border-start-start-radius: 0

    &--inline-end
      border-end-end-radius: 0

    &--block-start
      border-start-start-radius: 0
      border-start-end-radius: 0

    &--block-end
      border-end-start-radius: 0
      border-end-end-radius: 0

  &__slot
    padding: 24px
    border-radius: inherit
    outline: 4px solid red
    outline-offset: 2px
</style>
