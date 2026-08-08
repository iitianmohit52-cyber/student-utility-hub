export const SITE_URL = (typeof process !== 'undefined' && process.env && process.env.VITE_SITE_URL) || 
                        (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) || 
                        "https://student-utility-hub-2ss3.vercel.app";
