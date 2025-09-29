'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(ROOT_DIR, 'build');
const PORT = process.env.PORT ? Number(process.env.PORT) : 5173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

function send(res, status, content, headers = {}) {
  res.writeHead(status, Object.assign({ 'Content-Type': 'text/plain; charset=utf-8' }, headers));
  res.end(content);
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  // Map "/" to directory listing of build
  if (urlPath === '/' || urlPath === '') {
    if (!fs.existsSync(BUILD_DIR)) {
      return send(res, 200, 'No build/ directory yet. Run "npm start" first.');
    }
    const sites = fs.readdirSync(BUILD_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    const links = sites.map(s => `<li><a href="/${s}/">${s}</a></li>`).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Sites</title></head><body><h3>Generated Sites</h3><ul>${links}</ul></body></html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  // Serve files under build/
  const filePath = path.join(BUILD_DIR, urlPath);
  let statPath = filePath;
  try {
    const stat = fs.statSync(statPath);
    if (stat.isDirectory()) {
      statPath = path.join(statPath, 'index.html');
    }
    const ext = path.extname(statPath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(statPath).pipe(res);
  } catch (e) {
    send(res, 404, 'Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Serving build/ at http://localhost:${PORT}`);
});


