import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/react-vite';
import * as projectAnnotations from './preview.js';

/** Theme of the current test project, injected by vitest.config.ts. */
declare const __STORYBOOK_THEME__: string;

setProjectAnnotations([
  a11yAddonAnnotations,
  projectAnnotations,
  { initialGlobals: { theme: __STORYBOOK_THEME__ } },
]);
