import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type PluginOption, type UserConfig } from 'vite';
import dts from 'vite-plugin-dts';

interface PackageJson {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface LibraryConfigOptions {
  /** Absolute path of the package directory. */
  root: string;
  plugins?: PluginOption[];
  /** Emit the CSS imported by the entry as `dist/<name>.css`. */
  cssFileName?: string;
}

/**
 * Shared Vite library build for every published package: ES modules only, one output file
 * per source module (keeps `'use client'` directives and enables tree-shaking), declarations
 * next to the JavaScript, and all dependencies left external.
 */
export function defineLibraryConfig({
  root,
  plugins = [],
  cssFileName,
}: LibraryConfigOptions): UserConfig {
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as PackageJson;
  const externalPackages = [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ];
  const isExternal = (id: string): boolean =>
    externalPackages.some((name) => id === name || id.startsWith(`${name}/`));

  return defineConfig({
    root,
    plugins: [
      ...plugins,
      dts({
        tsconfigPath: resolve(root, 'tsconfig.build.json'),
        entryRoot: resolve(root, 'src'),
      }),
    ],
    build: {
      outDir: resolve(root, 'dist'),
      emptyOutDir: true,
      lib: {
        entry: resolve(root, 'src/index.ts'),
        formats: ['es'],
        ...(cssFileName ? { cssFileName } : {}),
      },
      rolldownOptions: {
        external: isExternal,
        output: {
          preserveModules: true,
          preserveModulesRoot: resolve(root, 'src'),
          entryFileNames: '[name].js',
        },
      },
      sourcemap: true,
      minify: false,
    },
  });
}
