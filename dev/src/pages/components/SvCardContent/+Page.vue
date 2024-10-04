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
const showFooter = ref<boolean>(true);
const showMedia = ref<boolean>(true);
const showImage = ref<boolean>(true);

const actionsPosition = ref<'start' | 'end'>('end');
const actionsAlign = ref<'start' | 'center' | 'end'>('start');
const actionsHorizontal = ref<boolean>(false);

const mediaPosition = ref<'start' | 'end' | 'cover'>('start');
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
    </div>

    <div class="container">
      <SvCard
        class="test test--tall sv-bg--surface-container-high sv-c--on-surface"
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
          class="sv-bg--surface-container-highest"
        >
          <div class="sv-t--body-large">Content 1</div>
          <img v-if="showImage" src="https://picsum.photos/500/200" />
          <div class="sv-t--body-large">Content 2</div>
          <div class="sv-t--body-large">Content 3</div>
        </SvCardContent>

        <SvCardActions
          v-if="showActions"
          class="sv-bg--surface-container-highest"
          :position="actionsPosition"
          :align="actionsAlign"
          :horizontal="actionsHorizontal"
        >
          <div class="sv-t--body-large sv-bg--primary sv-c--on-primary">Actions 1</div>
          <div class="sv-t--body-large sv-bg--primary sv-c--on-primary">Actions 2</div>
        </SvCardActions>

        <SvCardMedia v-if="showMedia" :position="mediaPosition">
          <img src="https://picsum.photos/500/250" />
        </SvCardMedia>
      </SvCard>

      <SvCard
        class="test sv-bg--surface-container-high sv-c--on-surface"
        layout="horizontal"
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
          class="sv-bg--surface-container-highest"
        >
          <div class="sv-t--body-large">Content 1</div>
          <img v-if="showImage" src="https://picsum.photos/500/200" />
          <div class="sv-t--body-large">Content 2</div>
          <div class="sv-t--body-large">Content 3</div>
        </SvCardContent>

        <SvCardActions
          v-if="showActions"
          class="sv-bg--surface-container-highest"
          :position="actionsPosition"
          :align="actionsAlign"
          :horizontal="actionsHorizontal"
        >
          <div class="sv-t--body-large sv-bg--primary sv-c--on-primary">Actions 1</div>
          <div class="sv-t--body-large sv-bg--primary sv-c--on-primary">Actions 2</div>
        </SvCardActions>

        <SvCardMedia v-if="showMedia" :position="mediaPosition">
          <img src="https://picsum.photos/200/300" />
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
  flex: 0 1 36rem
  font-size: 18px

  &--tall
    flex: 0 1 18rem
</style>
