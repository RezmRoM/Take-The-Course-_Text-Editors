import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import vuetify from "vite-plugin-vuetify";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }), 
    vueDevTools(), 
    vuetify({ autoImport: true })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
      "@entities": fileURLToPath(new URL("./src/entities", import.meta.url)),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@widgets": fileURLToPath(new URL("./src/widgets", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@app": fileURLToPath(new URL("./src/app", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/shared/assets", import.meta.url))
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.json']
  },
  optimizeDeps: {
    include: [
      "@tiptap/vue-3",
      "@tiptap/starter-kit",
      "@tiptap/extension-text-align",
      "@tiptap/extension-font-family",
      "@tiptap/extension-text-style",
      "@tiptap/extension-color",
      "@tiptap/extension-underline",
      "@tiptap/extension-bold",
      "@tiptap/extension-italic",
      "@tiptap/extension-strike"
    ]
  }
});
