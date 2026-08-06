import fs from 'fs';
import path from 'path';

// Since this is a Node script for prebuild/build, we can't use import.meta.env.
// But we use the SAME logic for the central configuration logic by reading process.env.
const SITE_URL = process.env.VITE_SITE_URL || "https://student-utility-hub-2ss3.vercel.app";

// 1. Generate robots.txt
const robotsTxtPath = path.resolve(process.cwd(), 'public/robots.txt');
const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
fs.writeFileSync(robotsTxtPath, robotsTxt, 'utf8');
console.log(`Generated robots.txt with Sitemap: ${SITE_URL}/sitemap.xml`);

// 2. Generate sitemap.xml
const sitemapXmlPath = path.resolve(process.cwd(), 'public/sitemap.xml');
const tools = [
    '', '#imageConverter', '#imageCompressor', '#imageCropper', 
    '#videoConverter', '#audioConverter', '#audioTrimmer', 
    '#ageCalculator', '#emiCalculator', '#sipCalculator', 
    '#bmiCalculator', '#qrCodeGenerator', '#passwordGenerator', 
    '#wordCounter', '#base64EncoderDecoder', '#jsonFormatter', 
    '#colorPicker', '#textToSpeech', '#speechToText', 
    '#unitConverter', '#timerStopwatch'
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${tools.map(tool => `    <url>
        <loc>${SITE_URL}/${tool.replace('#', '') ? tool : ''}</loc>
        <changefreq>${tool === '' ? 'weekly' : 'monthly'}</changefreq>
        <priority>${tool === '' ? '1.0' : '0.8'}</priority>
    </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(sitemapXmlPath, sitemapXml, 'utf8');
console.log(`Generated sitemap.xml for ${SITE_URL}`);
