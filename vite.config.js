import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-192x192.svg', 'pwa-512x512.svg', 'robots.txt'],
      manifest: {
        name: 'Toplantı Merkezi | Kurumsal Organizasyon & Etkinlik Yönetimi',
        short_name: 'ToplantıMerkezi',
        description: "Türkiye'nin 81 ilinde B2B bayi toplantısı, kongre, seminer ve kurumsal etkinlik çözümleri.",
        theme_color: '#0F172A',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        lang: 'tr',
        categories: ['business', 'productivity', 'events'],
        icons: [
          {
            src: '/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable'
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Hızlı Teklif Al',
            short_name: 'Teklif Al',
            description: '7 Adımda kurumsal organizasyon teklifi oluşturun',
            url: '/teklif-al',
            icons: [{ src: '/pwa-192x192.svg', sizes: '192x192' }]
          },
          {
            name: 'Teklif & Talep Takip',
            short_name: 'Talep Takip',
            description: 'Başvuru kodunuz ile canlı aşama takibi yapın',
            url: '/teklif-takip',
            icons: [{ src: '/pwa-192x192.svg', sizes: '192x192' }]
          },
          {
            name: 'Yönetim Masası (CRM)',
            short_name: 'Yönetim',
            description: 'Operasyon ve teklif yönetim paneli',
            url: '/admin',
            icons: [{ src: '/pwa-192x192.svg', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'unsplash-images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) {
              return 'pdf-generator';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Firebase SDK ayrı chunk (yalnızca CRM/bulut işlemlerinde gerekli)
            if (id.includes('firebase') || id.includes('@firebase')) {
              return 'firebase';
            }
            // React çekirdeği ayrı chunk (router + render)
            if (id.includes('react') || id.includes('scheduler')) {
              return 'react-core';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
