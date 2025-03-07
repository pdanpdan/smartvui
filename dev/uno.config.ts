import {
  defineConfig,
  presetIcons,
  presetWind4,
} from 'unocss';

export default defineConfig({
  presets: [
    presetWind4({
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
