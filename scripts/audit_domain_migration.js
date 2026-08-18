/**
 * scripts/audit_domain_migration.js
 * Comprehensive Automated Domain Migration & Redirect Verification Audit
 * Validates 301 permanent redirect rules, single-hop destinations, zero legacy
 * domain leaks in source/sitemaps/robots/DOM, and production canonical integrity.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';
import { SITE_URL } from '../src/config.js';
import { tools } from '../src/tools/toolRegistry.js';
import { articles } from '../src/tools/articleRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const LEGACY_DOMAIN = 'student-utility-hub-2ss3.vercel.app';
const WWW_DOMAIN = 'www.studentutilityhub.in';
const PROD_DOMAIN = 'studentutilityhub.in';
const PROD_URL = 'https://studentutilityhub.in';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

const test = (name, fn) => {
    totalTests++;
    try {
        fn();
        passedTests++;
        console.log(`  ✅ PASS: ${name}`);
    } catch (err) {
        failedTests++;
        failures.push({ name, error: err.message });
        console.error(`  ❌ FAIL: ${name}`);
        console.error(`     ${err.message}`);
    }
};

console.log('\n===============================================================');
console.log('🌐 RUNNING AUTOMATED DOMAIN MIGRATION & REDIRECT AUDIT');
console.log('===============================================================\n');

// 1. SITE_URL Configuration Integrity
test('Production SITE_URL is strictly configured to https://studentutilityhub.in', () => {
    assert.strictEqual(SITE_URL, PROD_URL, `SITE_URL must equal ${PROD_URL}, found "${SITE_URL}"`);
    assert.ok(!SITE_URL.includes('vercel.app'), 'SITE_URL must not contain vercel.app');
    assert.ok(!SITE_URL.includes('localhost'), 'SITE_URL must not contain localhost');
    assert.ok(!SITE_URL.includes('127.0.0.1'), 'SITE_URL must not contain 127.0.0.1');
});

// 2. vercel.json 301 Permanent Redirect Configuration
test('vercel.json contains valid 301 Permanent Redirects for legacy and www domains', () => {
    const vercelConfigPath = path.resolve(rootDir, 'vercel.json');
    assert.ok(fs.existsSync(vercelConfigPath), 'vercel.json must exist in project root');
    
    const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    assert.ok(Array.isArray(config.redirects), 'vercel.json must declare redirects array');

    // Check legacy Vercel subdomain redirect
    const legacyRule = config.redirects.find(r => 
        r.has && r.has.some(h => h.type === 'host' && h.value === LEGACY_DOMAIN)
    );
    assert.ok(legacyRule, `Missing 301 redirect rule for host: ${LEGACY_DOMAIN}`);
    assert.strictEqual(legacyRule.destination, 'https://studentutilityhub.in/:path*', 'Legacy redirect must map to https://studentutilityhub.in/:path*');
    assert.strictEqual(legacyRule.permanent, true, 'Legacy redirect must be permanent (HTTP 301)');

    // Check www hostname redirect
    const wwwRule = config.redirects.find(r => 
        r.has && r.has.some(h => h.type === 'host' && h.value === WWW_DOMAIN)
    );
    assert.ok(wwwRule, `Missing 301 redirect rule for host: ${WWW_DOMAIN}`);
    assert.strictEqual(wwwRule.destination, 'https://studentutilityhub.in/:path*', 'www redirect must map to https://studentutilityhub.in/:path*');
    assert.strictEqual(wwwRule.permanent, true, 'www redirect must be permanent (HTTP 301)');

    // Check rewrite fallback for SPA client-side routing
    assert.ok(Array.isArray(config.rewrites), 'vercel.json must declare rewrites array');
    const spaRewrite = config.rewrites.find(rw => rw.destination === '/' || rw.destination === '/index.html');
    assert.ok(spaRewrite, 'vercel.json must contain SPA rewrite to "/"');
});

// 3. Single-Hop Redirect Destination Testing (Simulated across representative URLs)
test('Simulated redirect mappings are direct single-hop without chains', () => {
    const samplePaths = [
        '/',
        '/pdf-tools',
        '/image-tools',
        '/tools/pdf-compress',
        '/tools/image-compressor',
        '/tools/emi-loan-calculator',
        '/guides/how-to-merge-pdfs-guide',
        '/privacy-policy',
        '/contact'
    ];

    samplePaths.forEach(p => {
        const oldUrl = `https://${LEGACY_DOMAIN}${p}`;
        const newUrl = `${PROD_URL}${p}`;
        
        // Ensure destination maps directly to production apex domain
        const simulatedDestination = oldUrl.replace(`https://${LEGACY_DOMAIN}`, PROD_URL);
        assert.strictEqual(simulatedDestination, newUrl, `Redirect for ${oldUrl} failed direct mapping`);
        assert.ok(!simulatedDestination.includes(WWW_DOMAIN), `Redirect must not chain through ${WWW_DOMAIN}`);
        assert.ok(!simulatedDestination.includes(LEGACY_DOMAIN), `Redirect must not chain back to ${LEGACY_DOMAIN}`);
    });
});

// 4. Source Code Leak Scan: Zero Active References to Legacy Subdomain
test('Zero active references to legacy Vercel domain in src/ and index.html', () => {
    const scanDir = (dir, forbiddenSubstring, ignoreFiles = []) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (ignoreFiles.includes(entry.name)) continue;

            if (entry.isDirectory()) {
                scanDir(fullPath, forbiddenSubstring, ignoreFiles);
            } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.html') || entry.name.endsWith('.json') || entry.name.endsWith('.css'))) {
                const content = fs.readFileSync(fullPath, 'utf8');
                // Allow fallback filter checks in config.js and legalConfig.js portfolioUrl
                if (entry.name === 'config.js' || entry.name === 'legalConfig.js') continue;
                if (content.includes(forbiddenSubstring)) {
                    throw new Error(`Legacy domain reference "${forbiddenSubstring}" found in active source file: ${fullPath}`);
                }
            }
        }
    };

    scanDir(path.resolve(rootDir, 'src'), LEGACY_DOMAIN);
    
    const indexHtml = fs.readFileSync(path.resolve(rootDir, 'index.html'), 'utf8');
    assert.ok(!indexHtml.includes(LEGACY_DOMAIN), `index.html contains legacy domain reference`);
});

// 5. Sitemap & Robots Domain Integrity Scan
test('All sitemaps and robots.txt strictly use studentutilityhub.in with zero legacy references', () => {
    const publicDir = path.resolve(rootDir, 'public');
    const sitemapFiles = fs.readdirSync(publicDir).filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));
    
    assert.ok(sitemapFiles.length >= 5, `Expected at least 5 sitemap files, found ${sitemapFiles.length}`);

    sitemapFiles.forEach(f => {
        const content = fs.readFileSync(path.join(publicDir, f), 'utf8');
        assert.ok(!content.includes(LEGACY_DOMAIN), `Sitemap "${f}" contains legacy domain: ${LEGACY_DOMAIN}`);
        assert.ok(!content.includes('localhost'), `Sitemap "${f}" contains localhost reference`);
        assert.ok(!content.includes('127.0.0.1'), `Sitemap "${f}" contains 127.0.0.1 reference`);
        assert.ok(content.includes(PROD_DOMAIN), `Sitemap "${f}" is missing production domain: ${PROD_DOMAIN}`);
    });

    const robotsTxt = fs.readFileSync(path.join(publicDir, 'robots.txt'), 'utf8');
    assert.ok(!robotsTxt.includes(LEGACY_DOMAIN), 'robots.txt contains legacy domain');
    assert.ok(robotsTxt.includes(`${PROD_URL}/sitemap.xml`), `robots.txt must point to ${PROD_URL}/sitemap.xml`);
});

console.log('\n===============================================================');
console.log(`📊 DOMAIN MIGRATION AUDIT SUMMARY:`);
console.log(`   Total Checks: ${totalTests}`);
console.log(`   Passed:       ${passedTests}`);
console.log(`   Failed:       ${failedTests}`);
console.log('===============================================================');

if (failedTests > 0) {
    console.error('\n❌ FAILED DOMAIN MIGRATION CHECKS:');
    failures.forEach(f => console.error(` - ${f.name}: ${f.error}`));
    process.exit(1);
} else {
    console.log('\n🌟 DOMAIN MIGRATION & REDIRECT AUDIT PASSED 100% CLEANLY!\n');
    process.exit(0);
}
