// esbuild.config.js
const esbuild = require('esbuild');

const buildOptions = {
  entryPoints: ['netlify/functions/api.ts'],
  bundle: true,
  platform: 'node',
  target: 'es2020',
  outdir: 'netlify/functions/dist',
  external: ['@netlify/functions'],
  minify: true,
  sourcemap: true,
};

esbuild.build(buildOptions).catch(() => process.exit(1));