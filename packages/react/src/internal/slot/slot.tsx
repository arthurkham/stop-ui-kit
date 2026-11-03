'use client';

import * as React from 'react';
import { cn } from '@stop-ui/styles';
import { setRef } from '../compose-refs/index.js';

type AnyProps = Record<string, unknown>;

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const reactMajorVersion = Number.parseInt(React.version, 10);

/**
 * Reads the ref of a React element in a way that works in both React 18 and 19.
 * React 19 moved `ref` into `props` and warns when `element.ref` is accessed.
 */
function getElementRef(element: React.ReactElement): React.Ref<unknown> | undefined {
  if (reactMajorVersion >= 19) {
    return (element.props as { ref?: React.Ref<unknown> }).ref;
  }
  return (element as unknown as { ref?: React.Ref<unknown> }).ref;
}

const isEventHandlerKey = (key: string): boolean => /^on[A-Z]/.test(key);

/**
 * Merges slot props with the child's props. The child wins for regular props;
 * class names are combined, styles are shallow-merged and event handlers are chained
 * (child first, then slot unless the child called `preventDefault()`).
 */
function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps };

  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (isEventHandlerKey(key) && typeof slotValue === 'function') {
      if (typeof childValue === 'function') {
        merged[key] = (event: unknown, ...args: unknown[]) => {
          (childValue as (...params: unknown[]) => unknown)(event, ...args);
          const prevented =
            typeof event === 'object' &&
            event !== null &&
            'defaultPrevented' in event &&
            event.defaultPrevented === true;
          if (!prevented) {
            (slotValue as (...params: unknown[]) => unknown)(event, ...args);
          }
        };
      }
    } else if (key === 'className') {
      merged[key] = cn(slotValue as string | undefined, childValue as string | undefined);
    } else if (key === 'style') {
      merged[key] = { ...(slotValue as object | undefined), ...(childValue as object | undefined) };
    }
  }

  return merged;
}

/**
 * Renders its single child element and merges its own props and ref into it.
 * Powers the `asChild` pattern.
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef,
) {
  const child = React.Children.only(children);
  const childRef = React.isValidElement(child) ? getElementRef(child) : undefined;

  const composedRef = React.useCallback(
    (node: HTMLElement | null) => {
      setRef(forwardedRef, node);
      setRef(childRef, node);
    },
    [forwardedRef, childRef],
  );

  if (!React.isValidElement<AnyProps>(child)) {
    throw new Error('Slot expects a single React element as its child.');
  }

  return React.cloneElement(child, {
    ...mergeProps(slotProps as AnyProps, child.props),
    ref: composedRef,
  });
});
