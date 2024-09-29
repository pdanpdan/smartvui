<script setup lang="ts">
defineSlots<{
  header: (props: { expanded: boolean; toggle: (v?: boolean) => void; }) => unknown;
  toggle: (props: { expanded: boolean; toggle: (v?: boolean) => void; }) => unknown;
  default: (props: { expanded: boolean; toggle: (v?: boolean) => void; }) => unknown;
}>();

const modelValue = defineModel<boolean>({ type: Boolean, default: false });

function toggle(v?: boolean) {
  modelValue.value = v !== undefined
    ? v === true
    : modelValue.value !== true;
}
</script>

<template>
  <div
    class="sv-expansion-item"
    :class="`sv-expansion-item--${ modelValue === true ? 'expanded' : 'collapsed' }`"
  >
    <div
      class="sv-expansion-item__header"
      :class="`sv-expansion-item__header--${ modelValue === true ? 'expanded' : 'collapsed' }`"
    >
      <slot name="header" :expanded="modelValue" :toggle="toggle">
        Header
        <slot name="toggle" :expanded="modelValue" :toggle="toggle">
          Toggle
        </slot>
      </slot>
    </div>
    <div
      class="sv-expansion-item__content"
      :class="`sv-expansion-item__content--${ modelValue === true ? 'expanded' : 'collapsed' }`"
    >
      <slot :expanded="modelValue" :toggle="toggle">Content</slot>
    </div>
  </div>
</template>

<style scoped lang="sass">
.sv-expansion-item
  display: inline-grid
  grid-template-rows: min-content 0fr
  overflow: hidden
  transition: grid-template-rows .3s

  &__content
    min-block-size: 0
    transition: visibility .3s
    visibility: hidden

    &--expanded
      visibility: visible

  &--expanded
    grid-template-rows: min-content 1fr
</style>
