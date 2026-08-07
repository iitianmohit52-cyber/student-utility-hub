import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="cleanerInputText">Paste Dirty Text / HTML:</label>
            <textarea id="cleanerInputText" rows="6" placeholder="Paste text with <div>HTML tags</div>,   extra spaces, or empty lines..."></textarea>

            <div style="display:flex; flex-wrap:wrap; gap:1rem; margin-top:1rem;">
                <label style="margin:0; font-size:0.9rem;"><input type="checkbox" id="chkHtml" checked> Strip HTML Tags</label>
                <label style="margin:0; font-size:0.9rem;"><input type="checkbox" id="chkSpaces" checked> Remove Extra Spaces</label>
                <label style="margin:0; font-size:0.9rem;"><input type="checkbox" id="chkLines" checked> Remove Empty Lines</label>
            </div>

            <button id="cleanTextBtn" style="margin-top:1.2rem;">🧹 Clean Text</button>

            <div id="cleanerResult" class="result-area" style="display:none; margin-top:1.2rem;">
                <label for="cleanerOutput">Cleaned Text:</label>
                <textarea id="cleanerOutput" rows="6" readonly></textarea>
                <button id="copyCleanTextBtn" style="margin-top:0.8rem;">📋 Copy Cleaned Text</button>
            </div>
        </div>
    `;

    const input = container.querySelector('#cleanerInputText');
    const chkHtml = container.querySelector('#chkHtml');
    const chkSpaces = container.querySelector('#chkSpaces');
    const chkLines = container.querySelector('#chkLines');
    const cleanBtn = container.querySelector('#cleanTextBtn');
    const resultDiv = container.querySelector('#cleanerResult');
    const output = container.querySelector('#cleanerOutput');
    const copyBtn = container.querySelector('#copyCleanTextBtn');

    cleanBtn.onclick = () => {
        let text = input.value;
        if (!text.trim()) {
            showAlert('Please paste some text to clean.', 'error');
            return;
        }
        hideAlert();

        if (chkHtml.checked) {
            text = text.replace(/<[^>]*>?/gm, '');
        }
        if (chkSpaces.checked) {
            text = text.replace(/[ \t]+/g, ' ');
        }
        if (chkLines.checked) {
            text = text.split('\n').filter(line => line.trim() !== '').join('\n');
        }

        output.value = text.trim();
        resultDiv.style.display = 'block';
    };

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(output.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy Cleaned Text', 2000);
    };
};
