/**
 * Centralized Error Boundary
 */
import { Analytics, AnalyticsEvents } from '../analytics/analytics.js';

export const initErrorHandling = () => {
    // Catch unhandled runtime errors
    window.addEventListener('error', (event) => {
        console.error('[Global Boundary] Caught error:', {
            message: event.message,
            source: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
        
        // Prevent default browser error reporting if needed
        // event.preventDefault();
    });

    // Catch unhandled Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('[Global Boundary] Unhandled Promise Rejection:', event.reason);
        // event.preventDefault();
    });
};

/**
 * Safe wrapper for async tool execution
 * @param {Function} fn 
 * @param {HTMLElement} container 
 * @param {String} toolId
 */
export const withErrorBoundary = async (fn, container, toolId = 'unknown') => {
    try {
        await fn();
        Analytics.tool(AnalyticsEvents.TOOL_SUCCESS, toolId);
    } catch (error) {
        console.error('[Tool Boundary] Execution failed:', error);
        Analytics.tool(AnalyticsEvents.TOOL_ERROR, toolId, { message: error.message });
        if (container) {
            container.innerHTML = `
                <div class="error-boundary" style="padding: 2rem; text-align: center; color: #ff4757;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h3>Something went wrong</h3>
                    <p style="color: var(--text-secondary); margin-top: 0.5rem;">The tool encountered an unexpected error. Please try reloading the page.</p>
                </div>
            `;
        }
    }
};
