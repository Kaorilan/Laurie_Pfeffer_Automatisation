const { defineConfig } = require('cypress');
const fetch = require('node-fetch');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      on('task', {
        async checkServer() {
          try {
            const res = await fetch('http://localhost:4200');
            return res.ok ? null : 'Server not running on 4200';
          } catch {
            return 'Server not running on 4200 – lancez npm start';
          }
        }
      });
    },
  },
});