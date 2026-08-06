import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file
const envPath = path.resolve(process.cwd(), '.env');
let siteUrl = 'https://student-utility-hub-2ss3.vercel.app';

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^VITE_SITE_URL=(.*)$/m);
    if (match) {
        siteUrl = match[1].trim();
    }
}

// Ensure siteUrl has no trailing slash
siteUrl = siteUrl.replace(/\/$/, '');

const filesToUpdate = [
    'public/robots.txt',
    'public/sitemap.xml',
    'index.html',
    'src/components/Modal.js'
];

filesToUpdate.forEach(filePath => {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // For robots.txt and sitemap.xml, replace all origin URLs (http/https followed by domain)
        // For index.html and Modal.js, replace all origin URLs
        
        // We'll look for anything that looks like https://www.studentutilityhub.com or https://student-utility-hub-2ss3.vercel.app
        // and replace it with siteUrl.
        // A simple regex to find the old URL:
        const urlRegex = /https?:\/\/(www\.)?studentutilityhub\.com|https?:\/\/student-utility-hub-2ss3\.vercel\.app/g;
        
        // For Modal.js we need to ensure the URLs inside JSON-LD are correct. 
        // But since we had a regex replace mistake earlier, let's also fix the broken URLs in Modal.js:
        if (filePath.endsWith('Modal.js')) {
            // Fix the broken JSON-LD breadcrumbs if they were broken
            content = content.replace(/"item": "\/"/g, `"item": "${siteUrl}/"`);
            content = content.replace(/"item": \`\/\#\$\{tool\.category\}\`/g, `"item": \`${siteUrl}/#\${tool.category}\``);
            content = content.replace(/"item": \`\/\#\$\{tool\.id\}\`/g, `"item": \`${siteUrl}/#\${tool.id}\``);
        }

        const updatedContent = content.replace(urlRegex, siteUrl);
        fs.writeFileSync(fullPath, updatedContent, 'utf8');
        console.log(`Updated ${filePath} with ${siteUrl}`);
    }
});
