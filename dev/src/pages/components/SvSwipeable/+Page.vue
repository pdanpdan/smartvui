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
            <div class="test__slot" style="padding-inline-end: 48px; margin-inline-end: -24px">
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
  </div>
</template>

<style lang="sass" scoped>
.container
  display: flex
  justify-content: center
  align-items: center
  block-size: 400px

.test
  margin-inline: -16px

  &__content
    user-select: none

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
</style>
