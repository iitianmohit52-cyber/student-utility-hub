import { SITE_URL } from './config.js';

export function updateSEO() {
    // 1. Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
        canonical.href = `${SITE_URL}/`;
    }

    // 2. Open Graph URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
        ogUrl.content = `${SITE_URL}/`;
    }

    // 3. JSON-LD Website URL
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
        try {
            const data = JSON.parse(jsonLd.innerHTML);
            if (data["@graph"]) {
                data["@graph"].forEach(item => {
                    if (item["@type"] === "WebSite" || item["@type"] === "Organization" || item["@type"] === "CollectionPage") {
                        item.url = `${SITE_URL}/`;
                        if (item["@id"]) {
                            item["@id"] = item["@id"].replace(/https:\/\/.*?\//, `${SITE_URL}/`);
                        }
                        if (item.potentialAction && item.potentialAction.target) {
                            item.potentialAction.target = `${SITE_URL}/?s={search_term_string}`;
                        }
                        if (item.logo && item.logo.url) {
                            item.logo.url = `${SITE_URL}/logo.png`;
                        }
                        if (item.isPartOf && item.isPartOf["@id"]) {
                            item.isPartOf["@id"] = `${SITE_URL}/#website`;
                        }
                    }
                });
            }
            jsonLd.innerHTML = JSON.stringify(data);
        } catch (e) {
            console.error("Error updating JSON-LD", e);
        }
    }
}
