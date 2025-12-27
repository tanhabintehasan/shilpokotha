import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

// ES Module-এ __dirname এর বিকল্প তৈরি করা
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // এটি '@' কে 'src' ফোল্ডারের সাথে ম্যাপ করবে
      "@": path.resolve(__dirname, "./src"),
    },
  },
});