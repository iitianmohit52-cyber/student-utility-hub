import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <div style="display:grid; grid-template-columns:3fr 1fr; gap:0.5rem;">
                <div>
                    <label for="regexPattern">Regular Expression Pattern:</label>
                    <input type="text" id="regexPattern" placeholder="e.g. [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}">
                </div>
                <div>
                    <label for="regexFlags">Flags (g, i, m, s, u):</label>
                    <input type="text" id="regexFlags" value="g" placeholder="g">
                </div>
            </div>

            <label for="regexTestText" style="margin-top:1rem;">Test String / Text:</label>
            <textarea id="regexTestText" rows="5" placeholder="Enter text to test regex matches (e.g., john.doe@example.com)..."></textarea>

            <button id="testRegexBtn" style="margin-top:1.2rem;">🧪 Evaluate Regex Matches</button>

            <div id="regexResultArea" class="result-area" style="display:none; margin-top:1.2rem;"></div>
        </div>
    `;

    const patternInput = container.querySelector('#regexPattern');
    const flagsInput = container.querySelector('#regexFlags');
    const textInput = container.querySelector('#regexTestText');
    const testBtn = container.querySelector('#testRegexBtn');
    const resultArea = container.querySelector('#regexResultArea');

    testBtn.onclick = () => {
        const pattern = patternInput.value;
        const userFlags = flagsInput.value.trim();
        const text = textInput.value;

        if (!pattern) {
            showAlert('Please enter a regular expression pattern.', 'error');
            return;
        }

        try {
            hideAlert();
            // matchAll requires 'g' flag in standard JavaScript
            const executionFlags = userFlags.includes('g') ? userFlags : userFlags + 'g';
            const regex = new RegExp(pattern, executionFlags);
            const matches = [...text.matchAll(regex)];

            let html = `<p style="font-weight:600; color:var(--accent-color); margin-bottom:0.8rem;">Found ${matches.length} match(es):</p>`;

            if (matches.length > 0) {
                html += '<ul style="padding-left:1.2rem; color:var(--text-primary); margin-bottom:1rem;">';
                matches.forEach((m, idx) => {
                    html += `<li><strong>Match ${idx + 1}:</strong> <code>${escapeHtml(m[0])}</code> at character index ${m.index}</li>`;
                });
                html += '</ul>';

                // Safely build highlighted text with 100% HTML escaping
                let lastIndex = 0;
                let highlighted = '';
                for (const match of matches) {
                    const matchStart = match.index;
                    const matchEnd = match.index + match[0].length;
                    highlighted += escapeHtml(text.substring(lastIndex, matchStart));
                    highlighted += `<mark style="background:var(--accent-glow); color:var(--accent-color); font-weight:bold; padding:2px 4px; border-radius:4px;">${escapeHtml(match[0])}</mark>`;
                    lastIndex = matchEnd;
                }
                highlighted += escapeHtml(text.substring(lastIndex));

                html += `<div style="background:var(--surface-color); padding:1rem; border-radius:8px; border:1px solid var(--tool-card-border); white-space:pre-wrap;">${highlighted}</div>`;
            } else {
                html += '<p style="color:var(--text-secondary);">No matches found for the given pattern in this text.</p>';
            }

            resultArea.innerHTML = html;
            resultArea.style.display = 'block';
        } catch (err) {
            showAlert(`Regex Syntax Error: ${err.message}`, 'error');
        }
    };

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
};
