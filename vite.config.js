import { defineConfig } from 'vite';

export default defineConfig({
  base: "/RockPaperScissors/", // Set the base URL for GitHub Pages deployment
  resolve: {
    alias: {
      'three': 'three', // Vite will resolve this automatically from node_modules
      'three/examples': 'three/examples/jsm', // Alias for examples
    }
  }
});

