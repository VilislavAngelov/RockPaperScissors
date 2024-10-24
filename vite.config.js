import { defineConfig } from 'vite';

export default defineConfig({
  base: "/RockPaperScissors/", // Set the base URL
  resolve: {
    alias: {
      'three': 'three/build/three.module.js',
      'three/examples': 'three/examples/jsm', // Alias for examples
    }
  }
});
