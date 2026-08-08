/**
 * AdSlot.js
 * Centralized Reusable Ad Element Factory
 * Creates responsive, CLS-protected AdSense containers with reserved heights and visibility tracking.
 */

import { MonetizationConfig } from './MonetizationConfig.js';
import { trackAdVisibility } from './AdVisibilityController.js';

export const createAdSlot = (placementType = 'topContent', customStyle = {}) => {
    const placement = MonetizationConfig.placements[placementType] || MonetizationConfig.placements.topContent;
    
    const wrapper = document.createElement('div');
    wrapper.className = `ad-placeholder ${placementType}-ad`;
    wrapper.setAttribute('data-ad-placement', placementType);
    wrapper.setAttribute('data-ad-slot-id', placement.slotId);

    // Apply strict CLS reserve styling
    wrapper.style.minHeight = placement.minHeight;
    wrapper.style.width = '100%';
    wrapper.style.maxWidth = placement.maxWidth;
    wrapper.style.margin = '1.5rem auto';
    wrapper.style.boxSizing = 'border-box';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.position = 'relative';

    Object.assign(wrapper.style, customStyle);

    // Ad content placeholder / AdSense script target
    wrapper.innerHTML = `
        <div style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; opacity: 0.8; padding: 0.5rem;">
            <span>${placement.label}</span>
            <div style="font-size: 0.72rem; opacity: 0.6; margin-top: 0.2rem;">AdSense Ready (Slot #${placement.slotId})</div>
        </div>
    `;

    // Initialize IntersectionObserver visibility tracking
    trackAdVisibility(wrapper, placementType);

    return wrapper;
};
