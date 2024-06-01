import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { createRequire } from "node:module";
import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
// https://vitejs.dev/config/
const require = createRequire(import.meta.url);
const cMapsDir = normalizePath(
  path.join(path.dirname(require.resolve("pdfjs-dist/package.json")), "cmaps")
);
const standardFontsDir = normalizePath(
  path.join(
    path.dirname(require.resolve("pdfjs-dist/package.json")),
    "standard_fonts"
  )
);
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: cMapsDir, dest: "" },
        { src: standardFontsDir, dest: "" },
      ],
    }),
    react(),
  ],
  server: {
    port: 3000,
  },
});
