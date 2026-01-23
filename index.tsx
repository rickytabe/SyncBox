
import React from 'react';
import ReactDOM from 'react-dom/client';
import RootLayout from './app/layout';
import Home from './app/page';

/**
 * Next.js Refactor:
 * In a traditional Next.js environment, the build system handles the assembly
 * of the RootLayout and Pages. In this browser environment, we simulate the
 * App Router by nesting the Home page inside the RootLayout entry point.
 */

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RootLayout>
      <Home />
    </RootLayout>
  </React.StrictMode>
);

// PWA: Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Shared clipboard logic for mobile target would go here
  });
}
