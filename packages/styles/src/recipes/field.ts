/** Layout of a field: label, control, description and error stacked with consistent spacing. */
export const fieldClassName = 'sui:box-border sui:flex sui:min-w-0 sui:flex-col sui:gap-1.5';

/** Field label. Explicit typography, because host styles such as Bootstrap's `label` are common. */
export const labelClassName =
  'sui:m-0 sui:[font-family:inherit] sui:text-sm sui:font-medium sui:[letter-spacing:normal] sui:normal-case sui:text-fg sui:data-disabled:opacity-50';

/** Visual marker for required fields; hidden from assistive technology, which announces `required`. */
export const requiredMarkerClassName = 'sui:ms-0.5 sui:text-danger-text';

export const fieldDescriptionClassName = 'sui:m-0 sui:text-sm sui:text-fg-muted';

/** Error message. Not conveyed by color alone: it always has text and an icon (WCAG 1.4.1). */
export const fieldErrorClassName =
  'sui:m-0 sui:flex sui:items-start sui:gap-1.5 sui:text-sm sui:text-danger-text';

export const fieldErrorIconClassName = 'sui:mt-[0.2em] sui:size-[1em] sui:shrink-0';
