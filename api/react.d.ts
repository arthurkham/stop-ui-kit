// button/button-base.d.ts
import { ButtonSize, ButtonVariant } from '@stop-ui/styles';
import * as React from 'react';
type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
interface ButtonStyleProps<TVariant extends string, TTone extends string> {
    variant?: TVariant;
    tone?: TTone;
    size?: ButtonSize;
}
interface ButtonElementProps {
    asChild?: false;
    loading?: boolean;
    loadingLabel?: string;
}
interface ButtonSlotProps {
    asChild: true;
    loading?: never;
    loadingLabel?: never;
    disabled?: never;
    type?: never;
}
export interface ButtonInternalProps {
    baseVariant?: ButtonVariant;
}
export type ButtonBaseProps<TVariant extends string = string, TTone extends string = string> = Omit<NativeButtonProps, 'color'> & ButtonStyleProps<TVariant, TTone> & (ButtonElementProps | ButtonSlotProps);
export declare const ButtonBase: React.ForwardRefExoticComponent<(ButtonBaseProps<string, string> & ButtonInternalProps) & React.RefAttributes<HTMLButtonElement>>;
export {};

// button/button.d.ts
import { ButtonTone, ButtonVariant } from '@stop-ui/styles';
import { ButtonBaseProps } from './button-base.js';
import type * as React from 'react';
export type ButtonProps = ButtonBaseProps<ButtonVariant, ButtonTone>;
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

// button/create-button.d.ts
import { ButtonSize, ButtonTone, ButtonVariant } from '@stop-ui/styles';
import { ButtonBaseProps } from './button-base.js';
import * as React from 'react';
export type ButtonVariantDefinition = string | {
    extends: ButtonVariant;
    className: string;
};
export interface ButtonToneDefinition {
    color: string;
    hover: string;
    fg: string;
    text?: string;
}
export interface CreateButtonOptions<TTone extends string, TVariant extends string> {
    tones?: Record<TTone, ButtonToneDefinition>;
    variants?: Record<TVariant, ButtonVariantDefinition>;
    defaults?: {
        variant?: ButtonVariant | TVariant;
        tone?: ButtonTone | TTone;
        size?: ButtonSize;
    };
}
export type CreatedButtonProps<TTone extends string, TVariant extends string> = ButtonBaseProps<ButtonVariant | TVariant, ButtonTone | TTone>;
export declare function createButton<TTone extends string = never, TVariant extends string = never>(options?: CreateButtonOptions<TTone, TVariant>): React.ForwardRefExoticComponent<CreatedButtonProps<TTone, TVariant> & React.RefAttributes<HTMLButtonElement>>;

// button/index.d.ts
export { Button, type ButtonProps } from './button.js';
export { createButton, type ButtonToneDefinition, type ButtonVariantDefinition, type CreateButtonOptions, type CreatedButtonProps, } from './create-button.js';

// field/field-context.d.ts
import * as React from 'react';
export type FieldPart = 'description' | 'error';
export interface FieldContextValue {
    controlId: string;
    descriptionId: string;
    errorId: string;
    hasDescription: boolean;
    hasError: boolean;
    invalid: boolean;
    required: boolean;
    disabled: boolean;
    readOnly: boolean;
    registerPart: (part: FieldPart, present: boolean) => void;
}
export declare const FieldContext: React.Context<FieldContextValue | null>;
export declare function useFieldContext(): FieldContextValue | null;
interface FieldControlProps {
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: React.AriaAttributes['aria-invalid'];
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
}
interface FieldControlOptions {
    readOnly?: boolean;
}
export declare function useFieldControl<P extends FieldControlProps>(props: P, options?: FieldControlOptions): P;
export {};

// field/field.d.ts
import * as React from 'react';
export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
    id?: string;
    invalid?: boolean;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
}
export declare const Field: React.ForwardRefExoticComponent<FieldProps & React.RefAttributes<HTMLDivElement>>;
export type FieldDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
export declare const FieldDescription: React.ForwardRefExoticComponent<FieldDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
    live?: boolean;
}
export declare const FieldError: React.ForwardRefExoticComponent<FieldErrorProps & React.RefAttributes<HTMLParagraphElement>>;

// field/index.d.ts
export { Field, FieldDescription, FieldError, type FieldDescriptionProps, type FieldErrorProps, type FieldProps, } from './field.js';
export { useFieldControl, type FieldContextValue } from './field-context.js';

// index.d.ts
export { Button, createButton, type ButtonProps, type ButtonToneDefinition, type ButtonVariantDefinition, type CreateButtonOptions, type CreatedButtonProps, } from './button/index.js';
export { Field, FieldDescription, FieldError, useFieldControl, type FieldContextValue, type FieldDescriptionProps, type FieldErrorProps, type FieldProps, } from './field/index.js';
export { Input, type InputProps } from './input/index.js';
export { InputGroup, InputGroupAddon, type InputGroupAddonProps, type InputGroupProps, } from './input-group/index.js';
export { Label, type LabelProps } from './label/index.js';
export { NativeSelect, type NativeSelectProps } from './native-select/index.js';
export { Textarea, type TextareaProps } from './textarea/index.js';
export { buttonTones, buttonVariants, cn, inputVariants, type ButtonSize, type ButtonTone, type ButtonVariant, type ButtonVariantProps, type InputSize, } from '@stop-ui/styles';

// input-group/index.d.ts
export { InputGroup, InputGroupAddon, type InputGroupAddonProps, type InputGroupProps, } from './input-group.js';

// input-group/input-group-context.d.ts
import { InputSize } from '@stop-ui/styles';
import * as React from 'react';
export interface InputGroupContextValue {
    size: InputSize;
}
export declare const InputGroupContext: React.Context<InputGroupContextValue | null>;

// input-group/input-group.d.ts
import { InputSize } from '@stop-ui/styles';
import * as React from 'react';
export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: InputSize;
}
export declare const InputGroup: React.ForwardRefExoticComponent<InputGroupProps & React.RefAttributes<HTMLDivElement>>;
export type InputGroupAddonProps = React.HTMLAttributes<HTMLSpanElement>;
export declare const InputGroupAddon: React.ForwardRefExoticComponent<InputGroupAddonProps & React.RefAttributes<HTMLSpanElement>>;

// input/index.d.ts
export { Input, type InputProps } from './input.js';

// input/input.d.ts
import { InputSize } from '@stop-ui/styles';
import * as React from 'react';
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: InputSize;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;

// internal/compose-refs/compose-refs.d.ts
import type * as React from 'react';
type PossibleRef<T> = React.Ref<T> | undefined;
export declare function setRef<T>(ref: PossibleRef<T>, value: T | null): void;
export declare function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T>;
export {};

// internal/compose-refs/index.d.ts
export { composeRefs, setRef } from './compose-refs.js';

// internal/slot/index.d.ts
export { Slot, type SlotProps } from './slot.js';

// internal/slot/slot.d.ts
import * as React from 'react';
export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
}
export declare const Slot: React.ForwardRefExoticComponent<SlotProps & React.RefAttributes<HTMLElement>>;

// internal/use-isomorphic-layout-effect.d.ts
import { useEffect } from 'react';
export declare const useIsomorphicLayoutEffect: typeof useEffect;

// label/index.d.ts
export { Label, type LabelProps } from './label.js';

// label/label.d.ts
import * as React from 'react';
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}
export declare const Label: React.ForwardRefExoticComponent<LabelProps & React.RefAttributes<HTMLLabelElement>>;

// native-select/index.d.ts
export { NativeSelect, type NativeSelectProps } from './native-select.js';

// native-select/native-select.d.ts
import { InputSize } from '@stop-ui/styles';
import * as React from 'react';
export interface NativeSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    size?: InputSize;
}
export declare const NativeSelect: React.ForwardRefExoticComponent<NativeSelectProps & React.RefAttributes<HTMLSelectElement>>;

// textarea/index.d.ts
export { Textarea, type TextareaProps } from './textarea.js';

// textarea/textarea.d.ts
import { InputSize } from '@stop-ui/styles';
import * as React from 'react';
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    size?: InputSize;
    autoResize?: boolean;
}
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
