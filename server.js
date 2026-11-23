const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8"
};

function handler(req, res) {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400); return res.end("Bad request");
  }

  const safePath = path.normalize(path.join(ROOT, urlPath));
  if (!safePath.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }

  let filePath = safePath;
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, "index.html");
    fs.readFile(filePath, (err2, data) => {
      if (err2) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("404 Not Found: " + urlPath);
      }
      const type = TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache" });
      res.end(data);
    });
  });
}

const keyFile = path.join(ROOT, "key.pem");
const certFile = path.join(ROOT, "cert.pem");
const hasCert = fs.existsSync(keyFile) && fs.existsSync(certFile);

function log(proto) {
  console.log(`Chip Main running:  ${proto}://localhost:${PORT}/`);
  console.log(`Admin panel:        ${proto}://localhost:${PORT}/admin/`);
  console.log(`Serving: ${ROOT}`);
  console.log(`Note: the KYC camera works over HTTPS or on localhost (a secure context).`);
  if (proto === "http") console.log(`For HTTPS, put cert.pem + key.pem here and restart.`);
}

if (hasCert) {
  https.createServer({ key: fs.readFileSync(keyFile), cert: fs.readFileSync(certFile) }, handler)
    .listen(PORT, () => log("https"));
} else {
  http.createServer(handler).listen(PORT, () => log("http"));
}
