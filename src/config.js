const rawUrl = (typeof process !== 'undefined' && process.env && process.env.VITE_SITE_URL) || 
               (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) || 
               "https://studentutilityhub.in";

// Safety fallback: Never allow legacy Vercel domain to leak into production SEO
export const SITE_URL = (rawUrl.includes('student-utility-hub-2ss3') || rawUrl.includes('.vercel.app')) 
    ? "https://studentutilityhub.in" 
    : rawUrl.replace(/\/+$/, '');

