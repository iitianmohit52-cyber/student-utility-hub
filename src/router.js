let onRouteChangedCallback = null;

export const initRouter = (onRouteChanged) => {
    onRouteChangedCallback = onRouteChanged;

    // Listen to popstate for browser back/forward buttons
    window.addEventListener('popstate', () => {
        if (onRouteChangedCallback) {
            onRouteChangedCallback(window.location.pathname);
        }
    });

    // Intercept click events on standard anchors to prevent full-page reload
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.host === window.location.host && !link.hasAttribute('download') && link.target !== '_blank') {
            const path = link.pathname;
            // Allow in-page hash jumps to proceed naturally
            if (link.pathname === window.location.pathname && link.hash) {
                return;
            }
            e.preventDefault();
            navigate(path);
        }
    });

    // Initial trigger
    onRouteChangedCallback(window.location.pathname);
};

export const navigate = (path) => {
    if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
    }
    
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (onRouteChangedCallback) {
        onRouteChangedCallback(path);
    }
};
