/**
 * Main entry point for 測試程式開發
 * Simple HTTP server displaying Hello World
 */

const http = require('http');

const PORT = 3000;

function createServer() {
  const server = http.createServer((req, res) => {
    const now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h1>歡迎來到我的網站</h1><p>現在時間: ${now}</p>`);
  });

  return server;
}

function main() {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}

module.exports = { createServer, main };

// Run if executed directly
if (require.main === module) {
  main();
}
