import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  main: {
    build: {
      outDir: "dist/main",
      rollupOptions: {
        input: path.resolve(
          __dirname,
          "src/main/index.ts"
        ),
      },
    },
  },

  preload: {
    build: {
      outDir: "dist/preload",
      rollupOptions: {
        input: path.resolve(
          __dirname,
          "src/preload/preload.ts"
        ),
      },
    },
  },

  renderer: {
    root: path.resolve(
      __dirname,
      "src/renderer"
    ),
    plugins: [react()],
  },
});