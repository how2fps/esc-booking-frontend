import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      global: {},
      'process.env': env
    },
    plugins: [react(), tailwindcss()],
       test: {
         globals: true,
         environment: "jsdom",
         setupFiles: "./src/setupTests.ts",
       },
  }
})
