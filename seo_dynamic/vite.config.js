// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  // SSR-specific resolve configuration
  ssr: {
    resolve: {
      conditions: ['node', 'import'],
    },
    noExternal: [], // Keep all dependencies external for SSR
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: false, // ← MUST be false
    target: 'es2022', // ← Important for ESM
    rollupOptions: {
      preserveEntrySignatures: 'exports-only', // ← Preserve exports for server entry
      input: {
        client: resolve(__dirname, 'index.html'),
        'entry-server': resolve(__dirname, 'src/entry-server.jsx'),
      },
      // Externalize server-specific Node.js dependencies
      external: (id, importer) => {
        // Don't externalize relative imports
        if (id.startsWith('.') || id.startsWith('/')) return false;
        
        // Don't externalize if it's a client asset chunk (we want server to bundle its own)
        if (id.includes('client/assets')) return false;
        
        // Externalize server-side React DOM and router dependencies
        // These need to use the actual Node.js versions at runtime
        if (
          id === 'react-dom/server' ||
          id === 'react-router-dom/server.js' ||
          id === 'react-router-dom/server' ||
          id.startsWith('react-dom/server/') ||
          id.startsWith('react-router-dom/server/')
        ) {
          return true;
        }
        
        // Externalize React and ReactDOM for ALL imports (both client and server)
        // This ensures server bundle uses external React, not bundled version
        // The client will still bundle React because it's in node_modules
        if (id === 'react' || id === 'react-dom' || id === 'react-router-dom') {
          // Only externalize if importing from server entry or source files
          // This allows server to use external React, forcing it to bundle App with external React
          if (!importer || importer.includes('entry-server') || importer.includes('src/')) {
            return true;
          }
        }
        
        return false;
      },
      output: {
        format: 'esm',
        exports: 'named',
        assetFileNames: 'client/assets/[name].[hash][extname]',
        chunkFileNames: 'client/assets/[name].[hash].js',
        entryFileNames: (chunk) =>
          chunk.name === 'entry-server'
            ? 'server/entry-server.js'
            : 'client/assets/[name].[hash].js',
        // Prevent creating shared chunks - each entry should bundle its own dependencies
        manualChunks: () => {
          // Return undefined to use default chunking, but the external config
          // will ensure server uses externalized React, forcing it to bundle its own App
          return undefined;
        },
      },
    },
  },
});