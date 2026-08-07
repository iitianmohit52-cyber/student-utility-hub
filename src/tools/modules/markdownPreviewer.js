import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="mdInput">Markdown Editor:</label>
            <textarea id="mdInput" rows="6" placeholder="# Hello World&#10;&#10;Write **Markdown** here..."></textarea>

            <label style="margin-top:1rem;">Live Preview:</label>
            <div id="mdPreview" class="result-area" style="min-height:120px; background:var(--surface-color); padding:1rem;"></div>

            <button id="copyHtmlBtn" style="margin-top:1rem;">📋 Copy Rendered HTML</button>
        </div>
    `;

    const input = container.querySelector('#mdInput');
    const preview = container.querySelector('#mdPreview');
    const copyBtn = container.querySelector('#copyHtmlBtn');

    function parseMarkdown(md) {
        if (!md.trim()) return '<em style="color:var(--text-secondary);">Live preview will appear here...</em>';
        return md
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n$/gim, '<br />')
            .replace(/\n/gim, '<br />');
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
