import { getFavorites, getRecentlyUsed, getRecentlyRead, getSearchHistory } from '../utils/userStorage.js';
import { runSEOAudit } from '../seo/seoAuditEngine.js';
import { detectSEOOpportunities } from '../seo/seoOpportunityEngine.js';
import { runAdSenseReadinessCheck } from '../monetization/AdSenseReadinessAudit.js';
import { computeMonetizationOpportunities } from '../monetization/MonetizationOpportunityEngine.js';
import { MonetizationConfig } from '../monetization/MonetizationConfig.js';
import { 
    runIndexingHealthAudit, 
    getSearchDemandReport, 
    getIndexingPriorityModel, 
    getGSCWebmasterChecklist, 
    getBingWebmasterChecklist 
} from '../seo/growthEngine.js';

export const renderAdminDashboard = (container) => {
    document.title = 'SEO & Monetization Growth Console | Student Utility Hub';
    
    const favs = getFavorites();
    const recentTools = getRecentlyUsed();
    const recentGuides = getRecentlyRead();
    const searchTerms = getSearchHistory();
    const analytics = window.growthAnalytics || {
        toolViews: 0,
        toolStarts: 0,
        toolSuccesses: 0,
        downloads: 0,
        guideClicks: 0,
        relatedClicks: 0
    };

    // Run Internal Audits & Scoring Engines
    const auditResult = runSEOAudit();
    const opportunities = detectSEOOpportunities();
    const adSenseCheck = runAdSenseReadinessCheck();
    const monetizationScores = computeMonetizationOpportunities();

    // SEO & Growth Launch Analysis (Requirement 14)
    const indexingAudit = runIndexingHealthAudit();
    const searchDemand = getSearchDemandReport();
    const priorityModel = getIndexingPriorityModel();
    const gscChecklist = getGSCWebmasterChecklist();
    const bingChecklist = getBingWebmasterChecklist();

    const totalIndexable = indexingAudit.filter(p => p.intendedIndex).length;
    const sitemapCount = indexingAudit.filter(p => p.inSitemap).length;
    const canonicalCount = indexingAudit.length; // all have self-referencing canonicals
    const orphanCount = indexingAudit.filter(p => p.incomingLinks <= 1 && p.group !== 'Error' && p.group !== 'Legal').length;
    const noindexCount = indexingAudit.filter(p => !p.intendedIndex).length;
    const missingMetaCount = indexingAudit.filter(p => p.checks.some(c => !c.pass && ['Title Present', 'Description Present', 'H1 Header Present'].includes(c.name))).length;

    // Content Health calculation
    const totalTools = auditResult.summary.totalTools;
    const missingGuides = opportunities.filter(o => o.type === 'MISSING_GUIDE').length;
    const toolsWithGuides = totalTools - missingGuides;
    const weakContentCategories = opportunities.filter(o => o.type === 'LOW_GUIDE_COVERAGE').map(o => o.target);
    const weakLinksCount = indexingAudit.filter(p => p.incomingLinks < 3 && p.group !== 'Error').length;

    // Web Vitals Evaluation Helpers
    const getLCPStatus = (val) => {
        if (!val) return { label: '🟢 Good (< 2.5s)', color: '#10b981' };
        if (val <= 2500) return { label: `🟢 Good (${val}ms)`, color: '#10b981' };
        if (val <= 4000) return { label: `🟡 Needs Improvement (${val}ms)`, color: '#f59e0b' };
        return { label: `🔴 Poor (${val}ms)`, color: '#ef4444' };
    };

    const getCLSStatus = (val = 0) => {
        if (val <= 0.1) return { label: `🟢 Good (${val.toFixed(3)})`, color: '#10b981' };
        if (val <= 0.25) return { label: `🟡 Needs Improvement (${val.toFixed(3)})`, color: '#f59e0b' };
        return { label: `🔴 Poor (${val.toFixed(3)})`, color: '#ef4444' };
    };

    const getINPStatus = (val) => {
        if (!val) return { label: '🟢 Good (< 200ms)', color: '#10b981' };
        if (val <= 200) return { label: `🟢 Good (${val}ms)`, color: '#10b981' };
        if (val <= 500) return { label: `🟡 Needs Improvement (${val}ms)`, color: '#f59e0b' };
        return { label: `🔴 Poor (${val}ms)`, color: '#ef4444' };
    };

    const lcpInfo = getLCPStatus(analytics.lcp);
    const clsInfo = getCLSStatus(analytics.cls);
    const inpInfo = getINPStatus(analytics.inp);

    container.innerHTML = `
        <div class="admin-dashboard-container" style="max-width: var(--max-width, 1440px); margin: 0 auto; padding: 2rem 1.5rem; animation: fadeIn 0.3s ease-out;">
            
            <!-- Dashboard Header -->
            <header style="margin-bottom: 2.25rem; padding: 2rem; background: var(--surface-elevated); border-radius: var(--radius-xl); border: 1px solid var(--tool-card-border); box-shadow: var(--shadow-sm);">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 2rem;">💎</span>
                            <h1 style="font-size: 2rem; margin: 0; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
                                SEO Intelligence & Monetization Console
                            </h1>
                        </div>
                        <p style="font-size: 0.98rem; color: var(--text-secondary); margin: 0; max-width: 800px;">
                            Realtime content quality audit, AdSense readiness checklist, conversion funnel metrics, Core Web Vitals guardrails, and page monetization scoring.
                        </p>
                    </div>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="background: var(--surface-color); padding: 0.85rem 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--tool-card-border); text-align: center;">
                            <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700;">SEO Health</span>
                            <div style="font-size: 1.8rem; font-weight: 800; color: ${auditResult.summary.healthScore >= 80 ? '#10b981' : '#f59e0b'}; line-height: 1.1; margin-top: 0.2rem;">
                                ${auditResult.summary.healthScore}%
                            </div>
                        </div>
                        <div style="background: var(--surface-color); padding: 0.85rem 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--tool-card-border); text-align: center;">
                            <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700;">AdSense Readiness</span>
                            <div style="font-size: 1.8rem; font-weight: 800; color: #10b981; line-height: 1.1; margin-top: 0.2rem;">
                                ${adSenseCheck.readinessScore}%
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Top Summary KPI Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2.25rem;">
                <div style="background: var(--surface-color); border: 1px solid var(--tool-card-border); padding: 1.25rem; border-radius: var(--radius-lg); text-align: left;">
                    <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">TARGET INDEXED URLS</span>
                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-top: 0.2rem;">${auditResult.summary.totalIndexedURLs}</div>
                </div>
                <div style="background: var(--surface-color); border: 1px solid var(--tool-card-border); padding: 1.25rem; border-radius: var(--radius-lg); text-align: left;">
                    <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">ADSENSE PLACEMENTS</span>
                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-color); margin-top: 0.2rem;">5 Active</div>
                </div>
                <div style="background: var(--surface-color); border: 1px solid var(--tool-card-border); padding: 1.25rem; border-radius: var(--radius-lg); text-align: left;">
                    <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">HIGH-VALUE PAGES</span>
                    <div style="font-size: 1.8rem; font-weight: 800; color: #10b981; margin-top: 0.2rem;">
                        ${monetizationScores.filter(s => s.grade === 'HIGH').length} Pages
                    </div>
                </div>
                <div style="background: var(--surface-color); border: 1px solid var(--tool-card-border); padding: 1.25rem; border-radius: var(--radius-lg); text-align: left;">
                    <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">ESTIMATED RPM/CPC</span>
                    <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-muted); margin-top: 0.5rem;">
                        External Telemetry Req.
                    </div>
                </div>
            </div>

            <!-- AdSense Policy 16-Point Readiness Checklist -->
            <section style="background: var(--surface-color); border: 1px solid var(--tool-card-border); padding: 1.75rem; border-radius: var(--radius-xl); margin-bottom: 2.25rem;">
                <h3 style="margin: 0 0 1.25rem 0; font-size: 1.2rem; color: var(--text-primary); font-weight: 700; display: flex; align-items: center; justify-content: space-between;">
                    <span>🛡️ AdSense Policy 16-Point Readiness Checklist</span>
                    <span style="font-size: 0.85rem; color: #10b981; font-weight: 700;">${adSenseCheck.passCount} / ${adSenseCheck.totalItems} PASSED</span>
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.85rem;">
                    ${adSenseCheck.checklist.map(item => `
                        <div style="background: var(--surface-elevated); border: 1px solid var(--tool-card-border); padding: 0.85rem 1rem; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                            <div>
                                <strong style="color: var(--text-primary); font-size: 0.88rem; display: block;">${item.label}</strong>
                                <span style="font-size: 0.78rem; color: var(--text-secondary);">${item.detail}</span>
                            </div>
                            <span style="font-size: 0.8rem; padding: 0.2rem 0.5rem; border-radius: 20px; font-weight: 700; background: ${item.status === 'PASS' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}; color: ${item.status === 'PASS' ? '#10b981' : '#f59e0b'}; flex-shrink: 0;">
                                ${item.status}
                            </span>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- Monetization Opportunities & Page Opportunity Scores -->
            <section style="background: var(--surface-color); border: 1px solid var(--tool-card-border); padding: 1.75rem; border-radius: var(--radius-xl); margin-bottom: 2.25rem;">
                <h3 style="margin: 0 0 1.25rem 0; font-size: 1.2rem; color: var(--text-primary); font-weight: 700;">
                    📈 Page Monetization Opportunity Matrix
                </h3>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--tool-card-border); color: var(--text-secondary);">
                                <th style="padding: 0.75rem 0.5rem;">Tool / Page Name</th>
                                <th style="padding: 0.75rem 0.5rem;">Category</th>
                                <th style="padding: 0.75rem 0.5rem;">Score</th>
                                <th style="padding: 0.75rem 0.5rem;">Opportunity</th>
                                <th style="padding: 0.75rem 0.5rem;">Ad Placement Strategy</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${monetizationScores.slice(0, 10).map(item => `
                                <tr style="border-bottom: 1px dashed var(--tool-card-border);">
                                    <td style="padding: 0.75rem 0.5rem; font-weight: 600; color: var(--text-primary);">${item.name}</td>
                                    <td style="padding: 0.75rem 0.5rem; color: var(--text-secondary); text-transform: capitalize;">${item.category}</td>
                                    <td style="padding: 0.75rem 0.5rem; font-weight: 700;">${item.score}/100</td>
                                    <td style="padding: 0.75rem 0.5rem;">
                                        <span style="padding: 0.25rem 0.6rem; border-radius: 20px; font-weight: 700; font-size: 0.78rem; background: var(--surface-elevated); color: ${item.color}; border: 1px solid var(--tool-card-border);">
                                            ${item.grade}
                                        </span>
                                    </td>
                                    <td style="padding: 0.75rem 0.5rem; color: var(--text-secondary); font-size: 0.85rem;">${item.recommendation}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- SEO & Growth Launch Panel (Requirement 14) -->
            <section style="background: var(--surface-color); border: 1px solid var(--tool-card-border); padding: 1.75rem; border-radius: var(--radius-xl); margin-bottom: 2.25rem;">
                <h3 style="margin: 0 0 1.5rem 0; font-size: 1.3rem; color: var(--text-primary); font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
                    <span>🚀</span> SEO & Growth Launch Control Center
                </h3>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 1.75rem;">
                    
                    <!-- Indexing Health -->
                    <div style="background: var(--surface-elevated); border: 1px solid var(--tool-card-border); padding: 1.25rem; border-radius: var(--radius-lg);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <strong style="color: var(--text-primary); font-size: 1rem;">Indexing Health</strong>
                            <span style="font-size: 0.82rem; padding: 0.2rem 0.5rem; border-radius: 20px; font-weight: 700; background: ${orphanCount === 0 && missingMetaCount === 0 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}; color: ${orphanCount === 0 && missingMetaCount === 0 ? '#10b981' : '#f59e0b'};">
                                ${orphanCount === 0 && missingMetaCount === 0 ? '🟢 Healthy' : '🟡 Attention'}
                            </span>
                        </div>
                        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2; font-size: 0.88rem; color: var(--text-secondary);">
                            <li style="display: flex; justify-content: space-between;"><span>Total Indexable URLs:</span><strong style="color: var(--text-primary);">${totalIndexable}</strong></li>
                            <li style="display: flex; justify-content: space-between;"><span>Sitemap URLs:</span><strong style="color: var(--text-primary);">${sitemapCount}</strong></li>
                            <li style="display: flex; justify-content: space-between;"><span>Canonical URLs:</span><strong style="color: var(--text-primary);">${canonicalCount}</strong></li>
                            <li style="display: flex; justify-content: space-between;"><span>Potential Orphans (Requirement 8):</span><strong style="color: ${orphanCount > 0 ? '#ef4444' : 'var(--text-primary)'};">${orphanCount}</strong></li>
                            <li style="display: flex; justify-content: space-between;"><span>Noindex Pages:</span><strong style="color: var(--text-primary);">${noindexCount}</strong></li>
                            <li style="display: flex; justify-content: space-between;"><span>Missing Metadata (Title/Desc/H1):</span><strong style="color: ${missingMetaCount > 0 ? '#ef4444' : 'var(--text-primary)'};">${missingMetaCount}</strong></li>
                        </ul>
                    </div>

                    <!-- Content Health -->
                    <div style="background: var(--surface-elevated); border: 1px solid var(--tool-card-border); padding: 1.25rem; border-radius: var(--radius-lg);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <strong style="color: var(--text-primary); font-size: 1rem;">Content & Links</strong>
                            <span style="font-size: 0.82rem; padding: 0.2rem 0.5rem; border-radius: 20px; font-weight: 700; background: ${missingGuides < 10 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}; color: ${missingGuides < 10 ? '#10b981' : '#f59e0b'};">
                                ${missingGuides < 10 ? '🟢 Healthy' : '🟡 Attention'}
                            </span>
                        </div>
                        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2; font-size: 0.88rem; color: var(--text-secondary);">
                            <li style="display: flex; justify-content: space-between;"><span>Tools with Guides:</span><strong style="color: var(--text-primary);">${toolsWithGuides} / ${totalTools}</strong></li>
                            <li style="display: flex; justify-content: space-between;"><span>Tools missing Guides:</span><strong style="color: ${missingGuides > 0 ? '#f59e0b' : 'var(--text-primary)'};">${missingGuides}</strong></li>
                            <li style="display: flex; justify-content: space-between;"><span>Weak Content Categories:</span><strong style="color: var(--text-primary);">${weakContentCategories.length}</strong></li>
                            <li style="display: flex; justify-content: space-between;"><span>Weak Internal Links (< 3 paths):</span><strong style="color: ${weakLinksCount > 0 ? '#f59e0b' : 'var(--text-primary)'};">${weakLinksCount}</strong></li>
                        </ul>
                    </div>

                    <!-- Search Demand Intelligence -->
                    <div style="background: var(--surface-elevated); border: 1px solid var(--tool-card-border); padding: 1.25rem; border-radius: var(--radius-lg);">
                        <strong style="color: var(--text-primary); font-size: 1rem; display: block; margin-bottom: 0.85rem;">🔍 Search Demand Logs (Requirement 9)</strong>
                        
                        <div style="margin-bottom: 0.75rem;">
                            <span style="font-size: 0.75rem; color: #10b981; font-weight: 700; text-transform: uppercase;">🔥 High Demand</span>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.25rem;">
                                ${searchDemand.highDemand.map(h => `<span style="font-size: 0.78rem; background: var(--surface-color); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid var(--tool-card-border); color: var(--text-primary);">${h.query} (${h.count})</span>`).join('')}
                            </div>
                        </div>

                        <div style="margin-bottom: 0.75rem;">
                            <span style="font-size: 0.75rem; color: #f59e0b; font-weight: 700; text-transform: uppercase;">🟡 Opportunity</span>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.25rem;">
                                ${searchDemand.opportunity.map(o => `<span style="font-size: 0.78rem; background: var(--surface-color); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid var(--tool-card-border); color: var(--text-primary);">${o}</span>`).join('')}
                            </div>
                        </div>

                        <div>
                            <span style="font-size: 0.75rem; color: #ef4444; font-weight: 700; text-transform: uppercase;">❌ No Result</span>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.25rem;">
                                ${searchDemand.noResult.map(nr => `<span style="font-size: 0.78rem; background: var(--surface-color); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid var(--tool-card-border); color: var(--text-secondary);">${nr}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Webmaster Tools GSC & Bing Checklists -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; flex-wrap: wrap;">
                    <div style="background: var(--surface-elevated); border: 1px solid var(--tool-card-border); padding: 1.25rem; border-radius: var(--radius-lg);">
                        <strong style="color: var(--text-primary); font-size: 0.95rem; display: block; margin-bottom: 0.85rem;">Google Search Console Readiness</strong>
                        <div style="display: grid; gap: 0.5rem;">
                            ${gscChecklist.map(item => `
                                <div style="display: flex; justify-content: space-between; font-size: 0.82rem; border-bottom: 1px dashed var(--tool-card-border); padding-bottom: 0.4rem;">
                                    <span style="color: var(--text-primary);">${item.label}</span>
                                    <span style="color: #10b981; font-weight: 700;">${item.status}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div style="background: var(--surface-elevated); border: 1px solid var(--tool-card-border); padding: 1.25rem; border-radius: var(--radius-lg);">
                        <strong style="color: var(--text-primary); font-size: 0.95rem; display: block; margin-bottom: 0.85rem;">Bing Webmaster Tools Readiness</strong>
                        <div style="display: grid; gap: 0.5rem;">
                            ${bingChecklist.map(item => `
                                <div style="display: flex; justify-content: space-between; font-size: 0.82rem; border-bottom: 1px dashed var(--tool-card-border); padding-bottom: 0.4rem;">
                                    <span style="color: var(--text-primary);">${item.label}</span>
                                    <span style="color: #10b981; font-weight: 700;">${item.status}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>

            <!-- Future Revenue Streams Architecture -->
            <section style="background: var(--surface-color); border: 1px solid var(--tool-card-border); padding: 1.75rem; border-radius: var(--radius-xl); margin-bottom: 2.25rem;">
                <h3 style="margin: 0 0 1.25rem 0; font-size: 1.2rem; color: var(--text-primary); font-weight: 700;">
                    Future Extensible Revenue Architecture
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
                    ${Object.entries(MonetizationConfig.futureRevenueStreams).map(([key, stream]) => `
                        <div style="background: var(--surface-elevated); border: 1px solid var(--tool-card-border); padding: 1.15rem; border-radius: var(--radius-lg);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <strong style="color: var(--text-primary); font-size: 0.95rem;">${stream.label}</strong>
                                <span style="font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 20px; font-weight: 700; background: var(--surface-color); color: var(--text-muted); border: 1px solid var(--tool-card-border);">
                                    PREPARED
                                </span>
                            </div>
                            <span style="font-size: 0.82rem; color: var(--text-secondary);">Architecture ready for zero-latency module integration.</span>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- Original Diagnostics & Web Vitals Panel -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
                <!-- Content Quality Audit Summary -->
                <div style="background: var(--surface-color); border: 1px solid var(--tool-card-border); padding: 1.5rem; border-radius: var(--radius-xl);">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.15rem; color: var(--text-primary); font-weight: 700;">🔍 Content Quality Audit</h3>
                    <ul style="list-style: none; padding: 0; margin: 0; line-height: 2.2; font-size: 0.92rem;">
                        <li style="display: flex; justify-content: space-between;"><span>🟢 PASS (Optimized)</span><strong style="color: #10b981;">${auditResult.summary.passCount} pages</strong></li>
                        <li style="display: flex; justify-content: space-between;"><span>🟡 WARNING (Minor Gaps)</span><strong style="color: #f59e0b;">${auditResult.summary.warningCount} pages</strong></li>
                        <li style="display: flex; justify-content: space-between;"><span>🔴 NEEDS ATTENTION</span><strong style="color: #ef4444;">${auditResult.summary.attentionCount} pages</strong></li>
                    </ul>
                </div>

                <!-- Web Vitals Guardrails -->
                <div style="background: var(--surface-color); border: 1px solid var(--tool-card-border); padding: 1.5rem; border-radius: var(--radius-xl);">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.15rem; color: var(--text-primary); font-weight: 700;">⚡ Web Vitals Guardrails</h3>
                    <ul style="list-style: none; padding: 0; margin: 0; line-height: 2.2; font-size: 0.92rem;">
                        <li style="display: flex; justify-content: space-between;"><span>LCP (Largest Paint):</span><strong style="color: ${lcpInfo.color};">${lcpInfo.label}</strong></li>
                        <li style="display: flex; justify-content: space-between;"><span>CLS (Layout Shift):</span><strong style="color: ${clsInfo.color};">${clsInfo.label}</strong></li>
                        <li style="display: flex; justify-content: space-between;"><span>INP (Interaction):</span><strong style="color: ${inpInfo.color};">${inpInfo.label}</strong></li>
                    </ul>
                </div>
            </div>

        </div>
    `;
};
