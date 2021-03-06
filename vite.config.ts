import react from '@vitejs/plugin-react';
import Checker from 'vite-plugin-checker';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';
import { UserConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}

const shouldAnalyze = process.env.ANALYZE;

const config: UserConfig = {
  publicDir: 'public',
  envDir: './',
  envPrefix: 'VITE_',
  css: { postcss: { plugins: [autoprefixer()] } },
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: pathResolve('src') + '/'
      }
    ]
  },
  build: {
    rollupOptions: {
      plugins: !!shouldAnalyze ? [visualizer({ open: true, filename: './bundle-size/bundle.html' })] : []
    },
    sourcemap: !!shouldAnalyze
  },
  plugins: [
    react({ jsxImportSource: '@emotion/react' }),
    Checker({
      typescript: true,
      overlay: true,
      eslint: {
        lintCommand: 'eslint',
        dev: {
          overrideConfig: {
            extensions: ['.ts', '.tsx']
          },
          logLevel: ['warning', 'error']
        }
      }
    })
  ]
};

const getConfig = () => config;

export default getConfig;
