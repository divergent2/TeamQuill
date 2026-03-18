import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: process.env.USE_MOCK === 'true' ? {
      'firebase/app': path.resolve(__dirname, 'src/mocks/firebase-app.js'),
      'firebase/auth': path.resolve(__dirname, 'src/mocks/firebase-auth.js'),
      'firebase/firestore': path.resolve(__dirname, 'src/mocks/firebase-firestore.js'),
    } : {},
  },
});
