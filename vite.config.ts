import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), copy({
    verbose: true,
    hook: 'closeBundle',
    targets: [
      { src: 'manifest.json', dest: 'dist' },
      { src: 'background.js', dest: 'dist' },
    ],
  })],
})
