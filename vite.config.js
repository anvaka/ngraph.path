import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'index.js',
      name: 'ngraphPath',
      fileName: (format) => `ngraph.path.${format}.js`,
      formats: ['umd', 'es'],
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: false,
    minify: 'esbuild',
  },
  test: {
    include: ['test/**/*.test.js'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
    },
  },
});
