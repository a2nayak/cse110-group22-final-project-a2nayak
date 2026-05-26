import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cse110-group22-final-project/',
  build: {
    rollupOptions: {
      input: './src/final/html/index.html' // or './src/sample/index.html' depending on which is your main entry
    }
  }
});