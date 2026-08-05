import { createElement } from '../utils/dom.js';
import { safeStorage } from '../utils/safeStorage.js';
import { Analytics, AnalyticsEvents } from '../analytics/analytics.js';

export const setupThemeToggle = (container) => {
    const btn = createElement('button', 'theme-toggle-btn');
    const currentTheme = safeStorage.getItem('theme', 'dark');
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    btn.innerHTML = currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark';

    btn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        safeStorage.setItem('theme', newTheme);
        Analytics.event(AnalyticsEvents.THEME_CHANGE, { to: newTheme });
        
        btn.innerHTML = newTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    });

    container.appendChild(btn);
};
