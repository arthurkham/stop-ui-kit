import {
  Button,
  Field,
  FieldDescription,
  FieldError,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  NativeSelect,
  Textarea,
} from '@stop-ui/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Every component in its common states. Host pages render it next to different global CSS, and
 * the test compares its computed styles with the kit-only page: host CSS must not leak in.
 */
export function Kitchen() {
  return (
    <div
      data-kitchen=""
      // Inherited values come from the host page, so they are fixed here.
      style={{
        boxSizing: 'border-box',
        width: 432,
        padding: 16,
        display: 'grid',
        gap: 16,
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
        lineHeight: 'normal',
        color: '#000',
      }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        <Button>Solid</Button>
        <Button variant="soft" tone="danger">
          Soft
        </Button>
        <Button variant="outline" tone="neutral">
          Outline
        </Button>
        <Button variant="ghost" size="sm">
          Ghost
        </Button>
        <Button asChild size="lg">
          <a href="#link">Link</a>
        </Button>
      </div>
      <Field invalid required>
        <Label>Email</Label>
        <Input type="email" placeholder="name@example.com" />
        <FieldDescription>Description</FieldDescription>
        <FieldError>Error message</FieldError>
      </Field>
      <Field>
        <Label>Bio</Label>
        <Textarea />
      </Field>
      <Field>
        <Label>Country</Label>
        <NativeSelect>
          <option>Poland</option>
        </NativeSelect>
      </Field>
      <Field>
        <Label>Price</Label>
        <InputGroup>
          <Input inputMode="decimal" />
          <InputGroupAddon>EUR</InputGroupAddon>
        </InputGroup>
      </Field>
      <Field disabled>
        <Label>Disabled</Label>
        <Input defaultValue="Value" />
      </Field>
      <Field readOnly>
        <Label>Read only</Label>
        <Input defaultValue="Value" />
      </Field>
    </div>
  );
}

export function mount(element: React.ReactNode) {
  const root = document.getElementById('root');
  if (!root) throw new Error('Missing #root');
  createRoot(root).render(<StrictMode>{element}</StrictMode>);
}
