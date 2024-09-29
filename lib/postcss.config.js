export default {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'last 3 Chrome versions',
        'last 2 Firefox versions',
        'last 3 Edge versions',
        'last 2 Safari versions',
        'last 3 Android versions',
        'last 3 ChromeAndroid versions',
        'last 1 FirefoxAndroid versions',
        'last 2 iOS versions',
      ],
    },
    'postcss-rtlcss': {
      ltrPrefix: ':dir(ltr)',
      rtlPrefix: ':dir(rtl)',
    },
  },
};
