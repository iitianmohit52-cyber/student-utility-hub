import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { tools } from '../src/tools/toolRegistry.js';
import { articles } from '../src/tools/articleRegistry.js';
import { SITE_URL } from '../src/config.js';
import { updateSEO } from '../src/seo.js';

const htmlTemplate = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');

const runTest = () => {
    console.log('Running JSDOM SEO DOM Canonical checks...');

    const categoryUrls = [
        'pdf-tools', 'image-tools', 'text-tools', 
        'developer-tools', 'calculators', 'student-tools', 'media-tools'
    ];

    const routes = [
        { path: '/', expected: `${SITE_URL}/` },
        ...tools.map(t => ({ path: `/tools/${t.slug}`, expected: `${SITE_URL}/tools/${t.slug}` })),
        ...articles.map(a => ({ path: `/guides/${a.slug}`, expected: `${SITE_URL}/guides/${a.slug}` })),
        ...categoryUrls.map(c => ({ path: `/${c}`, expected: `${SITE_URL}/${c}` }))
    ];

    for (const route of routes) {
        // Setup JSDOM
        const dom = new JSDOM(htmlTemplate, { url: `https://student-utility-hub-2ss3.vercel.app${route.path}` });
        global.document = dom.window.document;
        global.window = dom.window;

        // Run updateSEO
        updateSEO(route.path);

        const canonicals = document.querySelectorAll('link[rel="canonical"]');

        // Rule: Exactly one canonical
        if (canonicals.length !== 1) {
            throw new Error(`[SEO REGRESSION] Route ${route.path} has ${canonicals.length} canonical tags. Expected exactly 1.`);
        }

        const canonicalUrl = canonicals[0].href;

        // Rule: No hash
        if (canonicalUrl.includes('#')) {
            throw new Error(`[SEO REGRESSION] Route ${route.path} canonical contains a hash: ${canonicalUrl}`);
        }

        // Rule: No localhost
        if (canonicalUrl.includes('localhost') || canonicalUrl.includes('127.0.0.1')) {
            throw new Error(`[SEO REGRESSION] Route ${route.path} canonical contains localhost: ${canonicalUrl}`);
        }

        // Rule: Matches expected exactly
        if (canonicalUrl !== route.expected) {
            throw new Error(`[SEO REGRESSION] Route ${route.path} canonical is "${canonicalUrl}", expected "${route.expected}"`);
        }

        // Rule: Homepage canonical ONLY on homepage route
        if (canonicalUrl === `${SITE_URL}/` && route.path !== '/') {
            throw new Error(`[SEO REGRESSION] Route ${route.path} has the homepage canonical URL.`);
        }
    }

    console.log(`Successfully validated ${routes.length} routes for SEO DOM requirements.`);
};

try {
    runTest();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
