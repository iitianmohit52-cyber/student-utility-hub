/**
 * Utility functions for DOM manipulation
 */

export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

export const createElement = (tag, className = '', content = '') => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.innerHTML = content;
    return el;
};

export const createToolCard = (tool) => {
    const card = createElement('div', 'tool-card');
    card.setAttribute('data-category', tool.category);
    
    // Add "Popular" badge randomly for visual flair, or specifically if category is calculator
    const isPopular = ['emiCalculator', 'imageCompressor', 'qrCodeGenerator'].includes(tool.id);
    const popularBadge = isPopular ? '<span class="card-badge popular-badge">🔥 Popular</span>' : '';
    
    const categoryName = tool.category.charAt(0).toUpperCase() + tool.category.slice(1);
    const categoryBadge = `<span class="card-badge category-badge">${categoryName}</span>`;

    card.innerHTML = `
        <div class="card-header">
            ${popularBadge}
            ${categoryBadge}
            <button class="favorite-btn" aria-label="Add to favorites" title="Favorite">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="heart-icon"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
        </div>
        <div class="card-icon-wrapper">
            <span class="tool-icon">${tool.icon}</span>
        </div>
        <div class="card-body">
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
        </div>
        <div class="card-footer">
            <a class="tool-button" href="/tools/${tool.slug}" data-tool="${tool.id}" style="text-decoration: none;">
                <span>Open Tool</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
        </div>
    `;
    
    // Toggle favorite state
    const favBtn = card.querySelector('.favorite-btn');
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        favBtn.classList.toggle('active');
        const icon = favBtn.querySelector('svg');
        if (favBtn.classList.contains('active')) {
            icon.style.fill = '#ff4757';
            icon.style.stroke = '#ff4757';
        } else {
            icon.style.fill = 'none';
            icon.style.stroke = 'currentColor';
        }
    });
    
    return card;
};
