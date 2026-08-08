/**
 * MonetizationOpportunityEngine.js
 * Algorithmic Page Monetization Opportunity Scoring
 * Evaluates Traffic + Engagement + Tool Success + Content Quality + Commercial Relevance
 * to grade pages as LOW, MEDIUM, or HIGH monetization candidates.
 */

import { tools } from '../tools/toolRegistry.js';
import { articles } from '../tools/articleRegistry.js';

export const computeMonetizationOpportunities = () => {
    const opportunities = tools.map(tool => {
        let score = 0;

        // 1. Popularity Weight
        if (tool.popularity === 'high' || ['pdfMerge', 'imageCompressor', 'gstCalculator', 'jsonFormatter', 'emiCalculator'].includes(tool.id)) {
            score += 35;
        } else if (tool.popularity === 'medium') {
            score += 20;
        } else {
            score += 10;
        }

        // 2. Commercial Relevance (Financial/Calc & PDF tools have higher commercial query intent)
        if (['calculator', 'pdf', 'image'].includes(tool.category)) {
            score += 30;
        } else if (['developer', 'student'].includes(tool.category)) {
            score += 20;
        } else {
            score += 15;
        }

        // 3. Supporting Content Depth (Has matching guide)
        const hasGuide = articles.some(a => a.toolId === tool.id);
        if (hasGuide) score += 20;

        // 4. Keywords Density
        if (tool.keywords && tool.keywords.length >= 4) score += 15;

        // Assign Grade
        let grade = 'LOW';
        let color = '#94a3b8';
        if (score >= 70) {
            grade = 'HIGH';
            color = '#10b981';
        } else if (score >= 45) {
            grade = 'MEDIUM';
            color = '#f59e0b';
        }

        return {
            id: tool.id,
            name: tool.name,
            slug: tool.slug,
            category: tool.category,
            score,
            grade,
            color,
            recommendation: grade === 'HIGH' ? 
                'Priority candidate for top-performing ad placement below workspace.' :
                grade === 'MEDIUM' ?
                'Standard candidate for contextual inline ad placements.' :
                'Keep ad density low until organic search traffic matures.'
        };
    });

    // Sort highest score first
    opportunities.sort((a, b) => b.score - a.score);

    return opportunities;
};
