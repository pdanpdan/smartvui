<script setup lang="ts">
import { h, ref, shallowRef } from 'vue';

import type { ComponentProps } from '$lib/utils/types';

import { SvSurfaceModal, SvSurfacePopover } from '$lib/components';
import { useRender } from '$lib/composables';

const { render } = useRender();

let index = 0;
function start() {
  index += 1;
  const localIndex = index;
  const text = ref<string>('');
  const style = `top: ${ localIndex * 100 }px; left: ${ localIndex * 100 }px; `;
  const props = ref<ComponentProps<typeof SvSurfaceModal> | ComponentProps<typeof SvSurfacePopover>>({ style });
  const component = shallowRef<typeof SvSurfaceModal | typeof SvSurfacePopover>(SvSurfacePopover);

  const { getComponentExposed, stop } = render(component, {
    props,
    children: () => [ h(
      'div',
      {
        style: 'background: white; padding: 20px',
      },
      [
        text.value,
        ' | ',
        h('button', 'Button'),
      ],
    ) ],
  });

  let counter = 200;

  const update = () => {
    text.value = `Content ${ localIndex } ${ counter }`;

    if (counter === 200) {
      props.value = {
        style: `${ style }color: black`,
      };
    }
    if (counter === 195) {
      getComponentExposed()?.show();
    }
    if (counter === 140) {
      props.value = {
        style: `${ style }color: red`,
        backdropClose: true,
        onHideEnd() {
          counter = 101;
        },
      };
    }
    if (counter === 105) {
      getComponentExposed()?.hide();
    }
    if (counter === 100) {
      component.value = component.value === SvSurfacePopover ? SvSurfaceModal : SvSurfacePopover;
      props.value = {
        style: `${ style }color: green`,
        backdropClose: false,
      };
    }
    if (counter === 95) {
      getComponentExposed()?.show();
    }
    if (counter === 50) {
      props.value = {
        style: `${ style }color: blue`,
        backdropClose: true,
        onHideEnd() {
          counter = 0;
        },
      };
    }
    if (counter === 5) {
      getComponentExposed()?.hide();
    }

    if (counter > 0) {
      setTimeout(() => {
        counter -= 1;
        update();
      }, 100);
    } else {
      index -= 1;
      stop();
    }
  };
  update();
}
</script>

<template>
  <div class="sv-page--padded">
    <h1>useRender</h1>
    <button type="button" @click="start">Start</button>
  </div>
</template>
