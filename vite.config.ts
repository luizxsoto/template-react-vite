import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import istanbul from 'vite-plugin-istanbul'

// https://vite.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return {
    plugins: [
      react(),
      ...(process.env.VITE_COVERAGE_ENABLED === 'true'
        ? [istanbul({ include: ['src/*'], extension: ['.ts', '.tsx'] })]
        : []),
    ],
    server: {
      host: process.env.VITE_HOST ?? '0.0.0.0',
      port: Number(process.env.VITE_PORT) || 8000,
      watch: {
        ignored: ['**/coverage/**'],
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@mock-server': resolve(__dirname, './mock-server'),
        '@tests': resolve(__dirname, './tests'),
      },
    },
  }
})
