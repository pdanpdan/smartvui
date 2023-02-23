import VitePlayWrapper from './VitePlayWrapper.vue'

export default {
  // Optional Wrapper component for the example
  Wrapper: VitePlayWrapper,
  // Optional function to extend the Vue app instance
  extend({ app }) {
    // app is the Vue app instance
    // you can add Vue plugins normally like this:
    // app.use(SomePlugin)
    console.error(app)
  },
}
