// color/contrast.d.ts
type Rgb = readonly [number, number, number];
export declare function parseHexColor(value: string): Rgb | null;
export declare function contrastRatio(foreground: string, background: string): number | null;
export {};

// index.d.ts
export { contrastRatio, parseHexColor } from './color/contrast.js';
export { announce } from './live-announcer/index.js';

// live-announcer/index.d.ts
export { announce } from './live-announcer.js';

// live-announcer/live-announcer.d.ts
export declare function announce(message: string): void;
