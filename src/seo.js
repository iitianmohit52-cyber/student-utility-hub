import { SITE_URL } from './config.js';

export function updateSEO(path = window.location.pathname) {
    // Clean path (treat /index.html as homepage)
    const cleanPath = path === '/index.html' ? '/' : path;
    
    // Ensure no double slashes are introduced
    const pathSegment = cleanPath === '/' ? '' : cleanPath;
    const currentCanonicalUrl = `${SITE_URL}${pathSegment}`;

    // 1. Maintain exactly ONE canonical <link> element
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    // Remove duplicate canonical tags if any exist
    const canonicals = document.querySelectorAll('link[rel="canonical"]');
    if (canonicals.length > 1) {
        canonicals.forEach((c, idx) => {
            if (idx > 0) c.remove();
        });
    }
    canonical.href = currentCanonicalUrl;

    // 2. Open Graph URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
        ogUrl.content = currentCanonicalUrl;
    }

    // 3. JSON-LD Website URL updates
    const jsonLds = document.querySelectorAll('script[type="application/ld+json"]');
    jsonLds.forEach(jsonLd => {
        try {
            const data = JSON.parse(jsonLd.innerHTML);
            if (data["@graph"]) {
                data["@graph"].forEach(item => {
                    if (item["@type"] === "WebSite" || item["@type"] === "Organization" || item["@type"] === "CollectionPage") {
                        item.url = currentCanonicalUrl;
                        if (item["@id"]) {
                            const baseId = item["@type"] === "WebSite" ? "#website" : (item["@type"] === "Organization" ? "#organization" : "#webpage");
                            item["@id"] = `${SITE_URL}${pathSegment}${pathSegment.endsWith('/') ? '' : '/'}${baseId}`;
                        }
                        if (item.isPartOf && item.isPartOf["@id"]) {
                            item.isPartOf["@id"] = `${SITE_URL}/#website`;
                        }
                    }
                });
            }
            jsonLd.innerHTML = JSON.stringify(data);
        } catch (e) {
            // Ignore parse errors from article or dynamic schemas
        }
    });
}
