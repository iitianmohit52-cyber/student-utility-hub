import { articles } from '../tools/articleRegistry.js';
import { navigate } from '../router.js';

export const renderContentHubPage = (container) => {
    // Set page SEO metadata dynamically
    document.title = 'Evergreen Knowledge Hub - Ultimate Guides & Tutorials | Student Utility Hub';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', 'Explore our comprehensive guides, step-by-step tutorials, and comparisons for online calculators, image converters, and developer formatters.');
    }

    container.innerHTML = `
        <div class="content-hub-container" style="max-width: var(--max-width); margin: 0 auto; padding: 2rem 1.5rem; animation: fadeIn 0.3s ease-out;">
            <!-- Breadcrumbs -->
            <nav class="breadcrumb" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem; font-weight: 500;">
                <a href="/">Home</a> &gt; 
                <span style="color: var(--text-primary);">Knowledge Hub</span>
            </nav>

            <!-- Hero Banner -->
            <header class="hub-hero" style="margin-bottom: 3rem; text-align: center; padding: 3rem 1.5rem; background: var(--surface-elevated); border-radius: var(--radius-lg); border: 1px solid var(--tool-card-border);">
                <span style="font-size: 3.5rem; display: block; margin-bottom: 1rem;">📚</span>
                <h1 style="font-size: 2.5rem; margin: 0 0 0.75rem 0; font-weight: 800; color: var(--text-primary);">Evergreen Knowledge Hub</h1>
                <p style="font-size: 1.2rem; color: var(--text-secondary); margin: 0 auto; max-width: 700px; line-height: 1.6;">
                    Expert-curated guides, beginner-friendly tutorials, and detailed comparisons to support your academic and development productivity.
                </p>
            </header>

            <!-- Article Filter Controls -->
            <div style="margin-bottom: 2rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                <button type="button" class="filter-btn active" data-filter="all" style="padding: 0.5rem 1.2rem; border-radius: 30px; font-weight: 600; cursor: pointer;">All Articles</button>
                <button type="button" class="filter-btn" data-filter="pdf" style="padding: 0.5rem 1.2rem; border-radius: 30px; font-weight: 600; cursor: pointer;">PDF Guides</button>
                <button type="button" class="filter-btn" data-filter="image" style="padding: 0.5rem 1.2rem; border-radius: 30px; font-weight: 600; cursor: pointer;">Image Optimizing</button>
                <button type="button" class="filter-btn" data-filter="calculator" style="padding: 0.5rem 1.2rem; border-radius: 30px; font-weight: 600; cursor: pointer;">Calculators</button>
            </div>

            <!-- Articles Grid -->
            <section>
                <div class="tool-grid" id="articlesGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem;"></div>
            </section>
        </div>
    `;

    const renderArticlesList = (filter = 'all') => {
        const grid = container.querySelector('#articlesGrid');
        grid.innerHTML = '';

        const filtered = filter === 'all' ? articles : articles.filter(a => a.category === filter);

        if (filtered.length === 0) {
            grid.innerHTML = '<p style="color:var(--text-secondary); text-align:center; grid-column: 1/-1;">No articles published under this category yet.</p>';
            return;
        }

        filtered.forEach(art => {
            const card = document.createElement('div');
            card.className = 'tool-card';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.justify = 'space-between';
            card.style.animation = 'fadeInUp 0.4s ease forwards';
            
            card.innerHTML = `
                <div class="card-header" style="margin-bottom:0.75rem;">
                    <span class="card-badge category-badge" style="background:var(--primary-light); color:var(--primary-color);">${art.type.toUpperCase()}</span>
                    <span style="font-size:0.8rem; color:var(--text-secondary);">${art.readTime}</span>
                </div>
                <div class="card-body" style="flex-grow:1; text-align:left;">
                    <h3 style="font-size:1.25rem; line-height:1.4; color:var(--text-primary); margin-bottom:0.5rem; font-weight:700;">${art.title}</h3>
                    <p style="font-size:0.9rem; line-height:1.5; color:var(--text-secondary);">${art.summary}</p>
                </div>
                <div class="card-footer" style="margin-top:1.5rem;">
                    <a href="/guides/${art.slug}" class="tool-button" style="text-decoration:none; display:block; text-align:center;">
                        <span>Read Full Guide</span>
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                </div>
            `;

            // Intercept link clicks for clean SPA transitions
            card.querySelector('a').onclick = (e) => {
                e.preventDefault();
                navigate(`/guides/${art.slug}`);
            };

            grid.appendChild(card);
        });
    };

    renderArticlesList();

    // Hook filter button click events
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderArticlesList(btn.getAttribute('data-filter'));
        };
    });
};
