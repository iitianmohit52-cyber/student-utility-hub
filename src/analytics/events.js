export const AnalyticsEvents = {
    // Page & Session
    PAGE_VIEW: 'page_view',
    CATEGORY_VIEW: 'category_view',
    GUIDE_VIEW: 'guide_view',
    THEME_CHANGE: 'theme_change',
    SEARCH: 'search',
    SEARCH_RESULT_CLICK: 'search_result_click',
    CATEGORY_FILTER: 'category_filter',
    OFFLINE_USAGE: 'offline_usage',
    NOT_FOUND: '404_error',

    // Conversion Funnel & Tools
    TOOL_VIEW: 'tool_view',
    TOOL_START: 'tool_start',
    TOOL_SUCCESS: 'tool_success',
    TOOL_ERROR: 'tool_error',
    TOOL_DOWNLOAD: 'tool_download',
    TOOL_RESET: 'tool_reset',

    // Discovery & Retention
    RELATED_TOOL_CLICK: 'related_tool_click',
    GUIDE_CTA_CLICK: 'guide_cta_click',
    COPY: 'copy',
    SHARE: 'share',
    FAVORITE: 'favorite',
    EXTERNAL_LINK_CLICK: 'external_link_click',

    // PWA
    PWA_INSTALL_PROMPT: 'pwa_install_prompt',
    PWA_INSTALL_ACCEPTED: 'pwa_install_accepted',
    PWA_INSTALL_DISMISSED: 'pwa_install_dismissed',
    PWA_UPDATE_AVAILABLE: 'pwa_update_available',

    // Errors & Performance
    JS_ERROR: 'js_error',
    PROMISE_REJECTION: 'promise_rejection',
    NETWORK_ERROR: 'network_error',
    PERFORMANCE_ISSUE: 'performance_issue',

    // Ads & Monetization
    AD_IMPRESSION: 'ad_impression',
    AD_CLICK: 'ad_click',
    AD_SLOT_VIEW: 'ad_slot_view',
    AD_SLOT_LOADED: 'ad_slot_loaded',
    AD_SLOT_ERROR: 'ad_slot_error'
};
