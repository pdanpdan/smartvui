import {
  defineConfig,
  presetIcons,
  presetWind3,
} from 'unocss';

export default defineConfig({
  presets: [
    presetWind3({
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
