import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { defineComponent, h, inject, nextTick, provide, ref } from 'vue';

import { useRender } from '$lib/composables';

describe('useRender [browser]', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const mountOptions = { attachTo: document.body };

  it('should render content in created div in `body`', () => {
    const Component = defineComponent({
      template: '<div>BASE</div>',
      setup() {
        const { render } = useRender();
        render(() => h('div', [ 'TEST1' ]));
        render(() => h('div', [ 'TEST2' ]));
      },
    });

    const wrapper = mount(Component, mountOptions);
    expect.soft(document.body.innerHTML).toContain('<div data-v-app=""><div>BASE</div></div><div><div>TEST1</div></div><div><div>TEST2</div></div>');
    wrapper.unmount();
  });

  it('should render content in specified element', async () => {
    const Component = defineComponent({
      template: '<div id="target">BASE</div>',
      setup() {
        const { render } = useRender();

        nextTick(() => {
          render(() => h('div', [ 'TEST' ]), { parentElement: document.getElementById('target') });
        });
      },
    });

    const wrapper = mount(Component, mountOptions);
    expect.soft(document.body.innerHTML).toContain('<div data-v-app=""><div id="target">BASE</div></div>');
    await nextTick();
    expect.soft(document.body.innerHTML).toContain('<div data-v-app=""><div id="target">BASE<div>TEST</div></div></div>');
    wrapper.unmount();
  });

  it('should remove rendered content when unmounted', () => {
    const Component = defineComponent({
      template: '<div>BASE</div>',
      setup() {
        const { render } = useRender();
        render(() => h('div', [ 'TEST' ]));
      },
    });

    const wrapper = mount(Component, mountOptions);
    expect.soft(document.body.innerHTML).toContain('<div data-v-app=""><div>BASE</div></div><div><div>TEST</div></div>');
    wrapper.unmount();

    expect.soft(document.body.innerHTML).toContain('<div data-v-app=""></div>');
  });

  it('should remove rendered content when stopped', async () => {
    const Component = defineComponent({
      template: '<div>BASE</div>',
      setup() {
        const { render } = useRender();
        const { stop } = render(() => h('div', [ 'TEST' ]));

        nextTick().then(() => {
          stop();
        });
      },
    });

    const wrapper = mount(Component, mountOptions);
    expect.soft(document.body.innerHTML).toContain('<div data-v-app=""><div>BASE</div></div><div><div>TEST</div></div>');

    await nextTick();
    expect.soft(document.body.innerHTML).toContain('<div data-v-app=""><div>BASE</div></div>');
    wrapper.unmount();
  });

  it('should return component element', () => {
    let temp = null;

    const Component = defineComponent({
      template: '<div id="test">TEST</div>',
    });

    const BaseComponent = defineComponent({
      template: '<div>BASE</div>',
      setup() {
        const { render } = useRender();
        const { getComponentElement } = render(Component);
        temp = getComponentElement();
      },
    });

    const wrapper = mount(BaseComponent, mountOptions);
    expect.soft(temp).toBe(document.getElementById('test'));
    wrapper.unmount();
  });

  it('should return component exposed props', () => {
    let tempExposed = null;
    let tempNotExposed = null;

    const ExposedComponent = defineComponent({
      template: '<div>TEST</div>',

      setup(_, { expose }) {
        expose({
          exposed: 'TEST',
        });
      },
    });

    const NotExposedComponent = defineComponent({
      template: '<div>TEST</div>',
    });

    const BaseComponent = defineComponent({
      template: '<div>BASE</div>',
      setup() {
        const { render } = useRender();
        const { getComponentExposed: getComponentExposed1 } = render(ExposedComponent);
        tempExposed = getComponentExposed1();

        const { getComponentExposed: getComponentExposed2 } = render(NotExposedComponent);
        tempNotExposed = getComponentExposed2();
      },
    });

    const wrapper = mount(BaseComponent, mountOptions);
    expect.soft(tempExposed).toEqual(expect.objectContaining({ exposed: 'TEST' }));
    expect.soft(tempExposed).not.toHaveProperty('$el');

    expect.soft(tempNotExposed).toHaveProperty('$el');
    wrapper.unmount();
  });

  it('should return component parent element', () => {
    let temp = null;

    const Component = defineComponent({
      template: '<div id="test">TEST</div>',
    });

    const BaseComponent = defineComponent({
      template: '<div>BASE</div>',
      setup() {
        const { render } = useRender();
        const { getParentElement } = render(Component);
        temp = getParentElement();
      },
    });

    const wrapper = mount(BaseComponent, mountOptions);
    expect.soft(temp).toBe(document.getElementById('test')!.parentElement);
    wrapper.unmount();
  });

  it('should update when component changes', async () => {
    const Component = defineComponent({
      template: '<div>BASE</div>',
      setup() {
        const { render } = useRender();
        const comp = ref(() => h('div', [ 'TEST1' ]));
        render(comp);

        nextTick().then(() => {
          comp.value = () => h('div', [ 'TEST2' ]);
        });
      },
    });

    const wrapper = mount(Component, mountOptions);
    expect.soft(document.body.innerHTML).toContain('<div>TEST1</div>');

    await nextTick();
    expect.soft(document.body.innerHTML).toContain('<div>TEST2</div>');
    wrapper.unmount();
  });

  it('should update when props change', async () => {
    const Component = defineComponent({
      props: [ 'defaults' ],
      template: '<div>TEST{{ defaults }}</div>',
    });

    const BaseComponent = defineComponent({
      template: '<div>BASE</div>',
      setup() {
        const { render } = useRender();
        const props = ref({ defaults: 1 });
        render(Component, { props });

        nextTick().then(() => {
          props.value = { defaults: 2 };
        });
      },
    });

    const wrapper = mount(BaseComponent, mountOptions);
    expect.soft(document.body.innerHTML).toContain('<div>TEST1</div>');

    await nextTick();
    expect.soft(document.body.innerHTML).toContain('<div>TEST2</div>');
    wrapper.unmount();
  });

  it('should update when children change', async () => {
    const Component = defineComponent({
      template: '<div><slot /></div>',
    });

    const children = ref('TEST1');

    const BaseComponent = defineComponent({
      template: '<div>BASE</div>',
      setup() {
        const { render } = useRender();

        nextTick().then(() => {
          render(Component, {
            children: () => children.value,
          });
        });
      },
    });

    const wrapper = mount(BaseComponent, mountOptions);
    await nextTick();
    expect.soft(document.body.innerHTML).toContain('<div>TEST1</div>');

    children.value = 'TEST2';

    await nextTick();
    expect.soft(document.body.innerHTML).toContain('<div>TEST2</div>');
    wrapper.unmount();
  });

  it('should have access to inject', () => {
    const Component = defineComponent({
      template: '<div>{{ val }}</div>',
      setup() {
        return { val: inject('TEST', 'NOT_FOUND') };
      },
    });

    const BaseComponent = defineComponent({
      template: '<div>BASE</div>',
      setup() {
        const { render } = useRender();
        render(Component);
      },
    });

    const wrapper = mount(BaseComponent, {
      ...mountOptions,
      global: {
        provide: {
          TEST: 'VALID',
        },
      },
    });
    expect.soft(document.body.innerHTML).toContain('<div>VALID</div>');
    wrapper.unmount();
  });

  it('should have access to inject from the component where it was called', () => {
    const Component = defineComponent({
      template: '<div>{{ val }}</div>',
      setup() {
        return { val: inject('TEST', 'NOT_FOUND') };
      },
    });

    const BaseComponent = defineComponent({
      template: '<div>BASE</div>',
      setup() {
        const { render } = useRender();
        provide('TEST', 'VALID');
        render(Component);
      },
    });

    const wrapper = mount(BaseComponent, {
      ...mountOptions,
      global: {
        provide: {
          TEST: 'INVALID',
        },
      },
    });
    expect.soft(document.body.innerHTML).toContain('<div>VALID</div>');
    wrapper.unmount();
  });
});
