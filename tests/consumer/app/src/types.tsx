/*
 * Type-level checks of the public API, compiled with `tsc` against the published declarations.
 * Each `@ts-expect-error` must fail to compile, otherwise `tsc` reports an unused directive.
 */
import {
  Button,
  Field,
  Input,
  NativeSelect,
  Textarea,
  useFieldControl,
  type ButtonProps,
  type InputSize,
} from '@stop-ui/react';
import { useRef, type InputHTMLAttributes } from 'react';
import { Button as ProjectButton } from './ui/button';

export function TypeChecks() {
  const input = useRef<HTMLInputElement>(null);
  const select = useRef<HTMLSelectElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const props: ButtonProps = { variant: 'soft', tone: 'danger' };
  const size: InputSize = 'lg';

  return (
    <>
      <Button ref={button} {...props} />
      <ProjectButton tone="success" variant="pill" />
      <ProjectButton tone="danger" variant="outline" />
      {/* @ts-expect-error project tones are not part of the kit Button */}
      <Button tone="success" />
      {/* @ts-expect-error unknown tone */}
      <ProjectButton tone="warning" />
      {/* @ts-expect-error unknown variant */}
      <ProjectButton variant="huge" />
      <Input ref={input} size={size} type="email" />
      {/* @ts-expect-error `size` is the kit size, not the native character width */}
      <Input size={20} />
      <NativeSelect ref={select} size="sm">
        <option />
      </NativeSelect>
      <Textarea ref={textarea} autoResize />
      <Field invalid required disabled readOnly id="field" className="field" />
    </>
  );
}

export function ColorInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="color" {...useFieldControl(props)} />;
}
