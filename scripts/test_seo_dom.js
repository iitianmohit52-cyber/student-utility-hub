import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { tools, categories, toKebabCase } from '../src/tools/toolRegistry.js';
import { articles } from '../src/tools/articleRegistry.js';
import { SITE_URL } from '../src/config.js';
import { updateSEO } from '../src/seo.js';

// Rendering function imports
import { renderToolPage } from '../src/components/LandingPage.js';
import { renderCategoryPage } from '../src/components/CategoryPage.js';
import { renderArticlePage } from '../src/components/ArticlePage.js';
import { renderPrivacyPolicy } from '../src/components/legal/PrivacyPolicy.js';
import { renderTermsOfService } from '../src/components/legal/TermsOfService.js';
import { renderDisclaimer } from '../src/components/legal/Disclaimer.js';
import { renderContact } from '../src/components/legal/Contact.js';
import { renderHero } from '../src/components/Hero.js';
import { renderContentHubPage } from '../src/components/ContentHubPage.js';
import { renderAdminDashboard } from '../src/components/AdminDashboard.js';

// Setup Mock globals before running any tests
class IntersectionObserverMock {
    constructor(callback) {
        this.callback = callback;
    }
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

const htmlTemplate = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');

// Storage Mock
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key) => { delete store[key]; }
    };
})();

const getCategoryByPath = (path) => {
    const clean = path.toLowerCase().replace(/^\/+/, '').replace(/\/+$/, '');
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

const resolveRoute = (path) => {
    let normalized = path.trim();
    if (normalized.length > 1 && normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
    }
    
    if (normalized === '/' || normalized === '/index.html') {
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
        return { type: 'blog', title: 'Guides & Educational Resources | Student Utility Hub' };
    }
    
    if (normalized === '/analytics-dashboard') {
        return { type: 'admin', title: 'Admin Analytics Dashboard | Student Utility Hub' };
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

const renderRoute = async (pathSegment, container, resolved) => {
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
        case 'admin':
            renderAdminDashboard(container);
            break;
        case 'legal':
            if (resolved.name === 'privacy-policy') renderPrivacyPolicy(container);
            else if (resolved.name === 'terms-of-service') renderTermsOfService(container);
            else if (resolved.name === 'disclaimer') renderDisclaimer(container);
            else if (resolved.name === 'contact') renderContact(container);
            break;
    }
};

const runTest = async () => {
    console.log('Running JSDOM SEO DOM Canonical and Route Resolution checks...');

    // 1. Load and parse all sub-sitemaps
    const sitemaps = [
        'sitemap-main.xml',
        'sitemap-tools.xml',
        'sitemap-categories.xml',
        'sitemap-blog.xml',
        'sitemap-legal.xml'
    ];
    
    const allUrls = [];
    
    for (const sitemapName of sitemaps) {
        const sitemapPath = path.resolve(process.cwd(), `public/${sitemapName}`);
        if (!fs.existsSync(sitemapPath)) {
            throw new Error(`[SEO REGRESSION] Sitemap file missing: ${sitemapPath}`);
        }
        
        const content = fs.readFileSync(sitemapPath, 'utf8');
        const dom = new JSDOM(content, { contentType: 'text/xml' });
        const locs = Array.from(dom.window.document.querySelectorAll('loc')).map(el => el.textContent);
        
        console.log(`Parsed ${locs.length} URLs from ${sitemapName}`);
        for (const loc of locs) {
            allUrls.push({ url: loc, source: sitemapName });
        }
    }

    console.log(`Auditing all ${allUrls.length} indexable URLs from sitemaps...`);

    for (const { url, source } of allUrls) {
        const parsedUrl = new URL(url);
        const routePath = parsedUrl.pathname === '' ? '/' : parsedUrl.pathname;

        // Resolve route in app registry
        const resolved = resolveRoute(routePath);
        if (!resolved) {
            throw new Error(`[SEO REGRESSION] CRITICAL: Sitemap URL "${url}" in ${source} cannot be resolved in the application route registry (404/Soft-404)!`);
        }

        // Setup fresh JSDOM for checking SEO tags
        const dom = new JSDOM(htmlTemplate, { url: `https://student-utility-hub-2ss3.vercel.app${routePath}` });
        
        // Mock globals safely
        global.window = dom.window;
        global.document = dom.window.document;
        try {
            Object.defineProperty(global, 'navigator', {
                value: dom.window.navigator,
                writable: true,
                configurable: true
            });
        } catch (e) {
            // navigator already defined on global
        }
        global.localStorage = localStorageMock;
        
        // Polyfill window methods in JSDOM
        dom.window.scrollTo = () => {};
        dom.window.IntersectionObserver = IntersectionObserverMock;
        dom.window.ResizeObserver = ResizeObserverMock;

        // Clear pre-rendered HTML and setup container
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.innerHTML = '';
            const mainContent = document.createElement('main');
            mainContent.id = 'router-view';
            appContainer.appendChild(mainContent);
            
            // Execute render function
            await renderRoute(routePath, mainContent, resolved);
        }

        // Hide/remove pre-rendered SEO content silo to prevent duplicate content/H1s
        const seoSilo = document.getElementById('seo-content-silo');
        if (seoSilo) {
            seoSilo.remove();
        }

        // Execute updateSEO
        updateSEO(routePath);

        // Verification: 1. Document Title
        const title = document.title;
        if (!title || title.trim() === '') {
            throw new Error(`[SEO REGRESSION] Route ${routePath} has an empty title.`);
        }

        // Verification: 2. H1 tag (Exactly 1 H1, matching tool/category name)
        const h1s = document.querySelectorAll('h1');
        if (h1s.length !== 1) {
            throw new Error(`[SEO REGRESSION] Route ${routePath} has ${h1s.length} H1 tags. Expected exactly 1.`);
        }
        
        const h1Text = h1s[0].textContent.trim();
        if (h1Text.includes('Page Not Found')) {
            throw new Error(`[SEO REGRESSION] Route ${routePath} rendered a "Page Not Found" (404) header instead of actual content.`);
        }

        // Verification: 3. Meta Description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc || !metaDesc.getAttribute('content') || metaDesc.getAttribute('content').trim() === '') {
            throw new Error(`[SEO REGRESSION] Route ${routePath} is missing a valid meta description.`);
        }

        // Verification: 4. Canonical Tags
        const canonicals = document.querySelectorAll('link[rel="canonical"]');
        if (canonicals.length !== 1) {
            throw new Error(`[SEO REGRESSION] Route ${routePath} has ${canonicals.length} canonical tags. Expected exactly 1.`);
        }

        const canonicalUrl = canonicals[0].href;
        if (canonicalUrl.includes('#')) {
            throw new Error(`[SEO REGRESSION] Route ${routePath} canonical contains a hash: ${canonicalUrl}`);
        }
        if (canonicalUrl.includes('localhost') || canonicalUrl.includes('127.0.0.1')) {
            throw new Error(`[SEO REGRESSION] Route ${routePath} canonical contains development host: ${canonicalUrl}`);
        }

        // Normalise path segment for comparison
        let normalizedPath = routePath;
        if (normalizedPath === '/index.html') {
            normalizedPath = '/';
        }
        const expectedCanonical = `${SITE_URL}${normalizedPath === '/' ? '/' : normalizedPath}`;
        if (canonicalUrl !== expectedCanonical) {
            throw new Error(`[SEO REGRESSION] Route ${routePath} canonical is "${canonicalUrl}", expected "${expectedCanonical}"`);
        }

        // Homepage canonical ONLY on homepage
        if (canonicalUrl === `${SITE_URL}/` && normalizedPath !== '/') {
            throw new Error(`[SEO REGRESSION] Route ${routePath} has the homepage canonical URL.`);
        }

        // Verification: 5. Robots metadata checks (Disallow analytics-dashboard, Allow index for others)
        const robotsMeta = document.querySelector('meta[name="robots"]');
        if (robotsMeta) {
            const content = robotsMeta.getAttribute('content').toLowerCase();
            if (routePath === '/analytics-dashboard') {
                // Must be noindex if specified or disallow, or let robots.txt handle it
            } else if (content.includes('noindex')) {
                throw new Error(`[SEO REGRESSION] Route ${routePath} incorrectly contains "noindex" robots meta directive.`);
            }
        }

        // Verification: 6. Structured Data (JSON-LD validation)
        const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
        jsonLdScripts.forEach(script => {
            try {
                const schema = JSON.parse(script.textContent);
                if (!schema || !schema["@context"]) {
                    throw new Error(`[SEO REGRESSION] Route ${routePath} has invalid JSON-LD schema (missing @context).`);
                }
            } catch (e) {
                throw new Error(`[SEO REGRESSION] Route ${routePath} has malformed JSON-LD syntax: ${e.message}`);
            }
        });
    }

    console.log(`Successfully audited and validated all ${allUrls.length} sitemap routes for correct application route resolution and SEO DOM standards!`);
};

try {
    await runTest();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
