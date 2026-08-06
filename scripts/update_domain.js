import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'index.html',
  'src/components/Modal.js',
  'public/robots.txt',
  'public/sitemap.xml'
];

const oldDomain = process.argv[2];
const newDomain = process.argv[3];

if (!oldDomain || !newDomain) {
  console.error("Usage: node scripts/update_domain.js <old-domain> <new-domain>");
  console.error("Example: node scripts/update_domain.js https://www.studentutilityhub.com/ https://student-utility-hub-2ss3.vercel.app/");
  process.exit(1);
}

try {
  const oldUrl = new URL(oldDomain).origin;
  const newUrl = new URL(newDomain).origin;
  
  filesToUpdate.forEach(filePath => {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      const regex = new RegExp(oldUrl.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g');
      const updatedContent = content.replace(regex, newUrl);
      fs.writeFileSync(fullPath, updatedContent, 'utf-8');
      console.log(`Updated ${filePath}`);
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  });
  console.log("Domain update complete. Remember to build and deploy your project.");
} catch (error) {
  console.error("Error processing URLs:", error.message);
  process.exit(1);
}
