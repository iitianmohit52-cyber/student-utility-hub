import { AnalyticsEvents } from './events.js';

export const initErrorReporting = (analyticsTrackFn) => {
    // 1. Unhandled Promise Rejections
    window.addEventListener('unhandledrejection', (event) => {
        analyticsTrackFn(AnalyticsEvents.PROMISE_REJECTION, {
            message: sanitizeError(event.reason?.message || 'Unknown Promise Rejection'),
            type: event.reason?.name || 'Error'
        });
    });

    // 2. Global JS Errors
    window.addEventListener('error', (event) => {
        analyticsTrackFn(AnalyticsEvents.JS_ERROR, {
            message: sanitizeError(event.message),
            filename: sanitizeFilename(event.filename),
            lineno: event.lineno,
            colno: event.colno
        });
    });
};

function sanitizeError(msg) {
    if (!msg) return 'Unknown';
    // Strip file paths, memory addresses, or potential PII from error messages
    return msg.replace(/(\/[^\s]+)/g, '[PATH]').substring(0, 200);
}

function sanitizeFilename(filename) {
    if (!filename) return 'Unknown';
    // Only report the final script name, not the full user path
    return filename.split('/').pop().split('?')[0];
}
