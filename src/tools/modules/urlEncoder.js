import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="urlInputText">URL or String:</label>
            <textarea id="urlInputText" rows="4" placeholder="https://example.com/search?q=student tools&category=2"></textarea>

            <div style="display:flex; gap:1rem; margin-top:1rem;">
                <button type="button" id="btnEncodeUrl" class="primary-btn" style="flex:1;">🔒 Encode URL</button>
                <button type="button" id="btnDecodeUrl" class="tool-button" style="flex:1;">🔓 Decode URL</button>
            </div>

            <div id="urlResultArea" class="result-area" style="display:none; margin-top:1.2rem;">
                <label for="urlOutputText">Result:</label>
                <textarea id="urlOutputText" rows="4" readonly></textarea>
                <button id="copyUrlBtn" style="margin-top:0.8rem;">📋 Copy Text</button>
            </div>
        </div>
    `;

    const input = container.querySelector('#urlInputText');
    const btnEncode = container.querySelector('#btnEncodeUrl');
    const btnDecode = container.querySelector('#btnDecodeUrl');
    const resultArea = container.querySelector('#urlResultArea');
    const output = container.querySelector('#urlOutputText');
    const copyBtn = container.querySelector('#copyUrlBtn');

    btnEncode.onclick = () => {
        const text = input.value;
        if (!text) {
            showAlert('Please enter text to encode.', 'error');
            return;
        }
        hideAlert();
        output.value = encodeURIComponent(text);
        resultArea.style.display = 'block';
    };

    btnDecode.onclick = () => {
        const text = input.value;
        if (!text) {
            showAlert('Please enter text to decode.', 'error');
            return;
        }
        try {
            hideAlert();
            output.value = decodeURIComponent(text);
            resultArea.style.display = 'block';
        } catch (err) {
            showAlert('Invalid URL encoded string.', 'error');
        }
    };

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(output.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy Text', 2000);
    };
};
