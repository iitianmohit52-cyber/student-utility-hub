import { loadTool } from '../tools/toolLoader.js';
import { tools } from '../tools/toolRegistry.js';
import { articles } from '../tools/articleRegistry.js';
import { createToolCard } from '../utils/dom.js';
import { withErrorBoundary } from '../utils/errorHandler.js';
import { generateSEOHTML, injectJSONLDSchemas } from './SEOContentEngine.js';
import { navigate } from '../router.js';
import { addRecentlyUsed } from '../utils/userStorage.js';

export const renderToolPage = async (container, tool) => {
    addRecentlyUsed(tool.id);
    const catName = tool.category.charAt(0).toUpperCase() + tool.category.slice(1);
    const relatedGuide = articles.find(a => a.toolId === tool.id);
    
    // Set dynamically the Document Title & Meta tags
    document.title = tool.seoTitle || `${tool.name} - Free Online Tool | Student Utility Hub`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', tool.seoDescription || tool.description);
    }
    
    // Inject Schemas
    injectJSONLDSchemas(tool);

    // Build the page structure
    container.innerHTML = `
        <div class="landing-page-container" style="max-width: var(--max-width); margin: 0 auto; padding: 2rem 1.5rem; animation: fadeIn 0.3s ease-out;">
            <!-- 1. Breadcrumbs -->
            <nav class="breadcrumb" aria-label="Breadcrumb" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem; font-weight: 500;">
                <a href="/">Home</a> &gt; 
                <a href="/${tool.category}-tools">${catName} Tools</a> &gt; 
                <span style="color: var(--text-primary);">${tool.name}</span>
            </nav>

            <!-- 2. Hero Section -->
            <header class="tool-hero" style="margin-bottom: 2.5rem; text-align: left;">
                <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: center; flex-wrap: wrap;">
                    <span class="category-badge" style="background: var(--primary-light); color: var(--primary-color); padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600;">
                        ${catName}
                    </span>
                    <span class="popularity-badge" style="background: var(--surface-elevated); border: 1px solid var(--tool-card-border); color: var(--text-secondary); padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.8rem; font-weight: 500;">
                        ⭐ ${tool.popularity.toUpperCase()}
                    </span>
                </div>
                <h1 style="font-size: 2.2rem; margin: 0 0 0.75rem 0; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 0.75rem;">
                    <span>${tool.icon}</span> ${tool.name}
                </h1>
                <p style="font-size: 1.1rem; color: var(--text-secondary); margin: 0 0 1.5rem 0; max-width: 800px; line-height: 1.5;">
                    ${tool.description}
                </p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button type="button" class="primary-button" id="sharePageBtn" style="gap: 0.5rem;">🔗 Share Tool</button>
                    <button type="button" class="secondary-button" id="copyLinkBtn">Copy Link</button>
                </div>
            </header>

            <!-- Related Guides Section -->
            ${relatedGuide ? `
                <div class="related-guide-notice" style="background: rgba(52, 152, 219, 0.05); border: 1px solid var(--tool-card-border); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 2.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                    <div style="text-align: left;">
                        <h4 style="margin: 0 0 0.25rem 0; color: var(--text-primary); font-size: 1.05rem;">📖 Need help using this tool?</h4>
                        <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">${relatedGuide.summary}</p>
                    </div>
                    <a href="/guides/${relatedGuide.slug}" class="secondary-button" id="viewGuideBtn" style="text-decoration: none; padding: 0.5rem 1rem; font-size: 0.85rem; white-space: nowrap;">Read Complete Guide</a>
                </div>
            ` : ''}

            <!-- 3. The Live Tool Workspace -->
            <div id="liveToolContainer" class="live-tool-workspace" style="background: var(--surface-card); border: 1px solid var(--tool-card-border); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-sm); margin-bottom: 3rem;">
                <div style="text-align:center; padding:2rem;"><div class="skeleton-icon" style="margin: 0 auto;"></div><p style="margin-top:1rem; color:var(--text-secondary);">Loading Live Tool...</p></div>
            </div>

            <!-- 4. Dynamic SEO Guide Content -->
            <div id="seoContentContainer"></div>

            <!-- 5. Related Tools Grid -->
            <section class="related-tools-section" style="margin-top: 4rem; padding-top: 3rem; border-top: 1px solid var(--tool-card-border);">
                <h3 style="font-size: 1.5rem; margin-bottom: 2rem; color: var(--text-primary);">Related ${catName} Tools</h3>
                <div class="tool-grid" id="relatedToolsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(285px, 1fr)); gap: 1.5rem;"></div>
            </section>
        </div>
    `;

    // Share & Copy buttons
    const shareBtn = container.querySelector('#sharePageBtn');
    const copyBtn = container.querySelector('#copyLinkBtn');
    const viewGuideBtn = container.querySelector('#viewGuideBtn');
    
    if (viewGuideBtn && relatedGuide) {
        viewGuideBtn.onclick = (e) => {
            e.preventDefault();
            navigate(`/guides/${relatedGuide.slug}`);
        };
    }
    
    const pageUrl = window.location.href;

    shareBtn.onclick = () => {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: tool.description,
                url: pageUrl
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(pageUrl);
            alert('Link copied to clipboard!');
        }
    };

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(pageUrl);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = originalText, 2000);
    };

    // Load and run the live tool logic
    const liveToolContainer = container.querySelector('#liveToolContainer');
    const toolFunction = await loadTool(tool.id);

    if (toolFunction) {
        liveToolContainer.innerHTML = '';
        withErrorBoundary(() => toolFunction(liveToolContainer), liveToolContainer, tool.id);
    } else {
        liveToolContainer.innerHTML = '<p style="color:var(--danger); text-align:center;">Failed to load live tool module. Try reloading.</p>';
    }

    // Populate SEO Content
    const seoContentContainer = container.querySelector('#seoContentContainer');
    seoContentContainer.innerHTML = generateSEOHTML(tool);

    // Populate Related Tools
    const relatedGrid = container.querySelector('#relatedToolsGrid');
    const relatedList = tools
        .filter(t => t.category === tool.category && t.id !== tool.id)
        .slice(0, 6);

    relatedList.forEach(rt => {
        const card = createToolCard(rt);
        // Intercept clicks for SPA transition
        const btn = card.querySelector('.tool-button');
        if (btn) {
            btn.onclick = (e) => {
                e.preventDefault();
                navigate(`/tools/${rt.slug}`);
            };
        }
        relatedGrid.appendChild(card);
    });
};
