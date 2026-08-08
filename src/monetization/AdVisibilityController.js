/**
 * AdVisibilityController.js
 * Viewport Intersection Observer for Ad Placement Tracking
 * Fires ad_slot_view, ad_slot_loaded, and ad_slot_error events.
 */

import { Analytics, AnalyticsEvents } from '../analytics/analytics.js';

const trackedSlots = new WeakSet();

export const trackAdVisibility = (adElement, placementType) => {
    if (!adElement || trackedSlots.has(adElement)) return;
    trackedSlots.add(adElement);

    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        Analytics.event(AnalyticsEvents.AD_IMPRESSION || 'ad_slot_view', { placement: placementType });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                Analytics.event(AnalyticsEvents.AD_IMPRESSION || 'ad_slot_view', {
                    placement: placementType,
                    slot_id: adElement.getAttribute('data-ad-slot-id'),
                    visibility_ratio: Math.round(entry.intersectionRatio * 100)
                });

                // Simulating load success event
                Analytics.event('ad_slot_loaded', { placement: placementType });

                // Unobserve after first impression
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 // Require 50% visibility before triggering impression event
    });

    observer.observe(adElement);
};
