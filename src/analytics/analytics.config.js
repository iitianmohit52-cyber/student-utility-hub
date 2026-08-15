export const AnalyticsConfig = {
    // Enable or disable analytics entirely
    enabled: true,

    // Debug mode logs events to the console instead of sending them (ideal for development)
    debugMode: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'development') || false, // Automatically true in dev, false in prod

    // Data sampling (1.0 = 100% of events, 0.1 = 10% of events)
    samplingRate: 1.0,

    // The providers to push data to. 
    providers: {
        console: true, // Always log to console in debug mode
        googleAnalytics: true, // Pushes page_view & events to GTM dataLayer
        clarity: false,
        plausible: false
    },

    // Privacy restrictions
    privacy: {
        anonymizeIp: true,
        stripQueryString: true,
        blockSensitiveData: true
    }
};
