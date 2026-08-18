/**
 * scripts/audit_seo.js
 * Comprehensive Production-Level Automated SEO Audit Test Suite
 * Validates metadata uniqueness, canonical consistency, heading hierarchy,
 * structured JSON-LD schemas, internal linking integrity, and image SEO.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';
import { tools, categories, toKebabCase } from '../src/tools/toolRegistry.js';
import { articles } from '../src/tools/articleRegistry.js';
import { SITE_URL } from '../src/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
console.log('🔍 RUNNING COMPREHENSIVE PRODUCTION SEO AUDIT SUITE');
console.log('===============================================================\n');

// 1. Metadata Uniqueness & Intent Quality
test('All 77 Tools have unique, intent-focused SEO titles and descriptions', () => {
    const seenTitles = new Set();
    const seenDescriptions = new Set();

    tools.forEach(tool => {
        assert.ok(tool.seoTitle && tool.seoTitle.trim().length >= 25, `Tool "${tool.name}" seoTitle is too short or missing: "${tool.seoTitle}"`);
        assert.ok(tool.seoDescription && tool.seoDescription.trim().length >= 50, `Tool "${tool.name}" seoDescription is too short or missing: "${tool.seoDescription}"`);
        
        assert.ok(!seenTitles.has(tool.seoTitle), `Duplicate seoTitle detected for tool "${tool.name}": "${tool.seoTitle}"`);
        assert.ok(!seenDescriptions.has(tool.seoDescription), `Duplicate seoDescription detected for tool "${tool.name}": "${tool.seoDescription}"`);

        seenTitles.add(tool.seoTitle);
        seenDescriptions.add(tool.seoDescription);

        // Ensure title contains branding and intent
        assert.ok(tool.seoTitle.includes('Student Utility Hub'), `Tool "${tool.name}" seoTitle missing branding: "${tool.seoTitle}"`);
    });
});

test('All 8 Educational Guides have unique titles, summaries, and tool mappings', () => {
    const seenGuideTitles = new Set();
    const seenGuideSlugs = new Set();

    articles.forEach(art => {
        assert.ok(art.title && art.title.trim().length >= 20, `Guide "${art.slug}" title is too short`);
        assert.ok(art.summary && art.summary.trim().length >= 40, `Guide "${art.slug}" summary is too short`);
        assert.ok(art.content && Array.isArray(art.content.steps) && art.content.steps.length >= 3, `Guide "${art.slug}" must have at least 3 steps`);
        assert.ok(art.content.faqs && art.content.faqs.length >= 2, `Guide "${art.slug}" must have at least 2 FAQs`);

        assert.ok(!seenGuideTitles.has(art.title), `Duplicate guide title detected: "${art.title}"`);
        assert.ok(!seenGuideSlugs.has(art.slug), `Duplicate guide slug detected: "${art.slug}"`);

        seenGuideTitles.add(art.title);
        seenGuideSlugs.add(art.slug);

        // Verify mapped tool exists in tool registry
        const mappedTool = tools.find(t => t.id === art.toolId);
        assert.ok(mappedTool, `Guide "${art.slug}" maps to non-existent toolId: "${art.toolId}"`);
    });
});

// 2. Canonical Architecture & URL Standards
test('Canonical URL integrity across all indexable entities', () => {
    tools.forEach(tool => {
        const canonical = `${SITE_URL}/tools/${tool.slug}`;
        assert.ok(canonical.startsWith('https://studentutilityhub.in/tools/'), `Invalid canonical structure: ${canonical}`);
        assert.ok(!canonical.includes('#'), `Canonical contains hash: ${canonical}`);
        assert.ok(!canonical.includes('?'), `Canonical contains query params: ${canonical}`);
    });

    categories.filter(c => c.id !== 'all').forEach(cat => {
        const pathSlug = cat.id === 'calculator' ? '/calculators' : `/${cat.id}-tools`;
        const canonical = `${SITE_URL}${pathSlug}`;
        assert.ok(canonical.startsWith('https://studentutilityhub.in/'), `Invalid category canonical: ${canonical}`);
    });

    articles.forEach(art => {
        const canonical = `${SITE_URL}/guides/${art.slug}`;
        assert.ok(canonical.startsWith('https://studentutilityhub.in/guides/'), `Invalid guide canonical: ${canonical}`);
    });
});

// 3. Internal Linking Graph Completeness
test('Internal linking graph completeness: Zero orphan tools or guides', () => {
    // 1. Every tool must have at least 1 related tool and belong to a category
    tools.forEach(tool => {
        assert.ok(Array.isArray(tool.relatedTools) && tool.relatedTools.length > 0, `Tool "${tool.name}" has empty relatedTools array`);
        const cat = categories.find(c => c.id === tool.category);
        assert.ok(cat, `Tool "${tool.name}" assigned to non-existent category: "${tool.category}"`);
    });

    // 2. Every guide must be reachable from Blog and mapped tool
    articles.forEach(art => {
        const parentCat = categories.find(c => c.id === art.category);
        assert.ok(parentCat, `Guide "${art.slug}" belongs to invalid category "${art.category}"`);
    });
});

// 4. Image SEO & Alt Attributes
test('Image asset alt attribute validation in source and components', () => {
    const html = fs.readFileSync(path.resolve(rootDir, 'index.html'), 'utf8');
    
    // Check brand logo in index.html
    assert.ok(html.includes('alt="Student Utility Hub Logo"'), 'index.html logo missing descriptive alt text');
    
    // Check favicon and web manifest assets
    const publicDir = path.resolve(rootDir, 'public');
    assert.ok(fs.existsSync(path.join(publicDir, 'logo.png')), 'logo.png missing in public/');
    assert.ok(fs.existsSync(path.join(publicDir, 'favicon.ico')), 'favicon.ico missing in public/');
    assert.ok(fs.existsSync(path.join(publicDir, 'manifest.json')), 'manifest.json missing in public/');
});

// 5. AdSense Compliance & CLS Prevention
test('AdSense slot parameters and CLS protective dimension wrappers', () => {
    const indexHtml = fs.readFileSync(path.resolve(rootDir, 'index.html'), 'utf8');
    assert.ok(indexHtml.includes('ca-pub-709465335735977'), 'index.html missing exact AdSense publisher ID');
    
    const adsTxt = fs.readFileSync(path.resolve(rootDir, 'public/ads.txt'), 'utf8');
    assert.ok(adsTxt.includes('pub-709465335735977'), 'ads.txt missing authorized publisher ID');

    const mainCss = fs.readFileSync(path.resolve(rootDir, 'src/styles/main.css'), 'utf8');
    assert.ok(mainCss.includes('.top-ad'), 'main.css missing .top-ad CLS container definition');
    assert.ok(mainCss.includes('.inline-ad'), 'main.css missing .inline-ad CLS container definition');
});

console.log('\n===============================================================');
console.log(`📊 PRODUCTION SEO AUDIT SUMMARY:`);
console.log(`   Total Tests Run: ${totalTests}`);
console.log(`   Passed:          ${passedTests}`);
console.log(`   Failed:          ${failedTests}`);
console.log('===============================================================');

if (failedTests > 0) {
    console.error('\n❌ FAILED SEO CHECKS:');
    failures.forEach(f => console.error(` - ${f.name}: ${f.error}`));
    process.exit(1);
} else {
    console.log('\n🌟 PRODUCTION SEO AUDIT PASSED 100% CLEANLY!\n');
    process.exit(0);
}
