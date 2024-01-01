<script setup>
import Overview from './OverviewComponent.vue';
import Reviews from './ReviewsComponent.vue';
import Spec from './SpecComponent.vue';
import DummyText from './DummyText.vue';
import Counter from '$dev/components/CounterButton.vue';
import Link from '$dev/components/Link.vue';
import { usePageContext } from '$dev/renderer/usePageContext';

const pageContext = usePageContext();
</script>

<template>
  <h1>Starship 🚀</h1>
  <p>
    <b>
      This page uses the default layout <code>/layouts/LayouDefault.vue</code>.
      <br />
      With the nested layout <code>/pages/starship/Layout.vue</code>.
    </b>
  </p>
  <p>
    <b> Outer layout is preserved when navigating the nested layout: <Counter /> </b>
  </p>
  <br />
  <div class="sub-navigation">
    <Link keep-scroll-position href="/tests_1/starship">Overview</Link>
    <Link keep-scroll-position href="/tests_1/starship/reviews">Reviews</Link>
    <Link keep-scroll-position href="/tests_1/starship/spec">Tech Spec</Link>
  </div>
  <div style="margin-top: 20px; border: 1px solid black; padding: 10px 50px">
    <Overview v-if="pageContext.routeParams?.view === 'overview'" />
    <Reviews v-if="pageContext.routeParams?.view === 'reviews'" />
    <Spec v-if="pageContext.routeParams?.view === 'spec'" />
  </div>
  <br />
  <p>
    <b>The scroll position is preserved when navigating the nested layout.</b>
  </p>
  <DummyText />
</template>

<style>
.sub-navigation a {
  margin-right: 10px;
}
</style>
