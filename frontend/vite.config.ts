import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  if (command === 'build' && mode === 'cloudflare') {
    if (env.VITE_API_URL !== '/') throw new Error('Cloudflare build requires VITE_API_URL=/ for same-origin API routing');
  } else if (command === 'build') {
    if (!env.VITE_API_URL) throw new Error('Set VITE_API_URL to the HTTPS backend origin before building for production');
    const api = new URL(env.VITE_API_URL);
    if (api.protocol !== 'https:' || api.origin !== env.VITE_API_URL || /localhost|127\.0\.0\.1/.test(api.hostname)) {
      throw new Error('VITE_API_URL must be a public HTTPS origin without a path or trailing slash');
    }
  }
  return {
  server: {
    port: 5173,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  };
})
