// src/app/manifest.ts
import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DevNest DevSpace WebApp',
    short_name: 'DevSpace',
    description: 'A seamless production-ready dashboard app for developers',
    start_url: '/dashboard', // App icon par click karne par pehla konsa page khule
    scope: '/',              // Pure website ko PWA screen ke andar hi chalane ke liye scope set karna zaroori hai
    display: 'standalone',    // Isse mobile browser ki top URL strip gayab ho jayegi aur pure app jaisa feel aayega
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable' // Android icons circular/squircle cropping ke liye important hai
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}