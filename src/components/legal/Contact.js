import { LegalConfig } from '../../config/legalConfig.js';
import { Analytics, AnalyticsEvents } from '../../analytics/analytics.js';

export const renderContact = (container) => {
    // 1. Fire Analytics
    Analytics.event(AnalyticsEvents.PAGE_VIEW, { page_path: '/contact' });

    // 2. Set SEO Metadata
    document.title = 'Contact Us - Student Utility Hub';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', 'Contact Student Utility Hub for support, bug reports, feedback, tool suggestions, and business inquiries. Connect with Inventor Mohit.');
    }
    const metaCanonical = document.querySelector('link[rel="canonical"]');
    if (metaCanonical) {
        metaCanonical.setAttribute('href', `${LegalConfig.siteUrl}/contact`);
    }

    // 3. Inject Structured Data (WebPage)
    const jsonLdScript = document.getElementById('seo-structured-data');
    if (jsonLdScript) {
        jsonLdScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${LegalConfig.siteUrl}/contact`,
            "url": `${LegalConfig.siteUrl}/contact`,
            "name": "Contact Us - Student Utility Hub",
            "description": "Contact Student Utility Hub for support, bug reports, feedback, tool suggestions, and business inquiries. Connect with Inventor Mohit.",
            "isPartOf": {
                "@type": "WebSite",
                "@id": `${LegalConfig.siteUrl}/#website`,
                "name": LegalConfig.siteName,
                "url": LegalConfig.siteUrl
            }
        });
    }

    // 4. Build the Template
    container.innerHTML = `
        <div class="landing-page-container contact-page-wrapper" style="max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; animation: fadeIn 0.4s ease-out;">
            
            <!-- 1. HERO SECTION -->
            <header class="contact-hero" style="text-align: center; margin-bottom: 4rem;">
                <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; color: var(--text-primary); margin-bottom: 1rem; line-height: 1.2;">
                    Contact Student Utility Hub
                </h1>
                <p style="font-size: 1.1rem; color: var(--text-secondary); max-width: 700px; margin: 0 auto; line-height: 1.6;">
                    Have a question, found a bug, or have a suggestion? We'd love to hear from you. 
                    Reach out for support, feedback, bug reports, tool suggestions, and business/partnership inquiries.
                </p>
            </header>

            <!-- 2. CONTACT OPTIONS -->
            <section class="contact-options" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 4rem;">
                
                <article class="contact-card" style="background: var(--surface-color); border: 1px solid var(--tool-card-border); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); transition: transform 0.2s ease, box-shadow 0.2s ease;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">📩</div>
                    <h2 style="font-size: 1.25rem; color: var(--text-primary); margin-top: 0; margin-bottom: 0.75rem;">General Support</h2>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem; line-height: 1.5;">Have a question about Student Utility Hub or one of our tools?</p>
                    <a href="mailto:${LegalConfig.contactEmail}" style="color: var(--accent-color); font-weight: 600; text-decoration: none; word-break: break-all;">${LegalConfig.contactEmail}</a>
                </article>

                <article class="contact-card" style="background: var(--surface-color); border: 1px solid var(--tool-card-border); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); transition: transform 0.2s ease, box-shadow 0.2s ease;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🐛</div>
                    <h2 style="font-size: 1.25rem; color: var(--text-primary); margin-top: 0; margin-bottom: 0.75rem;">Report a Bug</h2>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem; line-height: 1.5;">Found an issue with a calculator, converter, PDF tool, image tool, developer tool, or another feature? Let us know so we can investigate and improve it.</p>
                    <a href="mailto:${LegalConfig.contactEmail}" style="color: var(--accent-color); font-weight: 600; text-decoration: none; word-break: break-all;">${LegalConfig.contactEmail}</a>
                </article>

                <article class="contact-card" style="background: var(--surface-color); border: 1px solid var(--tool-card-border); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); transition: transform 0.2s ease, box-shadow 0.2s ease;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">💡</div>
                    <h2 style="font-size: 1.25rem; color: var(--text-primary); margin-top: 0; margin-bottom: 0.75rem;">Suggestions & Feedback</h2>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem; line-height: 1.5;">Have an idea for a new tool or an improvement to an existing feature? Your feedback helps us make Student Utility Hub better.</p>
                    <a href="mailto:${LegalConfig.contactEmail}" style="color: var(--accent-color); font-weight: 600; text-decoration: none; word-break: break-all;">${LegalConfig.contactEmail}</a>
                </article>

                <article class="contact-card" style="background: var(--surface-color); border: 1px solid var(--tool-card-border); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); transition: transform 0.2s ease, box-shadow 0.2s ease;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🤝</div>
                    <h2 style="font-size: 1.25rem; color: var(--text-primary); margin-top: 0; margin-bottom: 0.75rem;">Business & Partnerships</h2>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem; line-height: 1.5;">For collaborations, sponsorships, partnerships, or other business inquiries:</p>
                    <a href="mailto:${LegalConfig.contactEmail}" style="color: var(--accent-color); font-weight: 600; text-decoration: none; word-break: break-all;">${LegalConfig.contactEmail}</a>
                </article>

            </section>

            <!-- 3. EMAIL CTA -->
            <section class="email-cta-section" style="text-align: center; margin-bottom: 5rem; padding: 2rem; background: var(--surface-elevated); border-radius: var(--radius-lg); border: 1px solid var(--tool-card-border);">
                <a href="mailto:${LegalConfig.contactEmail}" class="primary-btn" style="display: inline-flex; align-items: center; justify-content: center; padding: 1rem 2rem; font-size: 1.1rem; font-weight: 600; text-decoration: none; border-radius: var(--radius-md); background: var(--accent-color); color: white; transition: background 0.2s ease;">
                    ✉️ Email Us
                </a>
                <p style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                    or manually email <a href="mailto:${LegalConfig.contactEmail}" style="color: var(--text-primary); font-weight: 500;">${LegalConfig.contactEmail}</a>
                </p>
            </section>

            <!-- Grid for Creator & Info blocks -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 4rem;">
                
                <!-- 4 & 5. ABOUT THE CREATOR & PORTFOLIO -->
                <section class="creator-section" style="background: var(--surface-color); border: 1px solid var(--tool-card-border); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-sm);">
                    <h2 style="font-size: 1.5rem; color: var(--text-primary); margin-top: 0; margin-bottom: 1rem;">About the Creator</h2>
                    <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
                        Student Utility Hub is created and maintained by <strong>${LegalConfig.creatorName}</strong>, an independent developer focused on building useful, fast, privacy-conscious digital tools for students, developers, creators, and everyday users.
                    </p>
                    
                    <div style="padding: 1.5rem; border: 1px solid var(--tool-card-border); border-radius: var(--radius-md); background: var(--background-color);">
                        <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-top: 0; margin-bottom: 0.5rem;">Explore Inventor Mohit</h3>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">Learn more about the creator, explore projects, and discover other work by Inventor Mohit.</p>
                        <a href="${LegalConfig.portfolioUrl}" target="_blank" rel="noopener noreferrer" class="secondary-btn" style="display: inline-block; padding: 0.75rem 1.5rem; text-decoration: none; font-weight: 500; border: 1px solid var(--accent-color); color: var(--accent-color); border-radius: var(--radius-md); transition: all 0.2s ease;">
                            Visit Portfolio →
                        </a>
                    </div>
                </section>

                <!-- 6 & 7. RESPONSE & TRUST -->
                <div style="display: flex; flex-direction: column; gap: 2rem;">
                    <section class="response-section" style="background: var(--surface-color); border: 1px solid var(--tool-card-border); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-sm);">
                        <h2 style="font-size: 1.25rem; color: var(--text-primary); margin-top: 0; margin-bottom: 1rem;">Before Contacting Us</h2>
                        <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin: 0;">
                            Please include the name of the tool you were using, what happened, and the device/browser you were using when reporting a technical issue. This helps us investigate problems faster.
                        </p>
                    </section>

                    <section class="trust-section" style="background: var(--surface-elevated); border: 1px solid var(--tool-card-border); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-sm);">
                        <h2 style="font-size: 1.1rem; color: var(--text-primary); margin-top: 0; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                            🛡️ Built for Useful, Simple & Privacy-Conscious Online Tools
                        </h2>
                        <ul style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin: 0; padding-left: 1.25rem;">
                            <li style="margin-bottom: 0.5rem;">Free online tools</li>
                            <li style="margin-bottom: 0.5rem;">Client-side processing where applicable</li>
                            <li style="margin-bottom: 0.5rem;">No unnecessary account requirement</li>
                            <li>Tools for students, developers, creators and everyday users</li>
                        </ul>
                    </section>
                </div>
            </div>
            
        </div>

        <style>
            .contact-card:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
                border-color: var(--accent-color);
            }
            .contact-page-wrapper .secondary-btn:hover {
                background-color: var(--accent-color);
                color: white !important;
            }
        </style>
    `;
};
