/**
 * Lints the compiled stylesheet against the supported browsers (see "browserslist" in
 * package.json). Catches CSS features that a Tailwind or token update starts emitting before
 * our browser floor supports them.
 */
export default {
  plugins: ['stylelint-no-unsupported-browser-features'],
  rules: {
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'error',
        ignorePartialSupport: true,
      },
    ],
  },
};
