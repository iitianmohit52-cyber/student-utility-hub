import fs from 'fs';
import path from 'path';
import http from 'http';
import { JSDOM } from 'jsdom';

const PORT = 4173;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

if (!fs.existsSync(DIST_DIR) || !fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    console.error('Error: dist directory or index.html missing. Run "npm run build" before running smoke test.');
    process.exit(1);
}

function startServer() {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
            let filePath = path.join(DIST_DIR, parsedUrl.pathname);

            // Check if physical file exists in dist
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath);
                const contentTypes = {
                    '.html': 'text/html; charset=utf-8',
                    '.js': 'application/javascript; charset=utf-8',
                    '.css': 'text/css; charset=utf-8',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.svg': 'image/svg+xml',
                    '.ico': 'image/x-icon',
                    '.xml': 'application/xml',
                    '.txt': 'text/plain'
                };
                res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
                fs.createReadStream(filePath).pipe(res);
                return;
            }

            // SPA Fallback: serve dist/index.html for clean routes
            const indexPath = path.join(DIST_DIR, 'index.html');
            if (fs.existsSync(indexPath)) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                fs.createReadStream(indexPath).pipe(res);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Dist index.html not found.');
            }
        });

        server.listen(PORT, () => {
            console.log(`\n🚀 Local Production Smoke Server started at http://localhost:${PORT}`);
            resolve(server);
        });
    });
}

function fetchUrl(urlPath) {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:${PORT}${urlPath}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: data, headers: res.headers }));
        }).on('error', reject);
    });
}

const runSmokeTest = async () => {
    const server = await startServer();

    // Load sitemaps to get test URLs
    const sitemaps = [
        'sitemap-main.xml',
        'sitemap-tools.xml',
        'sitemap-categories.xml',
        'sitemap-blog.xml',
        'sitemap-legal.xml'
    ];

    const testUrls = [];
    for (const sitemapName of sitemaps) {
        const sitemapPath = path.resolve(process.cwd(), `public/${sitemapName}`);
        if (fs.existsSync(sitemapPath)) {
            const content = fs.readFileSync(sitemapPath, 'utf8');
            const dom = new JSDOM(content, { contentType: 'text/xml' });
            const locs = Array.from(dom.window.document.querySelectorAll('loc')).map(el => el.textContent);
            for (const loc of locs) {
                const p = new URL(loc).pathname;
                testUrls.push(p === '' ? '/' : p);
            }
        }
    }

    console.log(`\nRunning Real HTTP Production Route Smoke Test on ${testUrls.length} routes...`);

    let passedCount = 0;
    let failedCount = 0;

    for (const routePath of testUrls) {
        try {
            const response = await fetchUrl(routePath);

            // 1. HTTP Status check
            if (response.statusCode !== 200) {
                throw new Error(`HTTP status is ${response.statusCode}, expected 200`);
            }

            // 2. Content Type check
            if (!response.headers['content-type'] || !response.headers['content-type'].includes('text/html')) {
                throw new Error(`Invalid content-type: ${response.headers['content-type']}`);
            }

            // 3. Body check: must contain SPA mounting container and JS bundle reference
            if (!response.body.includes('id="app"') || !response.body.includes('assets/index')) {
                throw new Error(`Response HTML missing SPA entrypoint or built bundle reference`);
            }

            passedCount++;
        } catch (err) {
            console.error(`❌ SMOKE TEST FAIL for route "${routePath}": ${err.message}`);
            failedCount++;
        }
    }

    server.close();

    console.log(`\n==================================================`);
    console.log(`SMOKE TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
    console.log(`==================================================\n`);

    if (failedCount > 0) {
        process.exit(1);
    }
};

runSmokeTest().catch(err => {
    console.error('Smoke test suite failed:', err);
    process.exit(1);
});
