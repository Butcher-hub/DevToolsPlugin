import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy';
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{
      find: '@',
      replacement: resolve(__dirname, './src')
    }]
  },
  plugins: [vue(), copy({
    verbose: true,
    hook: 'closeBundle',
    targets: [
      { src: 'manifest.json', dest: 'dist' },
      { src: 'background.js', dest: 'dist' },
    ],
  })],
})
