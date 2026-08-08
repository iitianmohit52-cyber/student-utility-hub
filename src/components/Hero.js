import { createElement } from '../utils/dom.js';
import { categories, tools } from '../tools/toolRegistry.js';
import { getFavorites, getRecentlyUsed } from '../utils/userStorage.js';
import { navigate } from '../router.js';

export const renderHero = (container) => {
    const heroSection = createElement('section', 'hero-section');
    
    // Check for returning user data
    const favIds = getFavorites();
    const recentIds = getRecentlyUsed();
    const hasRetentionData = favIds.length > 0 || recentIds.length > 0;

    let retentionHTML = '';
    if (hasRetentionData) {
        const topRecentIds = [...new Set([...recentIds, ...favIds])].slice(0, 4);
        const retentionTools = tools.filter(t => topRecentIds.includes(t.id));

        if (retentionTools.length > 0) {
            retentionHTML = `
                <div class="retention-user-panel" style="background: var(--surface-elevated); border: 1px solid var(--tool-card-border); padding: 1rem 1.25rem; border-radius: var(--radius-lg); margin-bottom: 2rem; text-align: left; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <strong style="color: var(--text-primary); font-size: 0.95rem; display: block;">👋 Welcome Back!</strong>
                        <span style="font-size: 0.85rem; color: var(--text-secondary);">Jump right back into your recently used and favorited tools:</span>
                    </div>
                    <div class="retention-pills" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${retentionTools.map(t => `
                            <button type="button" class="retention-pill-btn" data-slug="${t.slug}" style="background: var(--surface-color); border: 1px solid var(--tool-card-border); color: var(--text-primary); padding: 0.35rem 0.85rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                                <span>${t.icon}</span> ${t.name}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    heroSection.innerHTML = `
        <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
        </div>
        
        <div class="hero-content">
            ${retentionHTML}
            <span class="hero-badge">⚡ 100% Client-Side Processing</span>
            <h1>
                Free Online Tools for <span class="gradient-text">Students, Developers & Everyday Tasks</span>
            </h1>
            <p>
                Access a powerful suite of 75+ client-side utilities for PDF management, image editing, developer formatting, calculations, and student productivity. Zero uploads, zero latency.
            </p>
            
            <div class="hero-cta">
                <button class="primary-btn" id="heroExploreBtn" aria-label="Explore tools list" onclick="document.querySelector('.tool-grid')?.scrollIntoView({behavior: 'smooth'})">
                    Explore 75+ Production Tools
                </button>
            </div>
            
            <div class="hero-stats">
                <div class="stat-card">
                    <span class="stat-icon">⚡</span>
                    <div class="stat-info">
                        <strong>Instant Execution</strong>
                        <span>Zero server latency</span>
                    </div>
                </div>
                <div class="stat-card">
                    <span class="stat-icon">🔒</span>
                    <div class="stat-info">
                        <strong>Privacy First</strong>
                        <span>Files never leave device</span>
                    </div>
                </div>
                <div class="stat-card">
                    <span class="stat-icon">📶</span>
                    <div class="stat-info">
                        <strong>Offline Capable</strong>
                        <span>PWA cache ready</span>
                    </div>
                </div>
                <div class="stat-card">
                    <span class="stat-icon">🛠️</span>
                    <div class="stat-info">
                        <strong>75+ Utilities</strong>
                        <span>Everything in one hub</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="category-filters" id="category-filters" role="tablist" aria-label="Tool Categories">
            <button class="filter-btn" data-category="favorites" role="tab" aria-selected="false" aria-label="Filter tools by Favorites">
                ⭐ Favorites
            </button>
            ${categories.map(cat => `
                <button class="filter-btn ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}" role="tab" aria-selected="${cat.id === 'all' ? 'true' : 'false'}" aria-label="Filter tools by ${cat.name}">
                    ${cat.name}
                </button>
            `).join('')}
        </div>
    `;

    // Attach retention pill click handlers
    heroSection.querySelectorAll('.retention-pill-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const slug = btn.getAttribute('data-slug');
            if (slug) navigate(`/tools/${slug}`);
        };
    });

    container.appendChild(heroSection);
};
