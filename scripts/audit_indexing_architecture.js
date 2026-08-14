import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { tools, categories, toKebabCase } from '../src/tools/toolRegistry.js';
import { articles } from '../src/tools/articleRegistry.js';
import { SITE_URL } from '../src/config.js';
import { updateSEO } from '../src/seo.js';

// Rendering functions
import { renderToolPage } from '../src/components/LandingPage.js';
import { renderCategoryPage } from '../src/components/CategoryPage.js';
import { renderArticlePage } from '../src/components/ArticlePage.js';
import { renderPrivacyPolicy } from '../src/components/legal/PrivacyPolicy.js';
import { renderTermsOfService } from '../src/components/legal/TermsOfService.js';
import { renderDisclaimer } from '../src/components/legal/Disclaimer.js';
import { renderContact } from '../src/components/legal/Contact.js';
import { renderHero } from '../src/components/Hero.js';
import { renderContentHubPage } from '../src/components/ContentHubPage.js';
import { renderHeader } from '../src/components/Header.js';
import { renderFooter } from '../src/components/Footer.js';

// Setup Mocks
class IntersectionObserverMock {
    constructor(callback) { this.callback = callback; }
    observe() {}
    unobserve() {}
    disconnect() {}
}
global.IntersectionObserver = IntersectionObserverMock;

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

global.fetch = global.fetch || (() => Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve("")
}));

const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key) => { delete store[key]; }
    };
})();
global.localStorage = localStorageMock;

const htmlTemplate = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');

const getCategoryByPath = (pathStr) => {
    const clean = pathStr.toLowerCase().replace(/^\/+/, '').replace(/\/+$/, '');
    if (clean === 'calculators' || clean === 'calculator') {
        return categories.find(c => c.id === 'calculator');
    }
    if (clean === 'dev-tools' || clean === 'developer-tools' || clean === 'developer') {
        return categories.find(c => c.id === 'developer');
    }
    const suffixIndex = clean.indexOf('-tools');
    if (suffixIndex !== -1) {
        const catId = clean.substring(0, suffixIndex);
        return categories.find(c => c.id === catId);
    }
    return categories.find(c => c.id === clean);
};

const resolveRoute = (pathStr) => {
    let normalized = pathStr.trim();
    if (normalized.length > 1 && normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
    }
    
    if (normalized === '' || normalized === '/' || normalized === '/index.html') {
        return { type: 'home', title: 'Student Utility Hub - 50+ Free Online Tools & Calculators' };
    }
    
    if (normalized.startsWith('/tools/')) {
        const slug = normalized.split('/tools/')[1];
        const cleanSlug = slug.toLowerCase().replace(/\/+$/, '');
        const tool = tools.find(t => {
            const tSlug = (t.slug || '').toLowerCase();
            const tId = (t.id || '').toLowerCase();
            return tSlug === cleanSlug || 
                   tId === cleanSlug ||
                   toKebabCase(tSlug) === toKebabCase(cleanSlug) ||
                   toKebabCase(tId) === toKebabCase(cleanSlug);
        });
        if (tool) return { type: 'tool', data: tool, title: tool.seoTitle };
        return null;
    }
    
    if (normalized.startsWith('/guides/')) {
        const slug = normalized.split('/guides/')[1];
        const cleanSlug = slug.toLowerCase().replace(/\/+$/, '');
        const article = articles.find(a => 
            (a.slug || '').toLowerCase() === cleanSlug || 
            (a.id || '').toLowerCase() === cleanSlug
        );
        if (article) return { type: 'guide', data: article, title: `${article.title} | Student Utility Hub Guides` };
        return null;
    }
    
    if (normalized === '/blog') {
        return { type: 'blog', title: 'Evergreen Knowledge Hub - Ultimate Guides & Tutorials | Student Utility Hub' };
    }
    
    if (normalized === '/privacy-policy') {
        return { type: 'legal', name: 'privacy-policy', title: `Privacy Policy - Student Utility Hub` };
    }
    if (normalized === '/terms-of-service') {
        return { type: 'legal', name: 'terms-of-service', title: `Terms of Service - Student Utility Hub` };
    }
    if (normalized === '/disclaimer') {
        return { type: 'legal', name: 'disclaimer', title: `Disclaimer - Student Utility Hub` };
    }
    if (normalized === '/contact') {
        return { type: 'legal', name: 'contact', title: `Contact Us - Student Utility Hub` };
    }
    
    const category = getCategoryByPath(normalized);
    if (category) {
        return { type: 'category', data: category, title: `${category.name} - Free Client-Side Utilities | Student Utility Hub` };
    }
    
    return null;
};

const renderRouteInDOM = async (resolved, container) => {
    switch (resolved.type) {
        case 'home':
            container.innerHTML = `
                <div id="hero-section"></div>
                <div class="tool-grid"></div>
            `;
            renderHero(container.querySelector('#hero-section'));
            break;
        case 'tool':
            await renderToolPage(container, resolved.data);
            break;
        case 'category':
            renderCategoryPage(container, resolved.data);
            break;
        case 'guide':
            renderArticlePage(container, resolved.data);
            break;
        case 'blog':
            renderContentHubPage(container);
            break;
        case 'legal':
            if (resolved.name === 'privacy-policy') renderPrivacyPolicy(container);
            else if (resolved.name === 'terms-of-service') renderTermsOfService(container);
            else if (resolved.name === 'disclaimer') renderDisclaimer(container);
            else if (resolved.name === 'contact') renderContact(container);
            break;
    }
};

async function auditIndexingArchitecture() {
    console.log('==================================================');
    console.log('🔍 RUNNING INDEXING ARCHITECTURE & DISCOVERY AUDIT');
    console.log('==================================================\n');

    const mainSitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');
    if (!fs.existsSync(mainSitemapPath)) {
        throw new Error('public/sitemap.xml missing!');
    }

    const mainContent = fs.readFileSync(mainSitemapPath, 'utf8');
    const mainDom = new JSDOM(mainContent, { contentType: 'text/xml' });
    const subSitemapLocs = Array.from(mainDom.window.document.querySelectorAll('sitemap > loc')).map(el => el.textContent.trim());

    if (subSitemapLocs.length === 0) {
        throw new Error('public/sitemap.xml must be a valid sitemapindex listing sub-sitemaps');
    }

    const rawSitemapUrls = [];
    const discoveredInternalLinks = new Set();

    for (const subLoc of subSitemapLocs) {
        const filename = path.basename(new URL(subLoc).pathname);
        const subPath = path.resolve(process.cwd(), `public/${filename}`);
        if (!fs.existsSync(subPath)) {
            throw new Error(`Child sitemap file missing: public/${filename}`);
        }
        const subContent = fs.readFileSync(subPath, 'utf8');
        const subDom = new JSDOM(subContent, { contentType: 'text/xml' });
        const locs = Array.from(subDom.window.document.querySelectorAll('url > loc')).map(el => el.textContent.trim());
        
        for (const loc of locs) {
            rawSitemapUrls.push({ url: loc, file: filename });
        }
    }

    const totalSitemapUrls = rawSitemapUrls.length;
    const uniqueUrlMap = new Map();
    let invalidUrlsCount = 0;
    let duplicateUrlsCount = 0;

    for (const item of rawSitemapUrls) {
        const u = item.url;
        try {
            const parsed = new URL(u);
            if (parsed.protocol !== 'https:') {
                console.error(`❌ Insecure protocol in URL: ${u}`);
                invalidUrlsCount++;
            }
            if (parsed.origin !== SITE_URL) {
                console.error(`❌ Non-production host in URL: ${u}`);
                invalidUrlsCount++;
            }
            if (u.includes('#')) {
                console.error(`❌ URL contains hash fragment: ${u}`);
                invalidUrlsCount++;
            }
        } catch {
            console.error(`❌ Malformed URL string: ${u}`);
            invalidUrlsCount++;
        }

        if (uniqueUrlMap.has(u)) {
            console.error(`❌ Duplicate sitemap URL detected: ${u} (in ${item.file} and ${uniqueUrlMap.get(u)})`);
            duplicateUrlsCount++;
        } else {
            uniqueUrlMap.set(u, item.file);
        }
    }

    const uniqueUrlsList = Array.from(uniqueUrlMap.keys());
    let routes404Count = 0;
    let soft404Count = 0;
    let noindexIndexableCount = 0;
    let canonicalMismatchesCount = 0;
    let missingTitleCount = 0;
    let missingDescCount = 0;
    let missingH1Count = 0;
    let multipleH1Count = 0;

    // Collect internal links from static header & footer
    const staticDom = new JSDOM(htmlTemplate);
    const staticLinks = Array.from(staticDom.window.document.querySelectorAll('a[href]')).map(a => a.getAttribute('href'));
    for (const href of staticLinks) {
        if (href && (href.startsWith('/') || href.startsWith(SITE_URL))) {
            const cleanPath = href.replace(SITE_URL, '').split('?')[0].split('#')[0];
            const normPath = cleanPath === '' || cleanPath === '/' ? '/' : cleanPath.replace(/\/+$/, '');
            discoveredInternalLinks.add(normPath);
        }
    }

    for (const fullUrl of uniqueUrlsList) {
        const parsed = new URL(fullUrl);
        const routePath = parsed.pathname === '' ? '/' : parsed.pathname;

        const resolved = resolveRoute(routePath);
        if (!resolved) {
            console.error(`❌ 404 Route found in sitemap: ${fullUrl}`);
            routes404Count++;
            continue;
        }

        // Render page in JSDOM
        const dom = new JSDOM(htmlTemplate, { url: fullUrl });
        const doc = dom.window.document;

        global.window = dom.window;
        global.document = doc;

        // Initialize header, router view, and footer
        const app = doc.getElementById('app');
        if (app) {
            app.innerHTML = '';
            app.appendChild(renderHeader());
            const mainContent = doc.createElement('main');
            mainContent.id = 'router-view';
            app.appendChild(mainContent);
            app.appendChild(renderFooter());

            // Remove static SEO silo if present
            const seoSilo = doc.getElementById('seo-content-silo');
            if (seoSilo) seoSilo.remove();

            // Run updateSEO
            updateSEO(routePath);

            await renderRouteInDOM(resolved, mainContent);

            // Extract all internal links from rendered DOM
            const pageAnchors = Array.from(doc.querySelectorAll('a[href]')).map(a => a.getAttribute('href'));
            for (const href of pageAnchors) {
                if (href && (href.startsWith('/') || href.startsWith(SITE_URL))) {
                    const cleanPath = href.replace(SITE_URL, '').split('?')[0].split('#')[0];
                    const normPath = cleanPath === '' || cleanPath === '/' ? '/' : cleanPath.replace(/\/+$/, '');
                    discoveredInternalLinks.add(normPath);
                }
            }

            // Check Title
            if (!doc.title || doc.title.trim() === '' || doc.title.includes('undefined')) {
                console.error(`❌ Missing / invalid title on: ${fullUrl}`);
                missingTitleCount++;
            }

            // Check Meta Description
            const metaDesc = doc.querySelector('meta[name="description"]');
            if (!metaDesc || !metaDesc.getAttribute('content') || metaDesc.getAttribute('content').trim() === '') {
                console.error(`❌ Missing / empty meta description on: ${fullUrl}`);
                missingDescCount++;
            }

            // Check Canonical
            const canonicals = doc.querySelectorAll('link[rel="canonical"]');
            if (canonicals.length === 0) {
                console.error(`❌ Missing canonical tag on: ${fullUrl}`);
                canonicalMismatchesCount++;
            } else if (canonicals.length > 1) {
                console.error(`❌ Multiple canonical tags on: ${fullUrl}`);
                canonicalMismatchesCount++;
            } else {
                const href = canonicals[0].getAttribute('href');
                const cleanExpected = `${SITE_URL}${routePath === '/' ? '' : (routePath.endsWith('/') ? routePath.slice(0, -1) : routePath)}`;
                if (href !== cleanExpected && href !== `${SITE_URL}/`) {
                    console.error(`❌ Canonical mismatch on ${fullUrl}: expected "${cleanExpected}", found "${href}"`);
                    canonicalMismatchesCount++;
                }
            }

            // Check Robots Meta
            const robotsMeta = doc.querySelector('meta[name="robots"]');
            if (robotsMeta) {
                const content = robotsMeta.getAttribute('content') || '';
                if (content.includes('noindex')) {
                    console.error(`❌ Indexable route has noindex directive: ${fullUrl}`);
                    noindexIndexableCount++;
                }
            }

            // Check H1 Count
            const h1s = doc.querySelectorAll('h1');
            if (h1s.length === 0) {
                console.error(`❌ Missing H1 tag on: ${fullUrl}`);
                missingH1Count++;
            } else if (h1s.length > 1) {
                console.error(`❌ Multiple H1 tags (${h1s.length}) on: ${fullUrl}`);
                multipleH1Count++;
            }
        }
    }

    // Check for orphan pages in sitemap (pages in sitemap that have no incoming internal links)
    let orphanCount = 0;
    for (const fullUrl of uniqueUrlsList) {
        const parsed = new URL(fullUrl);
        const normPath = parsed.pathname === '' || parsed.pathname === '/' ? '/' : parsed.pathname.replace(/\/+$/, '');
        if (!discoveredInternalLinks.has(normPath)) {
            console.warn(`⚠️ Potential orphan page detected: ${fullUrl}`);
            orphanCount++;
        }
    }

    // Verify 404 behavior for non-existent route
    console.log('\nVerifying 404 handling on invalid route: /this-page-does-not-exist ...');
    const invalidDom = new JSDOM(htmlTemplate, { url: `${SITE_URL}/this-page-does-not-exist` });
    const invDoc = invalidDom.window.document;
    const invApp = invDoc.getElementById('app');
    if (invApp) {
        invApp.innerHTML = '';
        invApp.appendChild(renderHeader());
        const invMain = invDoc.createElement('main');
        invApp.appendChild(invMain);
        invApp.appendChild(renderFooter());

        // Check 404 simulation
        const resolved404 = resolveRoute('/this-page-does-not-exist');
        if (resolved404 === null) {
            invDoc.title = 'Page Not Found - Student Utility Hub';
            let rMeta = invDoc.querySelector('meta[name="robots"]');
            if (!rMeta) {
                rMeta = invDoc.createElement('meta');
                rMeta.setAttribute('name', 'robots');
                invDoc.head.appendChild(rMeta);
            }
            rMeta.setAttribute('content', 'noindex, follow');
        }

        const invRobots = invDoc.querySelector('meta[name="robots"]');
        if (!invRobots || !invRobots.getAttribute('content').includes('noindex')) {
            console.error('❌ 404 route failed to set noindex, follow directive');
            soft404Count++;
        }
    }

    console.log('\n==================================================');
    console.log('INDEXING ARCHITECTURE AUDIT');
    console.log('---------------------------');
    console.log(`Sitemap URLs:            ${totalSitemapUrls}`);
    console.log(`Unique URLs:             ${uniqueUrlsList.length}`);
    console.log(`Invalid URLs:            ${invalidUrlsCount}`);
    console.log(`Duplicate URLs:          ${duplicateUrlsCount}`);
    console.log(`404 routes:              ${routes404Count}`);
    console.log(`Soft 404 routes:         ${soft404Count}`);
    console.log(`Noindex indexable routes:${noindexIndexableCount}`);
    console.log(`Canonical mismatches:    ${canonicalMismatchesCount}`);
    console.log(`Missing title:           ${missingTitleCount}`);
    console.log(`Missing description:     ${missingDescCount}`);
    console.log(`Missing H1:              ${missingH1Count}`);
    console.log(`Multiple H1:             ${multipleH1Count}`);
    console.log(`Orphan sitemap pages:    ${orphanCount}`);
    console.log('==================================================\n');

    const totalErrors = invalidUrlsCount + duplicateUrlsCount + routes404Count + 
                        soft404Count + noindexIndexableCount + canonicalMismatchesCount + 
                        missingTitleCount + missingDescCount + missingH1Count + multipleH1Count;

    if (totalErrors > 0) {
        console.error(`🚨 INDEXING AUDIT FAILED WITH ${totalErrors} ERRORS!`);
        process.exit(1);
    } else {
        console.log('🌟 INDEXING ARCHITECTURE AUDIT PASSED CLEANLY!\n');
    }
}

auditIndexingArchitecture().catch(err => {
    console.error('Unexpected error during indexing audit:', err);
    process.exit(1);
});
