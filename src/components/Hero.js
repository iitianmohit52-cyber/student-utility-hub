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
            <span class="hero-badge">100% Client-Side Processing</span>
            <h2>Your Ultimate Collection of <span class="gradient-text">Free Online Tools</span></h2>
            <p>Access a suite of 50+ powerful online tools for PDF, images, developer, calculations, and text processing. Fast, free, and secure.</p>
            <div class="hero-cta">
                <button class="primary-btn" id="heroExploreBtn" aria-label="Explore tools list" onclick="document.querySelector('.tool-grid')?.scrollIntoView({behavior: 'smooth'})">🚀 Explore All 50+ Tools</button>
            </div>
            
            <div class="hero-stats">
                <div class="stat-card">
                    <span class="stat-icon">⚡</span>
                    <div class="stat-info">
                        <strong>Lightning Fast</strong>
                        <span>Zero server latency</span>
                    </div>
                </div>
                <div class="stat-card">
                    <span class="stat-icon">🔒</span>
                    <div class="stat-info">
                        <strong>Privacy First</strong>
                        <span>Files never leave your device</span>
                    </div>
                </div>
                <div class="stat-card">
                    <span class="stat-icon">🛠️</span>
                    <div class="stat-info">
                        <strong>50+ Utilities</strong>
                        <span>Everything you need in one place</span>
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

