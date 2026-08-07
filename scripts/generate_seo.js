import fs from 'fs';
import path from 'path';
import { tools } from '../src/tools/toolRegistry.js';
import { articles } from '../src/tools/articleRegistry.js';

const SITE_URL = process.env.VITE_SITE_URL || "https://student-utility-hub-2ss3.vercel.app";

// Helper to write sitemap files
const writeSitemap = (filename, urls) => {
    const filePath = path.resolve(process.cwd(), `public/${filename}`);
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `    <url>
        <loc>${SITE_URL}/${u.loc}</loc>
        <changefreq>${u.changefreq}</changefreq>
        <priority>${u.priority}</priority>
    </url>`).join('\n')}
</urlset>`;
    fs.writeFileSync(filePath, sitemapContent, 'utf8');
    console.log(`Generated ${filename} containing ${urls.length} URLs`);
};

// 1. Generate robots.txt
const robotsTxtPath = path.resolve(process.cwd(), 'public/robots.txt');
const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
fs.writeFileSync(robotsTxtPath, robotsTxt, 'utf8');
console.log(`Generated robots.txt with Sitemap: ${SITE_URL}/sitemap.xml`);

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

// 5. Generate main sitemap.xml (Index Sitemap)
const sitemapIndexXmlPath = path.resolve(process.cwd(), 'public/sitemap.xml');
const today = new Date().toISOString().split('T')[0];

const indexSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
</sitemapindex>`;

fs.writeFileSync(sitemapIndexXmlPath, indexSitemapContent, 'utf8');
console.log(`Generated Sitemap Index sitemap.xml listing 3 sub-sitemaps`);
