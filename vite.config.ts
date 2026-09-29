import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/pachapp.svg'],
      manifest: {
        name: 'Pachapp by DJuaqo',
        short_name: 'Pachapp',
        description: 'E-learning gamificado para agrónomos: códices, boss raids y loot.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0b0f0c',
        theme_color: '#0b0f0c',
        // Placeholder hasta recibir el logo definitivo.
        icons: [
          { src: 'icons/pachapp.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icons/pachapp.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
})
