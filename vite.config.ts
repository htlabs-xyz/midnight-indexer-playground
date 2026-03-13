import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        v1: resolve(__dirname, "src/v1.html"),
        v3: resolve(__dirname, "src/v3.html"),
        v4: resolve(__dirname, "src/v4.html"),
      },
    },
  },
  server: {
    port: 3000,
  },
})
