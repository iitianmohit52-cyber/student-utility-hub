/**
 * webVitals.js
 * Browser PerformanceObserver monitor tracking Core Web Vitals (LCP, CLS, INP)
 * and storing measurements on window.growthAnalytics for diagnostic reviews.
 */

window.growthAnalytics = window.growthAnalytics || {
    lcp: null,
    cls: 0,
    inp: null,
    navigationTime: null
};

export const initWebVitals = () => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
        // 1. Navigation Timing
        window.addEventListener('load', () => {
            const timing = performance.getEntriesByType('navigation')[0];
            if (timing) {
                window.growthAnalytics.navigationTime = Math.round(timing.duration);
            }
        });

        // 2. Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            window.growthAnalytics.lcp = Math.round(lastEntry.startTime);
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // 3. Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    window.growthAnalytics.cls += entry.value;
                }
            }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        // 4. Interaction to Next Paint (INP)
        const inpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                window.growthAnalytics.inp = Math.round(entry.duration);
            });
        });
        inpObserver.observe({ type: 'first-input', buffered: true });

    } catch (e) {
        console.warn('Web Vitals observer initialization skipped:', e);
    }
};
