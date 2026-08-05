export class BaseProvider {
    init() {}
    trackEvent(eventName, eventData) {}
    trackPageView(url) {}
}

export class ConsoleDebugProvider extends BaseProvider {
    init() {
        console.log('[Analytics] Debug Provider Initialized');
    }

    trackEvent(eventName, eventData) {
        console.log(`[Analytics:Event] ${eventName}`, eventData);
    }

    trackPageView(url) {
        console.log(`[Analytics:PageView] ${url}`);
    }
}

// Stubs for future implementation
export class GoogleAnalyticsProvider extends BaseProvider {
    init() {
        // window.dataLayer = window.dataLayer || [];
        // function gtag(){dataLayer.push(arguments);}
        // gtag('js', new Date());
        // gtag('config', 'G-XXXXXX');
    }
    trackEvent(eventName, eventData) {
        // if (window.gtag) gtag('event', eventName, eventData);
    }
    trackPageView(url) {
        // if (window.gtag) gtag('event', 'page_view', { page_path: url });
    }
}

export class PlausibleProvider extends BaseProvider {
    init() { /* Inject plausible script */ }
    trackEvent(eventName, eventData) { /* plausible(eventName, {props: eventData}) */ }
    trackPageView(url) { /* plausible('pageview') */ }
}
