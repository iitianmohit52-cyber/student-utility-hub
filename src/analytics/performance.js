import { AnalyticsEvents } from './events.js';

export const initPerformanceMonitoring = (analyticsTrackFn) => {
    if (!window.performance || !window.PerformanceObserver) return;

    // Report helper
    const reportPerf = (name, value, entry) => {
        analyticsTrackFn(AnalyticsEvents.PERFORMANCE_ISSUE, {
            metric_name: name,
            value: Math.round(value),
            // Don't send entire entry to save bandwidth, just relevant info
        });
    };

    try {
        // Core Web Vitals via PerformanceObserver
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            reportPerf('LCP', lastEntry.startTime, lastEntry);
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // First Contentful Paint (FCP)
        const fcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntriesByName('first-contentful-paint');
            if (entries.length > 0) {
                reportPerf('FCP', entries[0].startTime, entries[0]);
            }
        });
        fcpObserver.observe({ type: 'paint', buffered: true });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        
        // Report CLS on page unload
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden' && clsValue > 0) {
                reportPerf('CLS', clsValue * 1000, null); // Scaled for integer reporting
            }
        });

        // Long Tasks
        const longTaskObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                reportPerf('LongTask', entry.duration, entry);
            }
        });
        longTaskObserver.observe({ type: 'longtask', buffered: true });

    } catch (e) {
        console.warn('Performance monitoring not fully supported in this browser.');
    }
};
