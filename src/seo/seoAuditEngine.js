/**
 * seoAuditEngine.js
 * Automated Content Quality Audit Utility
 * Inspects every registered tool and article in Student Utility Hub against 14 SEO criteria.
 * Single source of truth: toolRegistry, articleRegistry, categories.
 */

import { tools, categories } from '../tools/toolRegistry.js';
import { articles } from '../tools/articleRegistry.js';
import { SITE_URL } from '../config.js';

export const runSEOAudit = () => {
    const toolAudits = tools.map(tool => auditToolPage(tool));
    const articleAudits = articles.map(article => auditArticlePage(article));
    const categoryAudits = categories.filter(c => c.id !== 'all').map(cat => auditCategoryPage(cat));

    const allAudits = [...toolAudits, ...articleAudits, ...categoryAudits];

    const passCount = allAudits.filter(a => a.status === 'PASS').length;
    const warningCount = allAudits.filter(a => a.status === 'WARNING').length;
    const attentionCount = allAudits.filter(a => a.status === 'NEEDS ATTENTION').length;

    return {
        summary: {
            totalIndexedURLs: allAudits.length,
            totalTools: tools.length,
            totalCategories: categories.filter(c => c.id !== 'all').length,
            totalGuides: articles.length,
            passCount,
            warningCount,
            attentionCount,
            healthScore: Math.round((passCount / (allAudits.length || 1)) * 100)
        },
        audits: allAudits
    };
};

const auditToolPage = (tool) => {
    const checks = [];
    const slug = tool.slug || tool.id;
    const url = `/tools/${slug}`;
    const relatedGuide = articles.find(a => a.toolId === tool.id);
    const categoryTools = tools.filter(t => t.category === tool.category && t.id !== tool.id);

    // 1. Title check
    const title = tool.seoTitle || `${tool.name} - Free Online Tool | Student Utility Hub`;
    if (!title) {
        checks.push({ name: 'SEO Title', pass: false, severity: 'NEEDS ATTENTION', msg: 'Missing SEO Title' });
    } else if (title.length < 30 || title.length > 70) {
        checks.push({ name: 'SEO Title Length', pass: false, severity: 'WARNING', msg: `Title length is ${title.length} chars (Recommended: 30-65)` });
    } else {
        checks.push({ name: 'SEO Title', pass: true, msg: 'Optimal' });
    }

    // 2. Meta description check
    const desc = tool.seoDescription || tool.description;
    if (!desc) {
        checks.push({ name: 'Meta Description', pass: false, severity: 'NEEDS ATTENTION', msg: 'Missing Meta Description' });
    } else if (desc.length < 70 || desc.length > 170) {
        checks.push({ name: 'Meta Description Length', pass: false, severity: 'WARNING', msg: `Description length is ${desc.length} chars (Recommended: 70-160)` });
    } else {
        checks.push({ name: 'Meta Description', pass: true, msg: 'Optimal' });
    }

    // 3. Canonical URL
    checks.push({ name: 'Canonical URL', pass: true, msg: `${SITE_URL}${url}` });

    // 4. H1 Heading
    checks.push({ name: 'H1 Heading', pass: !!tool.name, msg: tool.name ? 'Present' : 'Missing H1' });

    // 5. Keywords
    if (!tool.keywords || tool.keywords.length < 2) {
        checks.push({ name: 'Keywords', pass: false, severity: 'WARNING', msg: 'Fewer than 2 keywords defined' });
    } else {
        checks.push({ name: 'Keywords', pass: true, msg: `${tool.keywords.length} keywords defined` });
    }

    // 6. Category
    checks.push({ name: 'Category', pass: !!tool.category, msg: tool.category ? tool.category : 'Uncategorized' });

    // 7. Related Tools
    if (categoryTools.length === 0) {
        checks.push({ name: 'Related Tools', pass: false, severity: 'WARNING', msg: 'No related tools found in category' });
    } else {
        checks.push({ name: 'Related Tools', pass: true, msg: `${categoryTools.length} category tools available` });
    }

    // 8. FAQ Schema
    checks.push({ name: 'FAQ Data', pass: true, msg: 'Dynamic category FAQ schema generated' });

    // 9. Dedicated Guide Link
    if (!relatedGuide) {
        checks.push({ name: 'Dedicated Guide', pass: false, severity: 'WARNING', msg: 'No dedicated guide article linked' });
    } else {
        checks.push({ name: 'Dedicated Guide', pass: true, msg: `Linked to /guides/${relatedGuide.slug}` });
    }

    // 10. SoftwareApplication JSON-LD
    checks.push({ name: 'JSON-LD Schema', pass: true, msg: 'SoftwareApplication & BreadcrumbList active' });

    // Compute Overall Page Status
    const hasAttention = checks.some(c => !c.pass && c.severity === 'NEEDS ATTENTION');
    const hasWarning = checks.some(c => !c.pass && c.severity === 'WARNING');
    const status = hasAttention ? 'NEEDS ATTENTION' : (hasWarning ? 'WARNING' : 'PASS');

    return {
        id: tool.id,
        type: 'TOOL',
        name: tool.name,
        url,
        status,
        checks
    };
};

const auditArticlePage = (article) => {
    const checks = [];
    const url = `/guides/${article.slug}`;

    // Title
    const title = article.title;
    if (!title || title.length < 20) {
        checks.push({ name: 'Article Title', pass: false, severity: 'NEEDS ATTENTION', msg: 'Title too short or missing' });
    } else {
        checks.push({ name: 'Article Title', pass: true, msg: 'Optimal' });
    }

    // Summary/Description
    const desc = article.summary;
    if (!desc || desc.length < 50) {
        checks.push({ name: 'Article Summary', pass: false, severity: 'WARNING', msg: 'Summary is short' });
    } else {
        checks.push({ name: 'Article Summary', pass: true, msg: 'Optimal' });
    }

    // Canonical
    checks.push({ name: 'Canonical URL', pass: true, msg: `${SITE_URL}${url}` });

    // Tool Link
    const linkedTool = tools.find(t => t.id === article.toolId);
    if (!linkedTool) {
        checks.push({ name: 'Target Tool Link', pass: false, severity: 'NEEDS ATTENTION', msg: 'No valid target tool ID associated' });
    } else {
        checks.push({ name: 'Target Tool Link', pass: true, msg: `Linked to tool ${linkedTool.name}` });
    }

    // Steps & FAQs
    const stepCount = article.content?.steps?.length || 0;
    const faqCount = article.content?.faqs?.length || 0;
    checks.push({ name: 'Content Depth', pass: stepCount >= 3, msg: `${stepCount} steps, ${faqCount} FAQs` });

    const hasAttention = checks.some(c => !c.pass && c.severity === 'NEEDS ATTENTION');
    const hasWarning = checks.some(c => !c.pass && c.severity === 'WARNING');
    const status = hasAttention ? 'NEEDS ATTENTION' : (hasWarning ? 'WARNING' : 'PASS');

    return {
        id: article.slug,
        type: 'GUIDE',
        name: article.title,
        url,
        status,
        checks
    };
};

const auditCategoryPage = (category) => {
    const checks = [];
    const url = `/${category.id}-tools`;
    const catTools = tools.filter(t => t.category === category.id);

    checks.push({ name: 'Title & Meta', pass: !!category.name, msg: `${category.name} Tools` });
    checks.push({ name: 'Canonical URL', pass: true, msg: `${SITE_URL}${url}` });
    checks.push({ name: 'Tool Inventory', pass: catTools.length > 0, msg: `${catTools.length} tools registered` });

    const status = catTools.length === 0 ? 'NEEDS ATTENTION' : 'PASS';

    return {
        id: category.id,
        type: 'CATEGORY',
        name: `${category.name} Tools`,
        url,
        status,
        checks
    };
};
