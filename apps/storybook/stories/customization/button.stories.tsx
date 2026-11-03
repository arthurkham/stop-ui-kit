import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, createButton } from '@stop-ui/react';
import type { CSSProperties } from 'react';
import './customization.css';

const meta = {
  title: 'Customization/Button/Examples',
  // Rendered inside the customization docs pages only.
  tags: ['!dev', '!autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 };
const source = (code: string) => ({ docs: { source: { code: code.trim(), language: 'tsx' } } });
const shapes = ['solid', 'soft', 'outline', 'ghost'] as const;

export const ChangeColor: Story = {
  parameters: source(`
<div className="checkout">
  <Button>Pay now</Button>
  <Button variant="outline">Apply coupon</Button>
</div>
`),
  render: () => (
    <div className="demo-orange" style={row}>
      {shapes.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

const AppButton = createButton({
  tones: {
    success: {
      color: 'var(--demo-success)',
      hover: 'var(--demo-success-hover)',
      fg: 'var(--demo-success-fg)',
      text: 'var(--demo-success-text)',
    },
  },
  variants: {
    pill: { extends: 'solid', className: 'demo-pill' },
    link: 'demo-link',
  },
  defaults: { size: 'md' },
});

export const CustomTone: Story = {
  parameters: source(`
<Button tone="success">Confirm</Button>
<Button tone="success" variant="soft">Confirm</Button>
<Button tone="success" variant="outline">Confirm</Button>
<Button tone="success" variant="ghost">Confirm</Button>
`),
  render: () => (
    <div style={row}>
      {shapes.map((variant) => (
        <AppButton key={variant} tone="success" variant={variant}>
          {variant}
        </AppButton>
      ))}
    </div>
  ),
};

export const CustomShapes: Story = {
  parameters: source(`
<Button variant="pill">Get started</Button>
<Button variant="pill" tone="success">Confirm</Button>
<Button variant="link">Learn more</Button>
<Button variant="link" tone="danger">Remove</Button>
`),
  render: () => (
    <div style={row}>
      <AppButton variant="pill">Get started</AppButton>
      <AppButton variant="pill" tone="success">
        Confirm
      </AppButton>
      <AppButton variant="link">Learn more</AppButton>
      <AppButton variant="link" tone="danger">
        Remove
      </AppButton>
    </div>
  ),
};

export const StylingHooks: Story = {
  parameters: source(`
<Button>Save</Button>
<Button loading>Saving</Button>
<Button variant="outline" tone="neutral">Cancel</Button>
`),
  render: () => (
    <div className="demo-hooks" style={row}>
      <Button>Save</Button>
      <Button loading>Saving</Button>
      <Button variant="outline" tone="neutral">
        Cancel
      </Button>
    </div>
  ),
};

export const OneOff: Story = {
  parameters: source(`
<Button className="w-full">Continue</Button>
`),
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Button style={{ width: '100%' }}>Continue</Button>
    </div>
  ),
};
