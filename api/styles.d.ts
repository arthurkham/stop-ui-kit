// cn.d.ts
import { ClassValue } from 'clsx';
export declare function cn(...inputs: ClassValue[]): string;

// index.d.ts
export { cn } from './cn.js';
export { buttonSpinnerClassName, buttonTones, buttonVariants, type ButtonSize, type ButtonTone, type ButtonVariant, type ButtonVariantProps, } from './recipes/button.js';
export { fieldClassName, fieldDescriptionClassName, fieldErrorClassName, fieldErrorIconClassName, labelClassName, requiredMarkerClassName, } from './recipes/field.js';
export { inputGroupAddonClassName, inputGroupVariants, inputVariants, selectIconClassName, selectVariants, selectWrapperClassName, textareaVariants, type InputSize, type InputVariantProps, } from './recipes/input.js';

// recipes/button.d.ts
import { VariantProps } from 'class-variance-authority';
export declare const buttonTones: readonly ["primary", "neutral", "danger"];
export type ButtonTone = (typeof buttonTones)[number];
export declare const buttonVariants: (props?: ({
    variant?: "solid" | "soft" | "outline" | "ghost" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & import('class-variance-authority/types').ClassProp) | undefined) => string;
export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
export type ButtonVariant = NonNullable<ButtonVariantProps['variant']>;
export type ButtonSize = NonNullable<ButtonVariantProps['size']>;
export declare const buttonSpinnerClassName = "sui:size-[1em] sui:animate-spin sui:motion-reduce:[animation-duration:1.5s]";

// recipes/field.d.ts
export declare const fieldClassName = "sui:box-border sui:flex sui:min-w-0 sui:flex-col sui:gap-1.5";
export declare const labelClassName = "sui:m-0 sui:[font-family:inherit] sui:text-sm sui:font-medium sui:[letter-spacing:normal] sui:normal-case sui:text-fg sui:data-disabled:opacity-50";
export declare const requiredMarkerClassName = "sui:ms-0.5 sui:text-danger-text";
export declare const fieldDescriptionClassName = "sui:m-0 sui:text-sm sui:text-fg-muted";
export declare const fieldErrorClassName = "sui:m-0 sui:flex sui:items-start sui:gap-1.5 sui:text-sm sui:text-danger-text";
export declare const fieldErrorIconClassName = "sui:mt-[0.2em] sui:size-[1em] sui:shrink-0";

// recipes/input.d.ts
import { VariantProps } from 'class-variance-authority';
export declare const inputVariants: (props?: ({
    size?: "sm" | "md" | "lg" | null | undefined;
    grouped?: boolean | null | undefined;
} & import('class-variance-authority/types').ClassProp) | undefined) => string;
export declare const textareaVariants: (props?: ({
    size?: "sm" | "md" | "lg" | null | undefined;
    autoResize?: boolean | null | undefined;
} & import('class-variance-authority/types').ClassProp) | undefined) => string;
export declare const selectVariants: (props?: ({
    size?: "sm" | "md" | "lg" | null | undefined;
} & import('class-variance-authority/types').ClassProp) | undefined) => string;
export declare const selectWrapperClassName = "sui:relative sui:flex sui:w-full sui:min-w-0";
export declare const selectIconClassName = "sui:pointer-events-none sui:absolute sui:inset-y-0 sui:end-2.5 sui:flex sui:items-center sui:text-fg-muted sui:[&>svg]:size-4";
export declare const inputGroupVariants: (props?: ({
    size?: "sm" | "md" | "lg" | null | undefined;
} & import('class-variance-authority/types').ClassProp) | undefined) => string;
export declare const inputGroupAddonClassName: string;
export type InputVariantProps = VariantProps<typeof inputVariants>;
export type InputSize = NonNullable<InputVariantProps['size']>;
