<script setup lang="ts">
import { ref } from 'vue';

import {
  SvCard,
  SvCardActions,
  SvCardContent,
  SvCardFooter,
  SvCardHeader,
  SvCardMedia,
} from '$lib/index';

const showHeader = ref<boolean>(true);
const showContent = ref<boolean>(true);
const showActions = ref<boolean>(true);
const showFooter = ref<boolean>(false);
const showMedia = ref<boolean>(true);
const showImage = ref<boolean>(false);

const actionsPosition = ref<'start' | 'end'>('end');
const actionsAlign = ref<'start' | 'center' | 'end'>('start');
const actionsHorizontal = ref<boolean>(false);

const mediaPosition = ref<'start' | 'end' | 'cover'>('start');

const contentLong = ref<boolean>(false);
const contentScroll = ref<boolean>(false);
</script>

<template>
  <div class="sv-page--padded">
    <h1>SvCardContent</h1>

    <div class="container">
      <label>
        <span>Show header</span>
        <input v-model="showHeader" type="checkbox" />
      </label>

      <label>
        <span>Show content</span>
        <input v-model="showContent" type="checkbox" />
      </label>

      <label>
        <span>Show actions</span>
        <input v-model="showActions" type="checkbox" />
      </label>

      <label>
        <span>Show footer</span>
        <input v-model="showFooter" type="checkbox" />
      </label>

      <label>
        <span>Show media</span>
        <input v-model="showMedia" type="checkbox" />
      </label>

      <label>
        <span>Show content image</span>
        <input v-model="showImage" type="checkbox" />
      </label>
    </div>

    <div class="container">
      <label>
        <span>Actions position</span>
        <select v-model="actionsPosition">
          <option>start</option>
          <option>end</option>
        </select>
      </label>

      <label>
        <span>Actions align</span>
        <select v-model="actionsAlign">
          <option>start</option>
          <option>center</option>
          <option>end</option>
        </select>
      </label>

      <label>
        <span>Actions horizontal</span>
        <input v-model="actionsHorizontal" type="checkbox" />
      </label>

      <label>
        <span>Media position</span>
        <select v-model="mediaPosition">
          <option>start</option>
          <option>end</option>
          <option>cover</option>
        </select>
      </label>

      <label>
        <span>Long content</span>
        <input v-model="contentLong" type="checkbox" />
      </label>

      <label>
        <span>Scroll content</span>
        <input v-model="contentScroll" type="checkbox" />
      </label>
    </div>

    <div class="container">
      <SvCard
        class="test test--tall sv-bg--surface-container-high sv-c--on-surface"
        :style="contentScroll ? 'max-block-size: 30rem' : undefined"
      >
        <SvCardHeader
          v-if="showHeader"
          class="sv-bg--surface-container-highest sv-t--headline-medium"
        >
          Header
        </SvCardHeader>

        <SvCardFooter
          v-if="showFooter"
          class="sv-bg--surface-container-highest sv-t--title-medium"
        >
          Footer
        </SvCardFooter>

        <SvCardContent
          v-if="showContent"
          class="sv-bg--surface-container-highest sv-t--body-large"
        >
          <div>Content 1</div>
          <div>Content 2</div>
          <img v-if="showImage" src="https://picsum.photos/500/200" style="inline-size: 500px; block-size: 200px" loading="lazy" />
          <div v-for="i in (contentLong ? 30 : 2)" :key="i">Content {{ 2 + i }}</div>
        </SvCardContent>

        <SvCardActions
          v-if="showActions"
          class="sv-bg--surface-container-highest sv-t--body-large"
          :position="actionsPosition"
          :align="actionsAlign"
          :horizontal="actionsHorizontal"
        >
          <div class="sv-bg--primary sv-c--on-primary">Actions 1</div>
          <div class="sv-bg--primary sv-c--on-primary">Actions 2</div>
        </SvCardActions>

        <SvCardMedia v-if="showMedia" :position="mediaPosition">
          <img src="https://picsum.photos/400/200" style="inline-size: 400px; block-size: 200px" loading="lazy" />
        </SvCardMedia>
      </SvCard>

      <SvCard
        class="test sv-bg--surface-container-high sv-c--on-surface"
        layout="horizontal"
        :style="contentScroll ? 'max-block-size: 10rem' : undefined"
      >
        <SvCardHeader
          v-if="showHeader"
          class="sv-bg--surface-container-highest sv-t--headline-medium"
        >
          Header
        </SvCardHeader>

        <SvCardFooter
          v-if="showFooter"
          class="sv-bg--surface-container-highest sv-t--title-medium"
        >
          Footer
        </SvCardFooter>

        <SvCardContent
          v-if="showContent"
          class="sv-bg--surface-container-highest sv-t--body-large"
        >
          <div>Content 1</div>
          <div>Content 2</div>
          <img v-if="showImage" src="https://picsum.photos/300/80" style="inline-size: 300px; block-size: 80px" loading="lazy" />
          <div v-for="i in (contentLong ? 30 : 2)" :key="i">Content {{ 2 + i }}</div>
        </SvCardContent>

        <SvCardActions
          v-if="showActions"
          class="sv-bg--surface-container-highest sv-t--body-large"
          :position="actionsPosition"
          :align="actionsAlign"
          :horizontal="actionsHorizontal"
        >
          <div class="sv-bg--primary sv-c--on-primary">Actions 1</div>
          <div class="sv-bg--primary sv-c--on-primary">Actions 2</div>
        </SvCardActions>

        <SvCardMedia v-if="showMedia" :position="mediaPosition">
          <img src="https://picsum.photos/150/250" style="inline-size: 150px; block-size: 250px" loading="lazy" />
        </SvCardMedia>
      </SvCard>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.container
  display: flex
  flex-wrap: wrap
  align-items: start
  gap: 1.5rem
  margin-block-end: 1.5rem

.test
  inline-size: 26rem
  font-size: 18px

  &--tall
    inline-size: 18rem
</style>
