import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useLayoutEffect, type ReactNode } from 'react';
// Inlined, so the stylesheet applies synchronously and tests never run before it loads.
import bootstrapCss from 'bootstrap/dist/css/bootstrap.css?raw';
import { Button } from '@stop-ui/react';

type BootstrapMode = 'unlayered' | 'layered';

const hostCss: Record<BootstrapMode, string> = {
  // How most legacy apps load Bootstrap: unlayered CSS beats any layered CSS.
  unlayered: bootstrapCss,
  // Recommended: Bootstrap in the lowest layer. The layer order itself is declared before any
  // other CSS (see .storybook/layers.css), as an application would in its <head>.
  layered: `@layer legacy {
${bootstrapCss}
}`,
};

// Bootstrap 3 sets `html { font-size: 10px }`; restore the kit's intended scale.
const scaleFix = ':root { --sui-rem: 16px; }';

function BootstrapHost({ mode, children }: { mode: BootstrapMode; children: ReactNode }) {
  useLayoutEffect(() => {
    const style = document.createElement('style');
    style.textContent = `${hostCss[mode]}\n${scaleFix}`;
    document.head.append(style);
    return () => {
      style.remove();
    };
  }, [mode]);

  return <>{children}</>;
}

const withBootstrap: Decorator = (Story, context) => {
  const mode = context.parameters.bootstrap as BootstrapMode;
  return (
    <BootstrapHost mode={mode}>
      <Story />
    </BootstrapHost>
  );
};

const meta = {
  title: 'Compatibility/Bootstrap 3',
  // Bootstrap's global CSS must not leak into the shared docs page.
  tags: ['!autodocs'],
  decorators: [withBootstrap],
  render: () => (
    <form className="form-inline" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <div className="form-group">
        <label htmlFor="bootstrap-email">Email</label>{' '}
        <input
          id="bootstrap-email"
          type="email"
          className="form-control"
          placeholder="you@example.com"
        />
      </div>
      <button type="button" className="btn btn-default">
        Bootstrap button
      </button>
      <Button>Kit button</Button>
      <Button variant="outline">Kit outline</Button>
      <Button asChild variant="ghost">
        <a href="https://getbootstrap.com/docs/3.4/">Kit link</a>
      </Button>
    </form>
  ),
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Bootstrap loaded into a cascade layer below the kit. The kit renders as designed,
 * while the application's own unlayered CSS can still override both.
 */
export const Layered: Story = {
  name: 'Bootstrap in a layer (recommended)',
  parameters: { bootstrap: 'layered' },
};

/**
 * Bootstrap loaded as usual. Its unlayered element styles (e.g. `button { color: inherit }`
 * from normalize.css) override the kit, which breaks colors and typography.
 */
export const Unlayered: Story = {
  name: 'Bootstrap unlayered (broken)',
  decorators: [
    (Story) => (
      <>
        <p role="note" style={{ margin: '0 0 16px', fontSize: 14 }}>
          <strong>Intentionally broken:</strong> Bootstrap is loaded without a cascade layer, so its
          global styles override the kit. See “Bootstrap in a layer” for the fix.
        </p>
        <Story />
      </>
    ),
  ],
  parameters: {
    bootstrap: 'unlayered',
    // This story intentionally demonstrates the broken state.
    a11y: { test: 'off' },
    // A snapshot of a known-broken state adds no protection and only spends the visual test budget.
    chromatic: { disableSnapshot: true },
  },
};
