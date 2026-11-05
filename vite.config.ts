import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Frigo Festin',
        short_name: 'Frigo Festin',
        description: 'Des idées de repas copieux avec ce qu’il y a dans ton frigo',
        lang: 'fr',
        theme_color: '#ea580c',
        background_color: '#fff7ed',
        display: 'standalone',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.themealdb\.com\/images\//,
            handler: 'CacheFirst',
            options: { cacheName: 'images', expiration: { maxEntries: 2000, maxAgeSeconds: 60 * 60 * 24 * 90 } },
          },
        ],
      },
    }),
  ],
  test: { environment: 'node' },
});
