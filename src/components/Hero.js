import { createElement } from '../utils/dom.js';
import { categories } from '../tools/toolRegistry.js';

export const renderHero = (container) => {
    const heroSection = createElement('section', 'hero-section');
    
    heroSection.innerHTML = `
        <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
        </div>
        
        <div class="hero-content">
            <span class="hero-badge">⚡ 100% Client-Side Processing</span>
            <h2 style="font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.03em;">
                Your Enterprise Hub for <span class="gradient-text">Free Online Tools</span>
            </h2>
            <p style="font-size: 1.15rem; max-width: 720px; margin: 1.25rem auto 2.5rem; color: var(--text-secondary); line-height: 1.6;">
                Access a powerful suite of 75+ client-side utilities for PDF management, image editing, developer formatting, calculations, and student productivity. Zero uploads, zero latency.
            </p>
            
            <div class="hero-cta" style="margin-bottom: 3.5rem;">
                <button class="primary-btn" id="heroExploreBtn" aria-label="Explore tools list" onclick="document.querySelector('.tool-grid')?.scrollIntoView({behavior: 'smooth'})" style="padding: 0.9rem 2.2rem; font-size: 1.05rem;">
                    🚀 Explore 75+ Production Tools
                </button>
            </div>
            
            <div class="hero-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; max-width: 1000px; margin: 0 auto 3rem;">
                <div class="stat-card" style="background: var(--surface-glass); backdrop-filter: blur(16px); border: 1px solid var(--glass-border); padding: 1.25rem; border-radius: var(--radius-lg);">
                    <span class="stat-icon" style="font-size: 1.6rem;">⚡</span>
                    <div class="stat-info">
                        <strong>Instant Execution</strong>
                        <span>Zero server latency</span>
                    </div>
                </div>
                <div class="stat-card" style="background: var(--surface-glass); backdrop-filter: blur(16px); border: 1px solid var(--glass-border); padding: 1.25rem; border-radius: var(--radius-lg);">
                    <span class="stat-icon" style="font-size: 1.6rem;">🔒</span>
                    <div class="stat-info">
                        <strong>Privacy First</strong>
                        <span>Files never leave device</span>
                    </div>
                </div>
                <div class="stat-card" style="background: var(--surface-glass); backdrop-filter: blur(16px); border: 1px solid var(--glass-border); padding: 1.25rem; border-radius: var(--radius-lg);">
                    <span class="stat-icon" style="font-size: 1.6rem;">📶</span>
                    <div class="stat-info">
                        <strong>Offline Capable</strong>
                        <span>PWA cache ready</span>
                    </div>
                </div>
                <div class="stat-card" style="background: var(--surface-glass); backdrop-filter: blur(16px); border: 1px solid var(--glass-border); padding: 1.25rem; border-radius: var(--radius-lg);">
                    <span class="stat-icon" style="font-size: 1.6rem;">🛠️</span>
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

    container.appendChild(heroSection);
};
