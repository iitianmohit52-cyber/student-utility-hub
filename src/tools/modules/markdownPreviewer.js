import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="mdInput">Markdown Editor:</label>
            <textarea id="mdInput" rows="7" placeholder="# Hello World&#10;&#10;Write **Markdown** here with code, lists, and links..."></textarea>

            <label style="margin-top:1rem; display:block; font-weight:600; color:var(--accent-color);">Live Rendered Preview:</label>
            <div id="mdPreview" class="result-area" style="min-height:140px; background:var(--surface-color); padding:1.2rem; border:1px solid var(--tool-card-border); border-radius:8px; line-height:1.6;"></div>

            <button id="copyHtmlBtn" style="margin-top:1rem;">📋 Copy Rendered HTML</button>
        </div>
    `;

    const input = container.querySelector('#mdInput');
    const preview = container.querySelector('#mdPreview');
    const copyBtn = container.querySelector('#copyHtmlBtn');

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function parseMarkdown(raw) {
        if (!raw.trim()) return '<em style="color:var(--text-secondary);">Live preview will appear here in real time...</em>';
        
        // Escape HTML tags to prevent XSS injection
        let safe = escapeHtml(raw);

        // Headers
        safe = safe.replace(/^### (.*$)/gim, '<h3 style="color:var(--text-primary); margin:0.6rem 0;">$1</h3>');
        safe = safe.replace(/^## (.*$)/gim, '<h2 style="color:var(--text-primary); margin:0.8rem 0;">$1</h2>');
        safe = safe.replace(/^# (.*$)/gim, '<h1 style="color:var(--text-primary); margin:1rem 0;">$1</h1>');

        // Bold & Italic
        safe = safe.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
        safe = safe.replace(/\*(.*?)\*/gim, '<em>$1</em>');

        // Inline Code & Blocks
        safe = safe.replace(/`([^`]+)`/g, '<code style="background:var(--surface-elevated); padding:2px 6px; border-radius:4px; font-family:monospace; color:var(--accent-color);">$1</code>');

        // Links
        safe = safe.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--accent-color); text-decoration:underline;">$1</a>');

        // Blockquotes
        safe = safe.replace(/^>\s*(.*$)/gim, '<blockquote style="border-left:3px solid var(--accent-color); margin:0.5rem 0; padding-left:0.8rem; color:var(--text-secondary);">$1</blockquote>');

        // Line breaks
        safe = safe.replace(/\n/gim, '<br />');

        return safe;
    }

    input.oninput = () => {
        preview.innerHTML = parseMarkdown(input.value);
    };
    preview.innerHTML = parseMarkdown('');

    copyBtn.onclick = () => {
        if (!input.value.trim()) {
            showAlert('Please enter some markdown text first.', 'error');
            return;
        }
        hideAlert();
        navigator.clipboard.writeText(preview.innerHTML);
        copyBtn.textContent = '✅ HTML Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy Rendered HTML', 2000);
    };
};
