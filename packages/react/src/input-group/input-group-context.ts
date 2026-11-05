'use client';

import * as React from 'react';
import type { InputSize } from '@stop-ui/styles';

export interface InputGroupContextValue {
  size: InputSize;
}

export const InputGroupContext = React.createContext<InputGroupContextValue | null>(null);
