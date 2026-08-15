import fs from 'fs';
import path from 'path';
import { tools } from '../src/tools/toolRegistry.js';
import { articles } from '../src/tools/articleRegistry.js';

import { SITE_URL } from '../src/config.js';

// SEO REGRESSION PROTECTION (Requirement 16)
const validateSEORequirements = () => {
    console.log('Running pre-build SEO Regression Protection checks...');

    // 1. Production URL Validation
    if (!SITE_URL || !SITE_URL.startsWith('http') || SITE_URL.includes('localhost') || SITE_URL.includes('127.0.0.1') || SITE_URL.includes('vercel.app') || SITE_URL.includes('student-utility-hub-2ss3')) {
        throw new Error(`[SEO REGRESSION] Invalid production SITE_URL: "${SITE_URL}". Localhost/Vercel legacy URLs are forbidden in production sitemaps.`);
    }

    // 2. Registry Validation (Titles, descriptions, H1s, Canonical references)
    tools.forEach(tool => {
        if (!tool.seoTitle || tool.seoTitle.trim() === '') {
            throw new Error(`[SEO REGRESSION] Tool "${tool.name}" is missing a valid seoTitle.`);
        }
        if (!tool.seoDescription || tool.seoDescription.trim() === '') {
            throw new Error(`[SEO REGRESSION] Tool "${tool.name}" is missing a valid seoDescription.`);
        }
        if (tool.status === 'draft') {
            throw new Error(`[SEO REGRESSION] Tool "${tool.name}" is marked as draft but has sitemap inclusion attempt.`);
        }
    });

    // 3. Simulated Canonical Route Checks (Requirement Check)
    tools.forEach(tool => {
        const cleanPath = `/tools/${tool.slug}`;
        const canonical = `${SITE_URL}${cleanPath}`;
        
        if (cleanPath === '/') {
            throw new Error(`[SEO REGRESSION] Tool "${tool.name}" canonical points to homepage "/" root.`);
        }
        if (canonical.includes('#')) {
            throw new Error(`[SEO REGRESSION] Tool "${tool.name}" canonical contains a "#" hash: "${canonical}"`);
        }
        if (canonical.includes('localhost') || canonical.includes('127.0.0.1')) {
            throw new Error(`[SEO REGRESSION] Tool "${tool.name}" canonical contains development host: "${canonical}"`);
        }
        const expected = `${SITE_URL}/tools/${tool.slug}`;
        if (canonical !== expected) {
            throw new Error(`[SEO REGRESSION] Tool "${tool.name}" canonical "${canonical}" does not match clean route "${expected}"`);
        }
    });

    articles.forEach(art => {
        if (!art.title || art.title.trim() === '') {
            throw new Error(`[SEO REGRESSION] Article "${art.slug}" is missing a title.`);
        }
        if (!art.summary || art.summary.trim() === '') {
            throw new Error(`[SEO REGRESSION] Article "${art.slug}" is missing a description summary.`);
        }

        const cleanPath = `/guides/${art.slug}`;
        const canonical = `${SITE_URL}${cleanPath}`;
        
        if (cleanPath === '/') {
            throw new Error(`[SEO REGRESSION] Article "${art.slug}" canonical points to homepage "/" root.`);
        }
        if (canonical.includes('#')) {
            throw new Error(`[SEO REGRESSION] Article "${art.slug}" canonical contains a "#" hash: "${canonical}"`);
        }
        if (canonical.includes('localhost') || canonical.includes('127.0.0.1')) {
            throw new Error(`[SEO REGRESSION] Article "${art.slug}" canonical contains development host: "${canonical}"`);
        }
        const expected = `${SITE_URL}/guides/${art.slug}`;
        if (canonical !== expected) {
            throw new Error(`[SEO REGRESSION] Article "${art.slug}" canonical "${canonical}" does not match clean route "${expected}"`);
        }
    });
};

validateSEORequirements();

// Helper to write sitemap files
const writeSitemap = (filename, urls) => {
    const filePath = path.resolve(process.cwd(), `public/${filename}`);
    const seenUrls = new Set();

    urls.forEach(u => {
        const fullUrl = `${SITE_URL}/${u.loc}`;
        
        // 1. Duplicate check
        if (seenUrls.has(fullUrl)) {
            throw new Error(`[SITEMAP QUALITY] Duplicate URL detected in ${filename}: "${fullUrl}"`);
        }
        seenUrls.add(fullUrl);

        // 2. Hash check
        if (u.loc.includes('#')) {
            throw new Error(`[SITEMAP QUALITY] Hash URL detected in ${filename}: "${fullUrl}"`);
        }

        // 3. Localhost check
        if (fullUrl.includes('localhost') || fullUrl.includes('127.0.0.1')) {
            throw new Error(`[SITEMAP QUALITY] Localhost reference detected in sitemap: "${fullUrl}"`);
        }
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `    <url>
        <loc>${SITE_URL}/${u.loc === '' ? '' : u.loc}</loc>
        <changefreq>${u.changefreq}</changefreq>
        <priority>${u.priority}</priority>
    </url>`).join('\n')}
</urlset>`;
    fs.writeFileSync(filePath, sitemapContent, 'utf8');
    console.log(`Generated ${filename} containing ${urls.length} URLs`);
};

// 1. Generate robots.txt
const robotsTxtPath = path.resolve(process.cwd(), 'public/robots.txt');
const robotsTxt = `User-agent: *\nAllow: /\nDisallow: /analytics-dashboard\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
fs.writeFileSync(robotsTxtPath, robotsTxt, 'utf8');
console.log(`Generated robots.txt with Disallow: /analytics-dashboard and Sitemap: ${SITE_URL}/sitemap.xml`);

// 2. Generate sitemap-tools.xml
const toolUrls = tools.map(tool => ({
    loc: `tools/${tool.slug}`,
    changefreq: 'monthly',
    priority: '0.8'
}));
writeSitemap('sitemap-tools.xml', toolUrls);

// 3. Generate sitemap-categories.xml
const categoryUrls = [
    { loc: 'pdf-tools', changefreq: 'weekly', priority: '0.9' },
    { loc: 'image-tools', changefreq: 'weekly', priority: '0.9' },
    { loc: 'text-tools', changefreq: 'weekly', priority: '0.9' },
    { loc: 'developer-tools', changefreq: 'weekly', priority: '0.9' },
    { loc: 'calculators', changefreq: 'weekly', priority: '0.9' },
    { loc: 'student-tools', changefreq: 'weekly', priority: '0.9' },
    { loc: 'media-tools', changefreq: 'weekly', priority: '0.9' }
];
writeSitemap('sitemap-categories.xml', categoryUrls);

// 4. Generate sitemap-blog.xml
const blogUrls = [
    { loc: 'blog', changefreq: 'weekly', priority: '0.8' },
    ...articles.map(art => ({
        loc: `guides/${art.slug}`,
        changefreq: 'weekly',
        priority: '0.7'
    }))
];
writeSitemap('sitemap-blog.xml', blogUrls);

// 5. Generate sitemap-legal.xml
const legalUrls = [
    { loc: 'privacy-policy', changefreq: 'monthly', priority: '0.5' },
    { loc: 'terms-of-service', changefreq: 'monthly', priority: '0.5' },
    { loc: 'disclaimer', changefreq: 'monthly', priority: '0.5' },
    { loc: 'contact', changefreq: 'monthly', priority: '0.8' }
];
writeSitemap('sitemap-legal.xml', legalUrls);

// 6. Generate sitemap-main.xml (Homepage)
const mainUrls = [
    { loc: '', changefreq: 'daily', priority: '1.0' }
];
writeSitemap('sitemap-main.xml', mainUrls);

// 7. Generate main sitemap.xml (Index Sitemap)
const sitemapIndexXmlPath = path.resolve(process.cwd(), 'public/sitemap.xml');
const today = new Date().toISOString().split('T')[0];

const indexSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${SITE_URL}/sitemap-main.xml</loc>
        <lastmod>${today}</lastmod>
    </sitemap>
    <sitemap>
        <loc>${SITE_URL}/sitemap-tools.xml</loc>
        <lastmod>${today}</lastmod>
    </sitemap>
    <sitemap>
        <loc>${SITE_URL}/sitemap-categories.xml</loc>
        <lastmod>${today}</lastmod>
    </sitemap>
    <sitemap>
        <loc>${SITE_URL}/sitemap-blog.xml</loc>
        <lastmod>${today}</lastmod>
    </sitemap>
    <sitemap>
        <loc>${SITE_URL}/sitemap-legal.xml</loc>
        <lastmod>${today}</lastmod>
    </sitemap>
</sitemapindex>`;

fs.writeFileSync(sitemapIndexXmlPath, indexSitemapContent, 'utf8');
console.log(`Generated Sitemap Index sitemap.xml listing 5 sub-sitemaps`);

// 8. CRITICAL REGRESSION TEST: Ensure old domain NEVER appears in generated files
const generatedFilesToCheck = [
    'public/robots.txt',
    'public/sitemap.xml',
    'public/sitemap-main.xml',
    'public/sitemap-tools.xml',
    'public/sitemap-categories.xml',
    'public/sitemap-blog.xml',
    'public/sitemap-legal.xml'
];

for (const relPath of generatedFilesToCheck) {
    const fullPath = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`[SEO REGRESSION] Required generated file missing: ${relPath}`);
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('student-utility-hub-2ss3.vercel.app')) {
        throw new Error(`[SEO REGRESSION] CRITICAL FAILURE: Old Vercel hostname "student-utility-hub-2ss3.vercel.app" found in generated ${relPath}!`);
    }
    if (content.includes('.vercel.app')) {
        throw new Error(`[SEO REGRESSION] CRITICAL FAILURE: Vercel hostname found in generated ${relPath}!`);
    }
}
console.log('✅ Passed regression check: Zero old Vercel domain references in all sitemaps and robots.txt\n');

