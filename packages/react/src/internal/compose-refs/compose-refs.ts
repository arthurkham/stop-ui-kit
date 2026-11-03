import type * as React from 'react';

type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * Assigns a value to a callback ref or a ref object.
 */
export function setRef<T>(ref: PossibleRef<T>, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    (ref as { current: T | null }).current = value;
  }
}

/**
 * Combines several refs into a single callback ref.
 */
export function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      setRef(ref, node);
    }
  };
}
