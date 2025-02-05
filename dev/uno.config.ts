import {
  defineConfig,
  presetIcons,
  presetUno,
} from 'unocss';

export default defineConfig({
  presets: [
    presetUno({
      attributifyPseudo: true,
    }),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
});
