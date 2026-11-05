import '@stop-ui/react/styles.css';
import '../styles/global.css';
import { Button, Field, FieldError, Input, Label } from '@stop-ui/react';
import { mount } from '../kitchen';

mount(
  <main style={{ display: 'grid', gap: 24, padding: 16 }}>
    <Button data-expect="height: 45px; border-top-left-radius: 999px">Scaled</Button>
    <Field invalid>
      <Label>Scaled</Label>
      <Input data-expect="height: 45px" />
      <FieldError data-expect="color: rgb(159, 18, 57)">Error</FieldError>
    </Field>
  </main>,
);
