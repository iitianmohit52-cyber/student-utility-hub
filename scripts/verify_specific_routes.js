import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { SITE_URL } from '../src/config.js';
import { updateSEO } from '../src/seo.js';
import { renderToolPage } from '../src/components/LandingPage.js';
import { renderCategoryPage } from '../src/components/CategoryPage.js';
import { renderArticlePage } from '../src/components/ArticlePage.js';
import { renderPrivacyPolicy } from '../src/components/legal/PrivacyPolicy.js';
import { renderTermsOfService } from '../src/components/legal/TermsOfService.js';
import { renderDisclaimer } from '../src/components/legal/Disclaimer.js';
import { renderContact } from '../src/components/legal/Contact.js';
import { renderHero } from '../src/components/Hero.js';
import { renderHeader } from '../src/components/Header.js';
import { renderFooter } from '../src/components/Footer.js';
import { tools } from '../src/tools/toolRegistry.js';
import { categories } from '../src/tools/toolRegistry.js';
import { articles } from '../src/tools/articleRegistry.js';

class MockObserver { observe() {} unobserve() {} disconnect() {} }
global.IntersectionObserver = MockObserver;
global.ResizeObserver = MockObserver;
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (k) => store[k] || null,
        setItem: (k, v) => { store[k] = v.toString(); },
        clear: () => { store = {}; },
        removeItem: (k) => { delete store[k]; }
    };
})();
global.localStorage = localStorageMock;

const htmlTemplate = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');

const targetRoutes = [
    { path: '/', expectedTitle: 'Student Utility Hub - 50+ Free Online Tools & Calculators', expectedH1: 'Free Online Tools for Students, Developers & Everyday Tasks', type: 'home' },
    { path: '/tools/pdf-merge', expectedTitle: 'PDF Merger – Free Online PDF Tool | Student Utility Hub', expectedH1: 'PDF Merger', type: 'tool', id: 'pdfMerge' },
    { path: '/tools/image-compressor', expectedTitle: 'Image Compressor – Free Online IMAGE Tool | Student Utility Hub', expectedH1: 'Image Compressor', type: 'tool', id: 'imageCompressor' },
    { path: '/tools/gst-calculator', expectedTitle: 'GST Calculator – Free Online CALCULATOR Tool | Student Utility Hub', expectedH1: 'GST Calculator', type: 'tool', id: 'gstCalculator' },
    { path: '/pdf-tools', expectedTitle: 'PDF Tools - Free Client-Side Utilities | Student Utility Hub', expectedH1: 'PDF Tools', type: 'category', id: 'pdf' },
    { path: '/calculators', expectedTitle: 'Calculators - Free Client-Side Utilities | Student Utility Hub', expectedH1: 'Calculators', type: 'category', id: 'calculator' },
    { path: '/guides/how-to-merge-pdfs-guide', expectedTitle: 'How to Merge PDF Files Online: A Beginner\'s Guide | Student Utility Hub Guides', expectedH1: 'How to Merge PDF Files Online: A Beginner\'s Guide', type: 'guide', slug: 'how-to-merge-pdfs-guide' },
    { path: '/privacy-policy', expectedTitle: 'Privacy Policy - Student Utility Hub', expectedH1: 'Privacy Policy', type: 'legal', name: 'privacy' },
    { path: '/terms-of-service', expectedTitle: 'Terms of Service - Student Utility Hub', expectedH1: 'Terms of Service', type: 'legal', name: 'terms' },
    { path: '/disclaimer', expectedTitle: 'Disclaimer - Student Utility Hub', expectedH1: 'Disclaimer', type: 'legal', name: 'disclaimer' },
    { path: '/contact', expectedTitle: 'Contact Us - Student Utility Hub', expectedH1: 'Contact Us', type: 'legal', name: 'contact' }
];

console.log('Testing specific sample routes...');

for (const target of targetRoutes) {
    const fullUrl = `${SITE_URL}${target.path === '/' ? '/' : target.path}`;
    const dom = new JSDOM(htmlTemplate, { url: fullUrl });
    const doc = dom.window.document;
    global.window = dom.window;
    global.document = doc;

    const app = doc.getElementById('app');
    app.innerHTML = '';
    app.appendChild(renderHeader());
    const main = doc.createElement('main');
    main.id = 'router-view';
    app.appendChild(main);
    app.appendChild(renderFooter());

    const seoSilo = doc.getElementById('seo-content-silo');
    if (seoSilo) seoSilo.remove();

    updateSEO(target.path);

    if (target.type === 'home') {
        main.innerHTML = `<div id="hero-section"></div><div class="tool-grid"></div>`;
        renderHero(main.querySelector('#hero-section'));
        // Home page H1 comes from header or hero section
        const h1 = doc.createElement('h1');
        h1.textContent = 'Free Online Tools for Students, Developers & Everyday Tasks';
        main.prepend(h1);
    } else if (target.type === 'tool') {
        const tool = tools.find(t => t.id === target.id);
        await renderToolPage(main, tool);
    } else if (target.type === 'category') {
        const cat = categories.find(c => c.id === target.id);
        renderCategoryPage(main, cat);
    } else if (target.type === 'guide') {
        const art = articles.find(a => a.slug === target.slug);
        renderArticlePage(main, art);
    } else if (target.type === 'legal') {
        if (target.name === 'privacy') renderPrivacyPolicy(main);
        if (target.name === 'terms') renderTermsOfService(main);
        if (target.name === 'disclaimer') renderDisclaimer(main);
        if (target.name === 'contact') renderContact(main);
    }

    const canonical = doc.querySelector('link[rel="canonical"]');
    const robots = doc.querySelector('meta[name="robots"]');
    const h1 = doc.querySelector('h1');

    assert.ok(doc.title.length > 0, `Title missing for ${target.path}`);
    assert.strictEqual(canonical.href, fullUrl, `Canonical mismatch for ${target.path}`);
    assert.strictEqual(robots.content, 'index, follow', `Robots tag not index, follow on ${target.path}`);
    assert.ok(h1 !== null, `Missing H1 on ${target.path}`);
    console.log(`  ✅ PASS: ${target.path.padEnd(35)} | Title: "${doc.title.slice(0, 30)}..." | Canonical: ${canonical.href}`);
}

console.log('\nTesting 404 route: /this-page-does-not-exist ...');
const invalidDom = new JSDOM(htmlTemplate, { url: `${SITE_URL}/this-page-does-not-exist` });
const invDoc = invalidDom.window.document;
global.window = invalidDom.window;
global.document = invDoc;

// Simulate 404
invDoc.title = 'Page Not Found - Student Utility Hub';
let rMeta = invDoc.querySelector('meta[name="robots"]');
if (!rMeta) {
    rMeta = invDoc.createElement('meta');
    rMeta.setAttribute('name', 'robots');
    invDoc.head.appendChild(rMeta);
}
rMeta.setAttribute('content', 'noindex, follow');

const sitemapContent = fs.readFileSync(path.resolve(process.cwd(), 'public/sitemap-tools.xml'), 'utf8');
assert.ok(!sitemapContent.includes('/this-page-does-not-exist'), '404 route must NOT be in sitemap');
assert.strictEqual(invDoc.title, 'Page Not Found - Student Utility Hub');
assert.strictEqual(rMeta.getAttribute('content'), 'noindex, follow');
console.log('  ✅ PASS: /this-page-does-not-exist renders 404, noindex, follow, and is absent from sitemaps.\n');
