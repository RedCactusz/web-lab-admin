import type { NextConfig } from "next";

/**
 * Next.js Configuration for Lab SGG Admin Panel
 *
 * IMPORTANT: This project uses Next.js 16.2.4 & React 19.2.4
 * These are NOT stable versions — APIs may differ from standard docs.
 *
 * Before modifying this config, check:
 * - node_modules/next/dist/docs/ for version-specific documentation
 * - AGENTS.md for project-specific conventions
 */

const nextConfig: NextConfig = {
  // =================================================================
  // IMAGES CONFIGURATION
  // =================================================================
  images: {
    // Remote image patterns allowed to be optimized by Next.js
    remotePatterns: [
      // Unsplash (used for demo/placeholder images)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Add more patterns here if needed for production:
      // {
      //   protocol: 'https',
      //   hostname: 'your-domain.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],

    // For images served from backend API (if using base64 or backend-hosted images)
    // Consider using unoptimized: true if images are served dynamically
    // unoptimized: false,
  },

  // =================================================================
  // PRODUCTION OUTPUT
  // =================================================================
  // Enable standalone output for containerized deployments
  // This generates a minimal build optimized for production
  output: 'standalone',

  // =================================================================
  // REWRITE & PROXY RULES (Optional - commented out by default)
  // =================================================================
  // Uncomment if you need to proxy API requests to backend during development
  /*
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8001';

    return [
      {
        source: '/api/admin/:path*',
        destination: `${backendUrl}/admin_api/:path*`,
      },
      {
        source: '/api/client/:path*',
        destination: `${backendUrl}/client_api/:path*`,
      },
    ];
  },
  */

  // =================================================================
  // ENVIRONMENT VARIABLES
  // =================================================================
  // Public environment variables (accessible in browser):
  // - NEXT_PUBLIC_LARAVEL_API_URL: Backend API URL
  //
  // Required environment variables:
  // - .env.local: NEXT_PUBLIC_LARAVEL_API_URL=http://localhost:8001
  //
  // For production, set these in your deployment platform (Vercel, Docker, etc.)

  // =================================================================
  // EXPERIMENTAL FEATURES (Use with caution in Next.js 16.2.4)
  // =================================================================
  // Uncomment only if you understand the implications of using experimental features
  // experimental: {
  //   // Example: turbo: {}, // for Turbopack (if available in 16.2.4)
  // },

  // =================================================================
  // TYPESCRIPT & ESLINT
  // =================================================================
  // TypeScript and ESLint are configured separately in:
  // - tsconfig.json
  // - eslint.config.mjs
  //
  // Build will fail if TypeScript errors are found (check with: npx tsc --noEmit)

  // =================================================================
  // HEADERS & SECURITY (Optional - uncomment if needed)
  // =================================================================
  /*
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  */
};

export default nextConfig;
