const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',  // Front Angular
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
  },
});