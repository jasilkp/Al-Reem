const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // API: Contact form submission
    if (req.method === 'POST' && req.url.startsWith('/api/contact')) {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
            try {
                const body = JSON.parse(data || '{}');
                const entry = {
                    name: body.name || '',
                    email: body.email || '',
                    phone: body.phone || '',
                    department: body.department || 'General Enquiry',
                    message: body.message || '',
                    ts: new Date().toISOString(),
                    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
                };
                const dbPath = path.join(__dirname, 'contact-messages.json');
                let list = [];
                if (fs.existsSync(dbPath)) {
                    try { list = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '[]'); } catch {}
                }
                list.push(entry);
                fs.writeFileSync(dbPath, JSON.stringify(list, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: false }));
            }
        });
        return;
    }
    try {
        // Normalize and decode the URL path
        const reqUrl = decodeURI(req.url.split('?')[0]);
        const relPath = reqUrl === '/' ? 'index.html' : reqUrl.replace(/^\/+/, '');

        // Prevent path traversal outside the workspace
        const safePath = path.normalize(relPath).replace(/^\.+/, '');
        let filePath = path.join(__dirname, safePath);

        // If a directory is requested, serve its index.html
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        const extname = path.extname(filePath);
        const contentType = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.mjs': 'text/javascript',
            '.json': 'application/json',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.JPG': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
        }[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error');
    }
});

server.listen(5500, () => {
    console.log('Server running at http://localhost:5500');
});