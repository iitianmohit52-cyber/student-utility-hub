/**
 * legalConfig.js
 * Centralized Configuration for Legal & Trust Pages
 * Maintains consistency across Privacy Policy, Terms of Service, and Disclaimer.
 */

import { SITE_URL } from '../config.js';

export const LegalConfig = {
    siteName: 'Student Utility Hub',
    siteUrl: SITE_URL,
    
    // Real verified details
    contactEmail: 'inventormohit004@gmail.com', 
    creatorName: 'Inventor Mohit',
    portfolioUrl: 'https://inventor-mohit.vercel.app/',

    lastUpdated: 'August 8, 2026',
    
    // Explicitly defining the architecture for legal claims
    architecture: {
        isClientSide: true,
        usesLocalStorage: true,
        usesThirdPartyAnalytics: true,
        usesThirdPartyAds: true
    },
    
    // Governing law jurisdiction
    governingLaw: 'India'
};
