import type { Decorator, Preview } from '@storybook/react-vite';
import './preview.css';

const themes = ['light', 'dark', 'system'] as const;
type Theme = (typeof themes)[number];

const isTheme = (value: unknown): value is Theme => themes.includes(value as Theme);

const withTheme: Decorator = (Story, context) => {
  const theme: Theme = isTheme(context.globals.theme) ? context.globals.theme : 'light';
  const isCanvas = context.viewMode === 'story';

  return (
    <div
      data-sui-theme={theme}
      style={{
        background: 'var(--sui-surface)',
        color: 'var(--sui-fg)',
        padding: 24,
        boxSizing: 'border-box',
        minHeight: isCanvas ? '100vh' : undefined,
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withTheme],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Fail the a11y panel on violations instead of only reporting them.
      test: 'error',
    },
  },
};

export default preview;
