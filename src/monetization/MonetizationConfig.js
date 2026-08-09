/**
 * MonetizationConfig.js
 * Centralized Monetization Configuration System
 * Manages ad slots, placement density, feature flags, and future revenue streams.
 */

export const MonetizationConfig = {
    // Global Ad Switch & Provider Details
    enabled: true,
    adsensePublisherId: 'ca-pub-709465335735977',
    debugMode: process.env.NODE_ENV !== 'production',

    // Placement Configurations (Reserved Heights prevent CLS)
    placements: {
        topContent: {
            id: 'top-ad-slot',
            minHeight: '90px',
            maxWidth: '100%',
            label: 'Advertisement',
            slotId: '1001'
        },
        inlineSection: {
            id: 'inline-ad-slot',
            minHeight: '100px',
            maxWidth: '100%',
            label: 'Advertisement',
            slotId: '1002'
        },
        toolPage: {
            id: 'tool-page-ad-slot',
            minHeight: '120px',
            maxWidth: '100%',
            label: 'Sponsored Utility Link',
            slotId: '1003'
        },
        articlePage: {
            id: 'article-ad-slot',
            minHeight: '120px',
            maxWidth: '100%',
            label: 'Contextual Resources',
            slotId: '1004'
        },
        bottomContent: {
            id: 'footer-ad-slot',
            minHeight: '90px',
            maxWidth: '100%',
            label: 'Advertisement',
            slotId: '1005'
        }
    },

    // Feature Flags Architecture (Prepared for future tiers)
    tiers: {
        FREE: {
            name: 'Free Standard Plan',
            adsEnabled: true,
            maxFileSizeMB: 50,
            batchLimit: 10,
            historyRetentionDays: 7
        },
        PREMIUM: {
            name: 'Pro Tier (Future)',
            adsEnabled: false,
            maxFileSizeMB: 500,
            batchLimit: 100,
            historyRetentionDays: 90,
            features: [
                'Zero Advertisements',
                'Advanced PDF Encryption & OCR',
                'Unlimited Local History',
                'Cloud Backup Sync',
                'Priority Processing'
            ]
        },
        SPONSORED: {
            name: 'Enterprise / Partner',
            adsEnabled: false,
            customBranding: true
        }
    },

    // Future Revenue Streams Extensible Architecture
    futureRevenueStreams: {
        affiliateLinks: { active: false, label: 'Recommended Developer Services & Hosting' },
        digitalResources: { active: false, label: 'Student Study Guides & Formula Handbooks' },
        premiumSubscriptions: { active: false, label: 'Student Utility Hub Pro' },
        sponsoredTools: { active: false, label: 'Partner Software Integrations' },
        newsletter: { active: false, label: 'Weekly Productivity & Tech Insights' }
    }
};
