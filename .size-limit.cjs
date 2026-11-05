// Bundle size budgets for what applications ship. Peer dependencies are excluded and sizes are
// brotli-compressed. Raise a budget only with a reason in the pull request.
const ignore = ['react', 'react-dom', 'react/jsx-runtime'];

// Workspace packages resolve to their sources during development, and the styles entry imports
// its Tailwind source for the library build. Applications import the compiled CSS separately,
// so CSS imports are stubbed out and the stylesheet gets its own budget.
const stubCss = (config) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    {
      name: 'stub-css',
      resolveId: (id) => (id.endsWith('.css') ? '\0stub-css' : null),
      load: (id) => (id === '\0stub-css' ? { code: '', moduleType: 'js' } : null),
    },
  ],
});

module.exports = [
  {
    name: '@stop-ui/react: Button',
    path: 'packages/react/dist/index.js',
    import: '{ Button }',
    ignore,
    modifyRolldownConfig: stubCss,
    limit: '2.5 kB',
  },
  {
    name: '@stop-ui/react: Button + createButton',
    path: 'packages/react/dist/index.js',
    import: '{ Button, createButton }',
    ignore,
    modifyRolldownConfig: stubCss,
    limit: '3 kB',
  },
  {
    name: '@stop-ui/react: form fields',
    path: 'packages/react/dist/index.js',
    import:
      '{ Field, FieldDescription, FieldError, Label, Input, InputGroup, InputGroupAddon, NativeSelect, Textarea }',
    ignore,
    modifyRolldownConfig: stubCss,
    limit: '3.5 kB',
  },
  {
    name: '@stop-ui/react: styles.css (isolated)',
    path: 'packages/react/dist/styles.css',
    rolldown: false,
    limit: '3.5 kB',
  },
  {
    name: '@stop-ui/react: styles.layer.css',
    path: 'packages/react/dist/styles.layer.css',
    rolldown: false,
    limit: '3.5 kB',
  },
];
