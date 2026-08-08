import { loadTool } from '../tools/toolLoader.js';
import { tools } from '../tools/toolRegistry.js';
import { articles } from '../tools/articleRegistry.js';
import { createToolCard } from '../utils/dom.js';
import { withErrorBoundary } from '../utils/errorHandler.js';
import { generateSEOHTML, injectJSONLDSchemas } from './SEOContentEngine.js';
import { navigate } from '../router.js';
import { addRecentlyUsed, isFavorite, toggleFavorite } from '../utils/userStorage.js';
import { Analytics, AnalyticsEvents } from '../analytics/analytics.js';
import { createAdSlot } from '../monetization/AdSlot.js';

export const renderToolPage = async (container, tool) => {
    addRecentlyUsed(tool.id);
    Analytics.tool(AnalyticsEvents.TOOL_VIEW, tool.id);
    
    const catName = tool.category.charAt(0).toUpperCase() + tool.category.slice(1);
    const relatedGuide = articles.find(a => a.toolId === tool.id);
    const initialFav = isFavorite(tool.id);
    
    // Set dynamically the Document Title & Meta tags
    document.title = tool.seoTitle || `${tool.name} - Free Online Tool | Student Utility Hub`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', tool.seoDescription || tool.description);
    }
    
    // Inject Schemas
    injectJSONLDSchemas(tool);

    // Build the page structure using the centralized Tool Page Design System
    container.innerHTML = `
        <div class="landing-page-container tool-page-shell">
            <!-- 1. Breadcrumbs -->
            <nav class="tool-breadcrumbs" aria-label="Breadcrumb">
                <a href="/"><span>🏠</span> Home</a>
                <span class="breadcrumb-separator">&gt;</span>
                <a href="/${tool.category}-tools">${catName} Tools</a>
                <span class="breadcrumb-separator">&gt;</span>
                <span style="color: var(--text-primary); font-weight: 600;">${tool.name}</span>
            </nav>

            <!-- 2. Hero Section -->
            <header class="tool-hero">
                <div class="tool-hero-badge-row">
                    <span class="tool-hero-badge badge-category">${tool.icon} ${catName}</span>
                    <span class="tool-hero-badge badge-popularity">⭐ ${tool.popularity.toUpperCase()}</span>
                    <span class="tool-hero-badge badge-status">⚡ 100% Client-Side Safe</span>
                </div>
                <div class="tool-hero-main">
                    <div class="tool-hero-icon-box">
                        <span>${tool.icon}</span>
                    </div>
                    <div class="tool-hero-header-text">
                        <h1 class="tool-hero-title">${tool.name}</h1>
                        <p class="tool-hero-description">${tool.description}</p>
                    </div>
                </div>
                <div class="tool-hero-actions">
                    <button type="button" class="secondary-button ${initialFav ? 'active' : ''}" id="favToolBtn">
                        ${initialFav ? '❤️ Favorited' : '⭐ Favorite'}
                    </button>
                    <button type="button" class="secondary-button" id="sharePageBtn">🔗 Share Tool</button>
                    <button type="button" class="secondary-button" id="copyLinkBtn">📋 Copy Link</button>
                </div>
            </header>

            <!-- Related Guides Section -->
            ${relatedGuide ? `
                <div class="tool-guide-card">
                    <div class="tool-guide-info">
                        <h4>📖 Step-by-Step Guide for ${tool.name}</h4>
                        <p>${relatedGuide.summary}</p>
                    </div>
                    <a href="/guides/${relatedGuide.slug}" class="secondary-button" id="viewGuideBtn" style="text-decoration: none; white-space: nowrap;">Read Guide →</a>
                </div>
            ` : ''}

            <!-- 3. The Live Tool Workspace Card -->
            <div class="live-tool-workspace tool-workspace-card">
                <div class="workspace-header">
                    <h2 class="workspace-title">
                        <span>⚡ ${tool.name} Workspace</span>
                    </h2>
                    <span class="workspace-badge">Browser Execution Engine</span>
                </div>
                <div id="liveToolContainer" class="workspace-content">
                    <div style="text-align:center; padding:3rem 1rem;">
                        <div class="skeleton-icon" style="margin: 0 auto 1rem;"></div>
                        <p style="color:var(--text-secondary);">Initializing interactive tool workspace...</p>
                    </div>
                </div>
            </div>

            <!-- 4. Dynamic SEO Guide Content & Trust Signals -->
            <div id="seoContentContainer"></div>

            <!-- Centralized Non-Intrusive Ad Placement (Below Workspace & Guide) -->
            <div id="toolAdPlacement"></div>

            <!-- 5. Related Tools Grid -->
            <section class="related-tools-section" style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--tool-card-border);">
                <h3 style="font-size: 1.5rem; margin-bottom: 2rem; color: var(--text-primary); font-weight: 700;">Related ${catName} Tools</h3>
                <div class="tool-grid" id="relatedToolsGrid"></div>
            </section>
        </div>
    `;

    // Append Centralized AdSlot
    const adContainer = container.querySelector('#toolAdPlacement');
    if (adContainer) {
        adContainer.appendChild(createAdSlot('toolPage'));
    }

    // Hero Action Handlers
    const favBtn = container.querySelector('#favToolBtn');
    const shareBtn = container.querySelector('#sharePageBtn');
    const copyBtn = container.querySelector('#copyLinkBtn');
    const viewGuideBtn = container.querySelector('#viewGuideBtn');

    if (favBtn) {
        favBtn.onclick = () => {
            const isFavNow = toggleFavorite(tool.id);
            if (isFavNow) {
                favBtn.classList.add('active');
                favBtn.innerHTML = '❤️ Favorited';
            } else {
                favBtn.classList.remove('active');
                favBtn.innerHTML = '⭐ Favorite';
            }
        };
    }
    
    if (viewGuideBtn && relatedGuide) {
        viewGuideBtn.onclick = (e) => {
            e.preventDefault();
            Analytics.event(AnalyticsEvents.GUIDE_CTA_CLICK, { guide_slug: relatedGuide.slug });
            navigate(`/guides/${relatedGuide.slug}`);
        };
    }
    
    const pageUrl = window.location.href;

    if (shareBtn) {
        shareBtn.onclick = () => {
            Analytics.event(AnalyticsEvents.SHARE, { tool_id: tool.id });
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    text: tool.description,
                    url: pageUrl
                }).catch(console.error);
            } else {
                navigator.clipboard.writeText(pageUrl);
                const orig = shareBtn.textContent;
                shareBtn.textContent = 'Copied Link!';
                setTimeout(() => shareBtn.textContent = orig, 2000);
            }
        };
    }

    if (copyBtn) {
        copyBtn.onclick = () => {
            Analytics.event(AnalyticsEvents.COPY, { tool_id: tool.id });
            navigator.clipboard.writeText(pageUrl);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = originalText, 2000);
        };
    }

    // Load and run the live tool logic into liveToolContainer
    const liveToolContainer = container.querySelector('#liveToolContainer');
    const toolFunction = await loadTool(tool.id);

    if (toolFunction) {
        liveToolContainer.innerHTML = '';
        withErrorBoundary(() => toolFunction(liveToolContainer), liveToolContainer, tool.id);
    } else {
        liveToolContainer.innerHTML = '<p style="color:var(--danger-color,#ef4444); text-align:center; padding: 2rem;">Failed to load live tool module. Please try reloading the page.</p>';
    }

    // Populate SEO Content
    const seoContentContainer = container.querySelector('#seoContentContainer');
    seoContentContainer.innerHTML = generateSEOHTML(tool);

    // Populate Related Tools (Smart Internal Linking 3.0: prioritize category tools, then complementary tools)
    const relatedGrid = container.querySelector('#relatedToolsGrid');
    let relatedList = tools.filter(t => t.category === tool.category && t.id !== tool.id);
    if (relatedList.length < 6) {
        const otherTools = tools.filter(t => t.category !== tool.category && t.id !== tool.id);
        relatedList = [...relatedList, ...otherTools];
    }
    relatedList = relatedList.slice(0, 6);

    relatedList.forEach(rt => {
        const card = createToolCard(rt);
        const btn = card.querySelector('.tool-button');
        if (btn) {
            btn.onclick = (e) => {
                e.preventDefault();
                Analytics.event(AnalyticsEvents.RELATED_TOOL_CLICK, { current_tool: tool.id, clicked_tool: rt.id });
                navigate(`/tools/${rt.slug}`);
            };
        }
        relatedGrid.appendChild(card);
    });
};
