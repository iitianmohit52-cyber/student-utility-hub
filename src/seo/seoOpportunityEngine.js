/**
 * seoOpportunityEngine.js
 * SEO Growth & Content Opportunity Detector
 * Analyzes internal registries, usage popularity, guide ratios, and search query logs
 * to generate actionable developer/admin growth recommendations.
 */

import { tools, categories } from '../tools/toolRegistry.js';
import { articles } from '../tools/articleRegistry.js';
import { getSearchHistory } from '../utils/userStorage.js';

export const detectSEOOpportunities = () => {
    const opportunities = [];

    // 1. Detect Popular Tools missing dedicated guides
    tools.forEach(tool => {
        const hasGuide = articles.some(a => a.toolId === tool.id);
        const isPopular = tool.popularity === 'high' || ['pdfMerge', 'imageCompressor', 'gstCalculator', 'jsonFormatter', 'emiCalculator'].includes(tool.id);

        if (isPopular && !hasGuide) {
            opportunities.push({
                type: 'MISSING_GUIDE',
                priority: 'HIGH',
                target: tool.name,
                url: `/tools/${tool.slug}`,
                title: `High Popularity Tool Missing Guide: ${tool.name}`,
                description: `Users frequently access ${tool.name}, but no step-by-step guide article exists in articleRegistry.js. Creating a guide will boost search rankings.`
            });
        }
    });

    // 2. Detect Categories with low guide coverage (< 30%)
    categories.filter(c => c.id !== 'all').forEach(cat => {
        const catTools = tools.filter(t => t.category === cat.id);
        const catGuides = articles.filter(a => a.category === cat.id);
        const ratio = catTools.length > 0 ? (catGuides.length / catTools.length) : 0;

        if (ratio < 0.3) {
            opportunities.push({
                type: 'LOW_GUIDE_COVERAGE',
                priority: 'MEDIUM',
                target: `${cat.name} Category`,
                url: `/${cat.id}-tools`,
                title: `Low Guide Ratio for ${cat.name} (${Math.round(ratio * 100)}%)`,
                description: `${cat.name} has ${catTools.length} tools but only ${catGuides.length} supporting guide articles. Add 2-3 guides to establish category authority.`
            });
        }
    });

    // 3. Detect Isolated Tools (fewer than 3 related tools in category)
    tools.forEach(tool => {
        const categoryTools = tools.filter(t => t.category === tool.category && t.id !== tool.id);
        if (categoryTools.length < 2) {
            opportunities.push({
                type: 'ISOLATED_TOOL',
                priority: 'LOW',
                target: tool.name,
                url: `/tools/${tool.slug}`,
                title: `Isolated Tool: ${tool.name}`,
                description: `${tool.name} has fewer than 2 related tools in category '${tool.category}'. Consider adding complementary tools to improve internal linking.`
            });
        }
    });

    // 4. Detect Unmet Search Demand from client search log
    const searchTerms = getSearchHistory();
    searchTerms.forEach(term => {
        const cleanTerm = term.toLowerCase().trim();
        const matchesTool = tools.some(t => 
            t.name.toLowerCase().includes(cleanTerm) || 
            t.description.toLowerCase().includes(cleanTerm) ||
            (t.keywords && t.keywords.some(k => k.toLowerCase().includes(cleanTerm)))
        );

        if (!matchesTool && cleanTerm.length >= 3) {
            opportunities.push({
                type: 'UNMET_SEARCH_DEMAND',
                priority: 'HIGH',
                target: cleanTerm,
                url: '/admin',
                title: `Unmet Search Demand: "${cleanTerm}"`,
                description: `Users searched for "${cleanTerm}", but no exact tool or guide matched. Build a dedicated tool or keyword landing page for this query.`
            });
        }
    });

    return opportunities;
};
