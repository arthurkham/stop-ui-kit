import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { useLayoutEffect, type ReactNode } from 'react';
// Inlined, so the stylesheet applies synchronously and tests never run before it loads.
import bootstrapCss from 'bootstrap/dist/css/bootstrap.css?raw';
import { Button, Field, Input, Label, NativeSelect } from '@stop-ui/react';

// Bootstrap 3 sets `html { font-size: 10px }`; restore the kit's intended scale. Only the kit
// reads this variable.
const scaleFix = ':root { --sui-rem: 16px; }';

/**
 * Loads Bootstrap the way existing sites do: unlayered and untouched, after the kit's
 * stylesheet, so it has every chance to override the kit.
 */
function BootstrapHost({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const style = document.createElement('style');
    style.textContent = `${bootstrapCss}\n${scaleFix}`;
    document.head.append(style);
    return () => {
      style.remove();
    };
  }, []);
  return <>{children}</>;
}

const withBootstrap: Decorator = (Story) => (
  <BootstrapHost>
    <Story />
  </BootstrapHost>
);

const meta = {
  title: 'Compatibility/Bootstrap 3',
  // Bootstrap's global CSS must not leak into the shared docs page.
  tags: ['!autodocs'],
  decorators: [withBootstrap],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Bootstrap 3 loaded as usual, next to the default (isolated) stylesheet. Kit components render as
 * designed, Bootstrap components are unchanged, and Bootstrap's `!important` utilities such as
 * `.hidden` still apply to kit components.
 */
export const Untouched: Story = {
  name: 'Bootstrap 3, untouched',
  play: async ({ canvasElement }) => {
    // Bootstrap's element styles (bold labels, inherited button colors) must not reach the kit.
    const canvas = within(canvasElement);
    const style = (element: Element) => getComputedStyle(element);
    await expect(style(canvas.getByText('Kit input')).fontWeight).toBe('500');
    await expect(style(canvas.getByText('Kit input')).marginBottom).toBe('0px');
    await expect(style(canvas.getByRole('button', { name: 'Kit button' })).height).toBe('36px');
    await expect(style(canvas.getByRole('button', { name: 'Kit button' })).color).not.toBe(
      style(canvas.getByRole('button', { name: 'Bootstrap button' })).color,
    );
    await expect(style(canvas.getByRole('link', { name: 'Kit link' })).textDecorationLine).toBe(
      'none',
    );
    await expect(style(canvas.getByLabelText('Kit input')).height).toBe('36px');
    await expect(style(canvas.getByLabelText('Kit select')).height).toBe('36px');
    // Existing scripts and utility classes keep working on kit components.
    await expect(canvas.getByText('Hidden with .hidden')).not.toBeVisible();
  },
  render: () => (
    <form
      className="form-inline"
      style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}
    >
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
      <Button className="hidden">Hidden with .hidden</Button>
      <Field style={{ width: 200 }}>
        <Label>Kit input</Label>
        <Input type="email" placeholder="you@example.com" />
      </Field>
      <Field style={{ width: 160 }}>
        <Label>Kit select</Label>
        <NativeSelect>
          <option>Poland</option>
        </NativeSelect>
      </Field>
    </form>
  ),
};
