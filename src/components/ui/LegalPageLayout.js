import { LegalConfig } from '../../config/legalConfig.js';

/**
 * Reusable Legal Page Layout Component
 * Standardizes the design for Privacy, Terms, Disclaimer, and Contact pages.
 */
export const LegalPageLayout = ({ title, seoTitle, seoDescription, slug, content }) => {
    // 1. Set SEO Metadata
    document.title = seoTitle || `${title} - ${LegalConfig.siteName}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', seoDescription);
    }
    const metaCanonical = document.querySelector('link[rel="canonical"]');
    if (metaCanonical) {
        metaCanonical.setAttribute('href', `${LegalConfig.siteUrl}/${slug}`);
    }

    // 3. Inject Structured Data (Breadcrumb & WebPage)
    const jsonLdScript = document.getElementById('seo-structured-data');
    if (jsonLdScript) {
        jsonLdScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebPage",
                    "@id": `${LegalConfig.siteUrl}/${slug}`,
                    "url": `${LegalConfig.siteUrl}/${slug}`,
                    "name": seoTitle,
                    "description": seoDescription,
                    "isPartOf": {
                        "@type": "WebSite",
                        "@id": `${LegalConfig.siteUrl}/#website`,
                        "name": LegalConfig.siteName,
                        "url": LegalConfig.siteUrl
                    },
                    "dateModified": new Date(LegalConfig.lastUpdated).toISOString()
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": LegalConfig.siteUrl
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": title,
                            "item": `${LegalConfig.siteUrl}/${slug}`
                        }
                    ]
                }
            ]
        });
    }

    // 4. Build the Template
    return `
        <div class="landing-page-container legal-page-shell" style="max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; animation: fadeIn 0.4s ease-out;">
            
            <!-- Breadcrumbs -->
            <nav class="tool-breadcrumbs" aria-label="Breadcrumb" style="margin-bottom: 2rem;">
                <a href="/"><span>🏠</span> Home</a>
                <span class="breadcrumb-separator">&gt;</span>
                <span style="color: var(--text-primary); font-weight: 600;">${title}</span>
            </nav>

            <!-- Header -->
            <header class="legal-hero" style="margin-bottom: 3rem; text-align: left; padding-bottom: 2rem; border-bottom: 1px solid var(--tool-card-border);">
                <h1 style="font-size: 2.5rem; margin: 0 0 0.5rem 0; font-weight: 800; color: var(--text-primary); line-height: 1.2;">
                    ${title}
                </h1>
                <p style="color: var(--text-secondary); font-size: 0.95rem; margin: 0;">
                    Last Updated: <strong style="color: var(--text-primary);">${LegalConfig.lastUpdated}</strong>
                </p>
            </header>

            <!-- Main Content Container -->
            <div class="legal-content" style="color: var(--text-primary); line-height: 1.7; font-size: 1rem;">
                ${content}
            </div>

            <!-- Internal Legal Links & Back to Home -->
            <footer class="legal-footer" style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--tool-card-border);">
                <h4 style="margin-top: 0; color: var(--text-primary);">Related Information</h4>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem; margin-bottom: 2rem;">
                    <a href="/privacy-policy" style="color: var(--accent-color); text-decoration: none;">Privacy Policy</a>
                    <span style="color: var(--tool-card-border);">|</span>
                    <a href="/terms-of-service" style="color: var(--accent-color); text-decoration: none;">Terms of Service</a>
                    <span style="color: var(--tool-card-border);">|</span>
                    <a href="/disclaimer" style="color: var(--accent-color); text-decoration: none;">Disclaimer</a>
                    <span style="color: var(--tool-card-border);">|</span>
                    <a href="/contact" style="color: var(--accent-color); text-decoration: none;">Contact Us</a>
                </div>
                
                <a href="/" class="primary-btn" style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem;">
                    🏠 Back to Home
                </a>
            </footer>
        </div>
        
        <style>
            .legal-content h2 {
                font-size: 1.5rem;
                margin: 2.5rem 0 1rem 0;
                color: var(--text-primary);
                font-weight: 700;
            }
            .legal-content h3 {
                font-size: 1.2rem;
                margin: 1.5rem 0 0.75rem 0;
                color: var(--text-primary);
                font-weight: 600;
            }
            .legal-content p {
                margin-bottom: 1.25rem;
                color: var(--text-secondary);
            }
            .legal-content ul, .legal-content ol {
                margin-bottom: 1.5rem;
                padding-left: 1.5rem;
                color: var(--text-secondary);
            }
            .legal-content li {
                margin-bottom: 0.5rem;
            }
            .legal-content a {
                color: var(--accent-color);
                text-decoration: underline;
                text-decoration-thickness: 1px;
                text-underline-offset: 3px;
            }
            .legal-content a:hover {
                text-decoration-thickness: 2px;
            }
        </style>
    `;
};
