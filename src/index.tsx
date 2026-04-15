/**
 * CE.SDK Postcard UI Starterkit - React Entry Point
 *
 * A custom postcard editor with front/back editing, stickers,
 * text, and image composition.
 *
 * @see https://img.ly/docs/cesdk/
 */

import { createRoot } from 'react-dom/client';
import App from './app/App';

// ============================================================================
// Configuration
// ============================================================================

// Engine configuration (see https://img.ly/docs/cesdk/engine/api/configuration/)
const engineConfig = {
  // License key (required for production)
  // license: 'YOUR_LICENSE_KEY',

  // Base URL for CE.SDK assets (for self-hosted deployments)
  // baseURL: '/assets/',

  // Feature flags
  featureFlags: {
    preventScrolling: true
  }
};

// Unsplash API proxy URL (leave empty to disable)
// Set up your own proxy: https://img.ly/docs/cesdk/ui/guides/using-unsplash/
const unsplashApiUrl = ''; // INSERT YOUR UNSPLASH PROXY URL HERE

// ============================================================================
// Application Bootstrap
// ============================================================================

function main(): void {
  // Render application
  const container = document.getElementById('root');
  if (container == null) {
    throw new Error('Root container not found');
  }

  createRoot(container).render(
    <App engineConfig={engineConfig} unsplashApiUrl={unsplashApiUrl} />
  );
}

main();
