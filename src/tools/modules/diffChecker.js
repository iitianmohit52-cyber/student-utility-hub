import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div>
                    <label for="diffOriginal">Original Text:</label>
                    <textarea id="diffOriginal" rows="6" placeholder="Paste original text..."></textarea>
                </div>
                <div>
                    <label for="diffModified">Modified Text:</label>
                    <textarea id="diffModified" rows="6" placeholder="Paste modified text..."></textarea>
                </div>
            </div>

            <button id="compareDiffBtn" style="margin-top:1.2rem;">🔍 Compare Differences</button>

            <div id="diffOutputResult" class="result-area" style="display:none; margin-top:1.2rem; font-family:monospace; line-height:1.5;"></div>
        </div>
    `;

    const originalInput = container.querySelector('#diffOriginal');
    const modifiedInput = container.querySelector('#diffModified');
    const compareBtn = container.querySelector('#compareDiffBtn');
    const resultDiv = container.querySelector('#diffOutputResult');

    compareBtn.onclick = () => {
        const origLines = originalInput.value.split('\n');
        const modLines = modifiedInput.value.split('\n');

        if (!originalInput.value && !modifiedInput.value) {
            showAlert('Please enter text into both fields to compare.', 'error');
            return;
        }
        hideAlert();

        let html = '<div style="background:var(--surface-color); padding:1rem; border-radius:8px;">';
        const maxLen = Math.max(origLines.length, modLines.length);
        let diffCount = 0;

        for (let i = 0; i < maxLen; i++) {
            const orig = origLines[i];
            const mod = modLines[i];

            if (orig === mod) {
                html += `<div style="color:var(--text-secondary); opacity:0.8;">  ${escapeHtml(orig || '')}</div>`;
            } else {
                diffCount++;
                if (orig !== undefined) {
                    html += `<div style="background:rgba(239, 68, 68, 0.2); color:#f87171; padding:2px 4px;">- ${escapeHtml(orig)}</div>`;
                }
                if (mod !== undefined) {
                    html += `<div style="background:rgba(34, 197, 94, 0.2); color:#4ade80; padding:2px 4px;">+ ${escapeHtml(mod)}</div>`;
                }
            }
        }
        html += '</div>';

        resultDiv.innerHTML = `
            <p style="margin-bottom:0.8rem; font-weight:600; color:var(--text-primary);">Comparison Result (${diffCount} line difference(s) found):</p>
            ${html}
        `;
        resultDiv.style.display = 'block';
    };

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
};
