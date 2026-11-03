import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * Runs axe against WCAG 2.x A/AA rules. Color contrast is checked in Storybook,
 * because jsdom does not compute styles.
 */
export async function expectNoAxeViolations(container: Element): Promise<void> {
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    rules: { 'color-contrast': { enabled: false } },
  });
  expect(results.violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
}
