/**
 * Main entry point for 測試程式開發
 * Simple HTTP server displaying Hello World
 */

const http = require('http');
const { createClient } = require('./nemoclaw');
const nemoConfig = require('./nemoclaw.config');

const PORT = 3000;

function createServer() {
  const nemo = createClient(nemoConfig);

  const server = http.createServer(async (req, res) => {
    const now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

    // POST /chat - NemoClaw 推論端點
    if (req.method === 'POST' && req.url === '/chat') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', async () => {
        try {
          const { message } = JSON.parse(body);
          const result = await nemo.chat([{ role: 'user', content: message }]);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify(result));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    // GET /health - 後端狀態檢查
    if (req.url === '/health') {
      const health = await nemo.healthCheck();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(health));
      return;
    }

    // GET / - 首頁
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h1>歡迎來到我的網站</h1>
<p>現在時間: ${now}</p>
<h2>NemoClaw API</h2>
<ul>
  <li><code>POST /chat</code> - 推論（body: {"message": "你好"}）</li>
  <li><code>GET /health</code> - 後端健康檢查</li>
</ul>`);
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
