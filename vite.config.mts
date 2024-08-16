import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      input: "./src/index.ts",
      output: {
        entryFileNames: "meatmemo.js"
      }
    }
  },
})