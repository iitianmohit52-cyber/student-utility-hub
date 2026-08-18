import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="jsonInput">Paste JSON Data:</label>
            <textarea id="jsonInput" placeholder="Paste your JSON data here..." rows="8"></textarea>
            <div style="display:flex; flex-wrap:wrap; gap:0.8rem; align-items:center; margin:1rem 0;">
                <label for="jsonSpaces" style="margin-bottom:0;">Indentation:</label>
                <select id="jsonSpaces" style="width:auto; margin-bottom:0;">
                    <option value="2">2 Spaces</option>
                    <option value="4" selected>4 Spaces</option>
                    <option value="tab">Tabs</option>
                </select>
                <div style="display:flex; gap:0.5rem; margin-left:auto;">
                    <button type="button" id="formatJsonBtn" class="primary-button">✨ Format JSON</button>
                    <button type="button" id="minifyJsonBtn" class="secondary-button">🗜️ Minify JSON</button>
                </div>
            </div>
            <label for="jsonOutput" style="display:block; margin-bottom:0.5rem;">Result JSON:
                <button type="button" id="copyJsonBtn" class="secondary-button" style="float:right; padding:0.25rem 0.6rem; font-size:0.85rem;">📋 Copy</button>
            </label>
            <textarea id="jsonOutput" readonly rows="8"></textarea>
            <div id="jsonStats" style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.5rem; display:none;"></div>
        </div>
    `;
    const inputArea = container.querySelector('#jsonInput');
    const outputArea = container.querySelector('#jsonOutput');
    const formatBtn = container.querySelector('#formatJsonBtn');
    const minifyBtn = container.querySelector('#minifyJsonBtn');
    const copyBtn = container.querySelector('#copyJsonBtn');
    const spacesSelect = container.querySelector('#jsonSpaces');
    const statsDiv = container.querySelector('#jsonStats');

    const processJson = (isMinify = false) => {
        const jsonString = inputArea.value.trim();
        if (!jsonString) {
            showAlert('Input is empty. Paste some JSON data first.', 'info');
            outputArea.value = '';
            statsDiv.style.display = 'none';
            return;
        }
        try {
            const jsonObj = JSON.parse(jsonString);
            let formatted = '';
            if (isMinify) {
                formatted = JSON.stringify(jsonObj);
            } else {
                const spacesOption = spacesSelect.value;
                const indent = spacesOption === 'tab' ? '\t' : parseInt(spacesOption, 10);
                formatted = JSON.stringify(jsonObj, null, indent);
            }
            outputArea.value = formatted;
            
            const origBytes = new Blob([jsonString]).size;
            const newBytes = new Blob([formatted]).size;
            const ratio = origBytes > 0 ? ((1 - newBytes / origBytes) * 100).toFixed(1) : 0;
            
            statsDiv.textContent = `Original: ${origBytes} bytes | Output: ${newBytes} bytes ${isMinify ? `(${ratio > 0 ? '-' + ratio : '+' + Math.abs(ratio)}%)` : ''}`;
            statsDiv.style.display = 'block';

            showAlert(isMinify ? 'JSON minified successfully!' : 'JSON formatted successfully!', 'success');
        } catch (e) {
            outputArea.value = 'Error: Invalid JSON\n\n' + e.message;
            statsDiv.style.display = 'none';
            showAlert('Invalid JSON: ' + e.message, 'error');
        }
    };

    formatBtn.onclick = () => processJson(false);
    minifyBtn.onclick = () => processJson(true);

    copyBtn.onclick = () => {
        if (outputArea.value && !outputArea.value.startsWith('Error:')) {
            navigator.clipboard.writeText(outputArea.value)
                .then(() => showAlert('JSON copied to clipboard!', 'success'))
                .catch(() => showAlert('Failed to copy.', 'error'));
        } else if (outputArea.value.startsWith('Error:')) {
            showAlert('Cannot copy error message. Please fix JSON syntax first.', 'info');
        } else {
            showAlert('Nothing to copy. Process some JSON first.', 'info');
        }
    };
};
