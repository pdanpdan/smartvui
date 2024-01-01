<script setup lang="ts">
import { ref } from 'vue';
import LayoutDefault from '$dev/pages/tests_1/LayoutShell.vue';
import Link from '$dev/components/Link.vue';
import Btn from '$dev/components/Btn.vue';

const model = ref(true);
</script>

<template>
  <LayoutDefault>
    <template #default="slotScope">
      <slot v-bind="slotScope" />
    </template>

    <template #aside-before="{ visibility, setVisibility }">
      <input
        type="checkbox"
        :checked="visibility.asideAfter"
        @input="(ev) => setVisibility('asideAfter', (ev.target as HTMLInputElement).checked)"
      />

      <nav>
        <ul>
          <li>
            <Link href="/tests_1/">Welcome</Link>
          </li>
          <li>
            <Link href="/tests_1/markdown">Markdown</Link>
          </li>
          <li>
            <Link href="/tests_1/star-wars">Data Fetching</Link>
          </li>
          <li>
            <Link href="/tests_1/hello">Routing</Link>
          </li>

          <li>
            <Link href="/tests_1/html-only">HTML only</Link>
          </li>
          <li>
            <Link href="/tests_1/spa">SPA</Link>
          </li>
          <li>
            <Link href="/tests_1/html-js">HTML + JS</Link>
          </li>
          <li>
            <Link href="/tests_1/ssr">SSR</Link>
          </li>

          <li>
            <Link href="/tests_1/layout">Layout</Link>
          </li>
          <li>
            <Link href="/tests_1/starship">Starship</Link>
          </li>
        </ul>
      </nav>
    </template>

    <template #aside-after="{ setVisibility }">
      <div>
        <div>Aside after</div>
        <button type="button" @click="setVisibility('asideAfter', false)">Close</button>
      </div>
    </template>

    <template #header>
      <div style="padding: 8px">
        Header

        <div>
          <Btn
            icon
            theme="standard"
            class="c-primary"
          >
            <i>i-mdi-cog</i>
          </Btn>
          <Btn
            icon
            theme="standard"
            class="c-accent"
          >
            <i>i-mdi-menu-open</i>
          </Btn>

          <Btn
            icon
            theme="outlined"
            class="c-primary"
          >
            <i>i-mdi-cog</i>
          </Btn>
          <Btn
            icon
            theme="outlined"
            class="c-accent"
          >
            <i>i-mdi-menu-open</i>
          </Btn>

          <Btn
            icon
            theme="filled"
            class="c-primary"
          >
            <i>i-mdi-cog</i>
          </Btn>
          <Btn
            icon
            theme="filled"
            class="c-accent"
          >
            <i>i-mdi-menu-open</i>
          </Btn>
        </div>

        <div>
          <Btn
            v-model="model"
            icon
            theme="standard"
            class="c-primary"
          >
            <i>i-mdi-cog</i>
          </Btn>
          <Btn
            v-model="model"
            icon
            theme="standard"
            class="c-accent"
          >
            <i>i-mdi-menu-open</i>
          </Btn>

          <Btn
            v-model="model"
            icon
            theme="outlined"
            class="c-primary"
          >
            <i>i-mdi-cog</i>
          </Btn>
          <Btn
            v-model="model"
            icon
            theme="outlined"
            class="c-accent"
          >
            <i>i-mdi-menu-open</i>
          </Btn>

          <Btn
            v-model="model"
            icon
            theme="filled"
            class="c-primary"
          >
            <i>i-mdi-cog</i>
          </Btn>
          <Btn
            v-model="model"
            icon
            theme="filled"
            class="c-accent"
          >
            <i>i-mdi-menu-open</i>
          </Btn>
        </div>
      </div>
    </template>

    <template #footer>
      Footer
    </template>
  </LayoutDefault>
</template>
