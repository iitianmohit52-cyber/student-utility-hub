import { AnalyticsConfig } from './analytics.config.js';
import { AnalyticsEvents } from './events.js';
import { consentManager, ConsentCategories } from './consent.js';
import { ConsoleDebugProvider, GoogleTagManagerProvider, PlausibleProvider } from './providers.js';
import { initPerformanceMonitoring } from './performance.js';
import { initErrorReporting } from './errorReporting.js';

class AnalyticsSystem {
    constructor() {
        this.activeProviders = [];
        this.initialized = false;
    }

    init() {
        if (!AnalyticsConfig.enabled) return;
        if (this.initialized) return;

        // Initialize configured providers
        if (AnalyticsConfig.providers.console || AnalyticsConfig.debugMode) {
            this.activeProviders.push(new ConsoleDebugProvider());
        }
        if (AnalyticsConfig.providers.googleAnalytics) {
            this.activeProviders.push(new GoogleTagManagerProvider());
        }

        if (AnalyticsConfig.providers.plausible && consentManager.hasConsent(ConsentCategories.ANALYTICS)) {
            this.activeProviders.push(new PlausibleProvider());
        }

        this.activeProviders.forEach(provider => provider.init());

        // Initialize monitors
        initPerformanceMonitoring((name, data) => this.track(name, data));
        initErrorReporting((name, data) => this.track(name, data));

        this.initialized = true;
    }

    /**
     * Core tracking function. Ensures privacy before dispatching.
     */
    track(eventName, eventData = {}) {
        if (!AnalyticsConfig.enabled) return;

        // Sampling check (e.g. if 0.1, only track 10% of events)
        if (Math.random() > AnalyticsConfig.samplingRate) return;

        const sanitizedData = this.sanitizeData(eventData);

        this.activeProviders.forEach(provider => {
            provider.trackEvent(eventName, sanitizedData);
        });
    }

    /**
     * Page View Tracking
     */
    pageView(url = window.location.pathname) {
        if (!AnalyticsConfig.enabled) return;
        
        let safeUrl = url;
        if (AnalyticsConfig.privacy.stripQueryString) {
            safeUrl = safeUrl.split('?')[0];
        }

        this.activeProviders.forEach(provider => {
            provider.trackPageView(safeUrl);
        });
    }

    /**
     * Tool Specific Tracking
     */
    tool(action, toolId, extraData = {}) {
        this.track(action, { tool_id: toolId, ...extraData });
        this.updateFunnelMetric(action);
    }

    /**
     * Funnel Metric Aggregator (Local anonymous counter for Growth Dashboard)
     */
    updateFunnelMetric(eventName) {
        if (!window.growthAnalytics) {
            window.growthAnalytics = {
                toolViews: 0,
                toolStarts: 0,
                toolSuccesses: 0,
                downloads: 0,
                guideClicks: 0,
                relatedClicks: 0
            };
        }

        if (eventName === AnalyticsEvents.TOOL_VIEW) window.growthAnalytics.toolViews++;
        if (eventName === AnalyticsEvents.TOOL_START) window.growthAnalytics.toolStarts++;
        if (eventName === AnalyticsEvents.TOOL_SUCCESS) window.growthAnalytics.toolSuccesses++;
        if (eventName === AnalyticsEvents.TOOL_DOWNLOAD || eventName === AnalyticsEvents.DOWNLOAD) window.growthAnalytics.downloads++;
        if (eventName === AnalyticsEvents.GUIDE_CTA_CLICK) window.growthAnalytics.guideClicks++;
        if (eventName === AnalyticsEvents.RELATED_TOOL_CLICK) window.growthAnalytics.relatedClicks++;
    }

    /**
     * Error specific tracking
     */
    error(message, context = {}) {
        this.track(AnalyticsEvents.JS_ERROR, { error_message: message, ...context });
    }

    /**
     * General Event Shortcut
     */
    event(name, data = {}) {
        this.track(name, data);
        this.updateFunnelMetric(name);
    }

    /**
     * Privacy Filter: Strips out PII, large payloads, or sensitive inputs
     */
    sanitizeData(data) {
        if (!AnalyticsConfig.privacy.blockSensitiveData) return data;
        
        const cleanData = { ...data };
        
        // Never send raw passwords, emails, or file contents
        const sensitiveKeys = ['password', 'email', 'credit_card', 'file_content', 'file', 'content', 'input', 'pdf', 'image'];
        for (const key of Object.keys(cleanData)) {
            if (sensitiveKeys.includes(key.toLowerCase())) {
                cleanData[key] = '[REDACTED]';
            }
            // Truncate long strings (prevents accidental clipboard/file data leakage)
            if (typeof cleanData[key] === 'string' && cleanData[key].length > 100) {
                cleanData[key] = cleanData[key].substring(0, 100) + '...';
            }
        }
        return cleanData;
    }
}

export const Analytics = new AnalyticsSystem();
// Export the event dictionary for easy usage
export { AnalyticsEvents };
