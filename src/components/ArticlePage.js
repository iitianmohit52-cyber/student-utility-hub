import { tools } from '../tools/toolRegistry.js';
import { articles } from '../tools/articleRegistry.js';
import { navigate } from '../router.js';
import { addRecentlyRead } from '../utils/userStorage.js';
import { SITE_URL } from '../config.js';

export const renderArticlePage = (container, article) => {
    addRecentlyRead(article.slug);
    const catName = article.category.charAt(0).toUpperCase() + article.category.slice(1);
    const relatedTool = tools.find(t => t.id === article.toolId);

    // Set page SEO metadata dynamically
    document.title = `${article.title} | Student Utility Hub Guides`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', article.summary);
    }

    // Inject JSON-LD Schema (Article, BreadcrumbList, FAQPage)
    injectArticleSchemas(article);

    const stepsHTML = article.content.steps.map(step => `<li>${step}</li>`).join('');
    const examplesHTML = article.content.examples.map(ex => `<div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 0.75rem; border-left: 3px solid var(--primary-color);">${ex}</div>`).join('');
    const tipsHTML = article.content.tips.map(tip => `<li>${tip}</li>`).join('');
    const warningsHTML = article.content.warnings.map(warn => `<li>${warn}</li>`).join('');
    const faqsHTML = article.content.faqs.map(faq => `
        <details style="margin-bottom: 1rem; background: var(--surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--tool-card-border);">
            <summary style="font-weight: 600; cursor: pointer; color: var(--text-primary);">${faq.q}</summary>
            <p style="margin-top: 0.75rem; color: var(--text-secondary); line-height: 1.5; font-size: 0.95rem;">${faq.a}</p>
        </details>
    `).join('');

    container.innerHTML = `
        <div class="article-page-container">
            <!-- Breadcrumbs -->
            <nav class="breadcrumb" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem; font-weight: 500;">
                <a href="/">Home</a> &gt; 
                <a href="/blog">Guides & Blog</a> &gt; 
                <span style="color: var(--text-primary);">${article.title}</span>
            </nav>

            <!-- Hero Section -->
            <header class="article-hero" style="margin-bottom: 3rem; text-align: left; border-bottom: 1px solid var(--tool-card-border); padding-bottom: 2rem;">
                <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: center; flex-wrap: wrap;">
                    <span style="background: var(--primary-light); color: var(--primary-color); padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600;">
                        ${catName}
                    </span>
                    <span style="background: var(--surface-elevated); border: 1px solid var(--tool-card-border); color: var(--text-secondary); padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.8rem; font-weight: 500;">
                        📖 ${article.type.toUpperCase()}
                    </span>
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">${article.readTime}</span>
                </div>
                <h1 style="font-size: 2.3rem; margin: 0 0 1rem 0; font-weight: 800; color: var(--text-primary); line-height: 1.3;">
                    ${article.title}
                </h1>
                
                <!-- EEAT Indicator -->
                <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; font-size: 0.85rem; color: var(--text-secondary);">
                    <span>Reviewed by: <strong style="color:var(--text-primary);">${article.reviewedBy}</strong></span>
                    <span>Last Updated: <strong>${article.lastUpdated}</strong></span>
                    <span>Version: <strong>${article.version}</strong></span>
                </div>
            </header>

            <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
                <!-- Main Body -->
                <article class="article-body">
                    <p style="font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 2rem;">
                        ${article.content.intro}
                    </p>

                    <!-- Steps Section -->
                    <section style="margin-bottom: 2.5rem;">
                        <h3 style="font-size: 1.4rem; color: var(--text-primary); margin-bottom: 1rem; border-bottom: 2px solid var(--primary-light); padding-bottom: 0.3rem;">
                            Step-by-Step Instructions
                        </h3>
                        <ol style="line-height: 1.8; color: var(--text-secondary); padding-left: 1.5rem;">
                            ${stepsHTML}
                        </ol>
                    </section>

                    <!-- Callouts -->
                    <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2.5rem;">
                        <!-- Warnings Box -->
                        <div class="callout-box warning-box" style="background: rgba(255, 71, 87, 0.05); border-left: 4px solid var(--danger-color, #ff4757); padding: 1.25rem; border-radius: var(--radius-md);">
                            <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary); font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                <span>⚠️</span> Common Mistakes to Avoid
                            </h4>
                            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                                ${warningsHTML}
                            </ul>
                        </div>

                        <!-- Pro Tips Box -->
                        <div class="callout-box info-box" style="background: rgba(52, 152, 219, 0.05); border-left: 4px solid var(--primary-color); padding: 1.25rem; border-radius: var(--radius-md);">
                            <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary); font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                <span>💡</span> Pro Tips & Best Practices
                            </h4>
                            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                                ${tipsHTML}
                            </ul>
                        </div>
                    </div>

                    <!-- Examples Section -->
                    <section style="margin-bottom: 2.5rem;">
                        <h3 style="font-size: 1.4rem; color: var(--text-primary); margin-bottom: 1.2rem; border-bottom: 2px solid var(--primary-light); padding-bottom: 0.3rem;">
                            Real-World Scenarios
                        </h3>
                        <div>
                            ${examplesHTML}
                        </div>
                    </section>

                    <!-- Interactive Tool Launcher CTA Card (Cross-linking Engine) -->
                    ${relatedTool ? `
                        <div class="tool-launcher-card" style="background: var(--surface-elevated); border: 2px solid var(--primary-color); border-radius: var(--radius-lg); padding: 2rem; text-align: center; margin: 3rem 0; box-shadow: var(--shadow-sm);">
                            <span style="font-size: 3rem; display: block; margin-bottom: 0.75rem;">${relatedTool.icon}</span>
                            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.4rem; color: var(--text-primary);">Launch the Live ${relatedTool.name}</h3>
                            <p style="margin: 0 0 1.5rem 0; font-size: 1rem; color: var(--text-secondary); max-width: 600px; margin-left: auto; margin-right: auto;">
                                Test your files or calculate rates instantly. Runs 100% locally in your browser sandbox with zero uploads.
                            </p>
                            <a href="/tools/${relatedTool.slug}" class="primary-button" id="launchToolBtn" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; padding: 0.75rem 1.75rem; font-size: 1rem;">
                                Launch ${relatedTool.name} &gt;
                            </a>
                        </div>
                    ` : ''}

                    <!-- FAQ Section -->
                    <section style="margin-bottom: 2.5rem;">
                        <h3 style="font-size: 1.4rem; color: var(--text-primary); margin-bottom: 1.5rem; border-bottom: 2px solid var(--primary-light); padding-bottom: 0.3rem;">
                            Frequently Asked Questions
                        </h3>
                        <div>
                            ${faqsHTML}
                        </div>
                    </section>

                    <!-- References -->
                    ${article.references ? `
                        <section style="margin-bottom: 2.5rem; background: var(--surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--tool-card-border);">
                            <h4 style="margin:0 0 0.5rem 0; color:var(--text-primary); font-size:0.95rem;">References & Standards:</h4>
                            <ul style="margin:0; padding-left:1.2rem; font-size:0.85rem; color:var(--text-secondary);">
                                ${article.references.map(ref => `<li>${ref}</li>`).join('')}
                            </ul>
                        </section>
                    ` : ''}

                    <!-- Related Articles -->
                    <section style="margin-top: 3rem; border-top: 1px solid var(--tool-card-border); padding-top: 2rem;">
                        <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-bottom: 1.5rem;">Related Guides & Articles</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                            ${articles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3).map(a => `
                                <div style="background: var(--surface-card); border: 1px solid var(--tool-card-border); padding: 1.5rem; border-radius: var(--radius-md); display:flex; flex-direction:column; justify-content:space-between;">
                                    <div>
                                        <span style="font-size:0.75rem; background: var(--primary-light); color:var(--primary-color); padding: 0.15rem 0.5rem; border-radius:30px; font-weight:600;">${a.type.toUpperCase()}</span>
                                        <h4 style="margin:0.75rem 0 0.5rem 0; font-size:1.1rem; line-height:1.4; color:var(--text-primary);">${a.title}</h4>
                                        <p style="margin:0 0 1rem 0; font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">${a.summary}</p>
                                    </div>
                                    <a href="/guides/${a.slug}" class="secondary-button" style="text-decoration:none; display:inline-block; font-size:0.85rem; text-align:center;">Read Guide</a>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                </article>
            </div>
        </div>
    `;

    // Hook Launch Tool transition handler
    const launchBtn = container.querySelector('#launchToolBtn');
    if (launchBtn && relatedTool) {
        launchBtn.onclick = (e) => {
            e.preventDefault();
            navigate(`/tools/${relatedTool.slug}`);
        };
    }

    // Hook Related Guides clicks
    container.querySelectorAll('a[href^="/guides/"]').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            navigate(href);
        };
    });
};

const injectArticleSchemas = (article) => {
    const siteUrl = SITE_URL;
    const articleUrl = `${siteUrl}/guides/${article.slug}`;

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
            { "@type": "ListItem", "position": 2, "name": "Guides & Blog", "item": `${siteUrl}/blog` },
            { "@type": "ListItem", "position": 3, "name": article.title, "item": articleUrl }
        ]
    };

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": article.title,
        "description": article.summary,
        "url": articleUrl,
        "dateModified": "2026-08-07",
        "author": {
            "@type": "Organization",
            "name": "Student Utility Hub Editorial & Security Panel"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Student Utility Hub",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
            }
        }
    };

    // FAQ schema mapping
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": article.content.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };

    // Remove old dynamic schemas
    const old = document.querySelectorAll('.dynamic-json-ld');
    old.forEach(s => s.remove());

    [breadcrumbSchema, articleSchema, faqSchema].forEach((schema, idx) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.className = 'dynamic-json-ld';
        script.id = `schema-article-${idx}`;
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    });
};
