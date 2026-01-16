import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { visualizer } from "rollup-plugin-visualizer"
import { IncomingMessage, ServerResponse } from "http"
import { SecurityHeader, securityHeaders } from "./securityHeaders"
import type { ViteDevServer, PreviewServer } from "vite"

// DEV SERVER
function secureHeadersPlugin() {
  return {
    name: "secure-headers",
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        ;(securityHeaders as SecurityHeader[]).forEach((header) => {
          res.setHeader(header.key, header.value)
        })
        next()
      })
    },
  }
}

// PREVIEW SERVER
function securePreviewHeadersPlugin() {
  return {
    name: "secure-preview-headers",
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        securityHeaders.forEach((header) => {
          res.setHeader(header.key, header.value)
        })
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), secureHeadersPlugin(), securePreviewHeadersPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          filename: "dist/stats.html",
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
      ],
    },
  },
})
