import { getFavorites, getRecentlyUsed, getRecentlyRead, getSearchHistory } from '../utils/userStorage.js';
import { tools } from '../tools/toolRegistry.js';

export const renderAdminDashboard = (container) => {
    document.title = 'Internal Growth Analytics | Student Utility Hub';
    
    const favs = getFavorites();
    const recentTools = getRecentlyUsed();
    const recentGuides = getRecentlyRead();
    const searchTerms = getSearchHistory();
    const analytics = window.growthAnalytics || {};

    container.innerHTML = `
        <div class="admin-dashboard" style="max-width: var(--max-width); margin: 0 auto; padding: 2rem 1.5rem; animation: fadeIn 0.3s ease-out;">
            <!-- Header -->
            <header style="margin-bottom: 2.5rem; text-align: left; padding: 2rem; background: var(--surface-elevated); border-radius: var(--radius-lg); border: 1px solid var(--tool-card-border);">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📊</div>
                <h1 style="font-size: 2rem; margin: 0 0 0.5rem 0; font-weight: 800; color: var(--text-primary);">Internal Growth & Diagnostics Dashboard</h1>
                <p style="font-size: 0.95rem; color: var(--text-secondary); margin: 0;">
                    Developer console mapping client performance, Core Web Vitals, and local usage parameters.
                </p>
            </header>

            <!-- Metrics Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
                
                <!-- Core Web Vitals Card -->
                <div style="background: var(--surface-card); border: 1px solid var(--tool-card-border); padding: 1.5rem; border-radius: var(--radius-lg);">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; color: var(--text-primary); border-bottom: 1px solid var(--tool-card-border); padding-bottom: 0.5rem;">
                        ⚡ Core Web Vitals (Realtime)
                    </h3>
                    <ul style="list-style: none; padding: 0; margin: 0; line-height: 2; font-size: 0.9rem; color: var(--text-secondary);">
                        <li><strong>LCP (Largest Paint):</strong> <span style="color:var(--success-color);">${analytics.lcp ? analytics.lcp + ' ms' : 'Good (< 2.5s)'}</span></li>
                        <li><strong>CLS (Layout Shift):</strong> <span style="color:var(--success-color);">${(analytics.cls || 0).toFixed(3)}</span></li>
                        <li><strong>INP (Interaction):</strong> <span style="color:var(--success-color);">${analytics.inp ? analytics.inp + ' ms' : 'Good (< 200ms)'}</span></li>
                        <li><strong>Load Time:</strong> <span>${analytics.navigationTime ? analytics.navigationTime + ' ms' : 'Ready'}</span></li>
                    </ul>
                </div>

                <!-- Usage Stats Card -->
                <div style="background: var(--surface-card); border: 1px solid var(--tool-card-border); padding: 1.5rem; border-radius: var(--radius-lg);">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; color: var(--text-primary); border-bottom: 1px solid var(--tool-card-border); padding-bottom: 0.5rem;">
                        ⭐ Client Storage Retention
                    </h3>
                    <ul style="list-style: none; padding: 0; margin: 0; line-height: 2; font-size: 0.9rem; color: var(--text-secondary);">
                        <li><strong>Favorited Tools:</strong> <strong style="color:var(--primary-color);">${favs.length} items</strong></li>
                        <li><strong>Recently Used Tools:</strong> <strong>${recentTools.length} items</strong></li>
                        <li><strong>Recently Read Guides:</strong> <strong>${recentGuides.length} items</strong></li>
                    </ul>
                </div>
            </div>

            <!-- Recent Internal Search Queries -->
            <section style="background: var(--surface-card); border: 1px solid var(--tool-card-border); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 2.5rem;">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; color: var(--text-primary); border-bottom: 1px solid var(--tool-card-border); padding-bottom: 0.5rem;">
                    🔍 Recent Internal Search Terms
                </h3>
                ${searchTerms.length > 0 ? `
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${searchTerms.map(term => `<span style="background: var(--surface-elevated); border: 1px solid var(--tool-card-border); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; color: var(--text-secondary);">${term}</span>`).join('')}
                    </div>
                ` : '<p style="color:var(--text-secondary); margin:0; font-size:0.9rem;">No search queries recorded in this session yet.</p>'}
            </section>
        </div>
    `;
};
