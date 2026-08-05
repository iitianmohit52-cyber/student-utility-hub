export const AnalyticsEvents = {
    // Page & Session
    PAGE_VIEW: 'page_view',
    THEME_CHANGE: 'theme_change',
    SEARCH: 'search',
    CATEGORY_FILTER: 'category_filter',
    OFFLINE_USAGE: 'offline_usage',
    NOT_FOUND: '404_error',

    // Tools
    TOOL_OPEN: 'tool_open',
    TOOL_CLOSE: 'tool_close',
    TOOL_SUCCESS: 'tool_success',
    TOOL_ERROR: 'tool_error',

    // Interactions
    DOWNLOAD: 'download',
    COPY: 'copy',
    SHARE: 'share',
    FAVORITE: 'favorite',
    EXTERNAL_LINK_CLICK: 'external_link_click',

    // PWA
    PWA_INSTALL_PROMPT: 'pwa_install_prompt',
    PWA_INSTALL_ACCEPTED: 'pwa_install_accepted',
    PWA_INSTALL_DISMISSED: 'pwa_install_dismissed',
    PWA_UPDATE_AVAILABLE: 'pwa_update_available',

    // Errors
    JS_ERROR: 'js_error',
    PROMISE_REJECTION: 'promise_rejection',
    NETWORK_ERROR: 'network_error',
    PERFORMANCE_ISSUE: 'performance_issue',

    // Ads (Prepared)
    AD_IMPRESSION: 'ad_impression',
    AD_CLICK: 'ad_click'
};
