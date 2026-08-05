import { safeStorage } from '../utils/safeStorage.js';

export const ConsentCategories = {
    ANALYTICS: 'analytics_consent',
    MARKETING: 'marketing_consent',
    FUNCTIONAL: 'functional_consent' // Usually always true
};

class ConsentManager {
    constructor() {
        this.consents = this.loadConsents();
    }

    loadConsents() {
        try {
            const saved = safeStorage.getItem('privacy_consent');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.warn('Could not read consent data');
        }
        // Default assuming implicit consent isn't allowed for analytics/marketing in strict GDPR
        return {
            [ConsentCategories.ANALYTICS]: false,
            [ConsentCategories.MARKETING]: false,
            [ConsentCategories.FUNCTIONAL]: true
        };
    }

    saveConsents(newConsents) {
        this.consents = { ...this.consents, ...newConsents, [ConsentCategories.FUNCTIONAL]: true };
        safeStorage.setItem('privacy_consent', JSON.stringify(this.consents));
    }

    hasConsent(category) {
        // If strict consent isn't enforced globally, we might return true by default.
        // For enterprise privacy-first, we check explicitly.
        return !!this.consents[category];
    }
}

export const consentManager = new ConsentManager();
