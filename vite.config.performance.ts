import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Performance optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          'animation-vendor': ['embla-carousel-react']
        },
        // Optimize chunk naming for caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(assetInfo.name)) {
            return `assets/images/[name].[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name].[hash].${ext}`;
          }
          return `assets/[name].[hash].${ext}`;
        }
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Modern builds
    target: 'es2020',
    cssCodeSplit: true,
    cssMinify: true,
    // Source maps for production debugging
    sourcemap: false,
    // Optimize bundle
    assetsInlineLimit: 4096
  },
  // Modern module preload optimization
  esbuild: {
    target: 'es2020',
    keepNames: false,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  },
  // CSS optimization
  css: {
    devSourcemap: false,
    postcss: {
      plugins: [
        // CSS optimization plugins would go here
      ]
    }
  }
}));