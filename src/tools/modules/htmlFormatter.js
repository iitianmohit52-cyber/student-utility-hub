import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="htmlInputText">HTML Code:</label>
            <textarea id="htmlInputText" rows="6" placeholder="<div><p>Paste HTML here...</p></div>"></textarea>

            <div style="display:flex; gap:1rem; margin-top:1rem;">
                <button type="button" id="btnFormatHtml" class="primary-btn" style="flex:1;">✨ Format / Beautify</button>
                <button type="button" id="btnMinifyHtml" class="tool-button" style="flex:1;">🗜️ Minify HTML</button>
            </div>

            <div id="htmlResultArea" class="result-area" style="display:none; margin-top:1.2rem;">
                <label for="htmlOutputText">Processed Result:</label>
                <textarea id="htmlOutputText" rows="6" readonly></textarea>
                <button id="copyHtmlCodeBtn" style="margin-top:0.8rem;">📋 Copy Code</button>
            </div>
        </div>
    `;

    const input = container.querySelector('#htmlInputText');
    const btnFormat = container.querySelector('#btnFormatHtml');
    const btnMinify = container.querySelector('#btnMinifyHtml');
    const resultArea = container.querySelector('#htmlResultArea');
    const output = container.querySelector('#htmlOutputText');
    const copyBtn = container.querySelector('#copyHtmlCodeBtn');

    btnFormat.onclick = () => {
        const text = input.value;
        if (!text.trim()) {
            showAlert('Please enter HTML code.', 'error');
            return;
        }
        hideAlert();

        // Simple HTML Indenter
        let formatted = '';
        let indent = '';
        const tab = '  ';
        text.split(/>\s*</).forEach(node => {
            if (node.match(/^\/\w/)) indent = indent.substring(tab.length);
            formatted += indent + '<' + node + '>\r\n';
            if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('input') && !node.startsWith('img') && !node.startsWith('br') && !node.startsWith('meta')) indent += tab;
        });
        output.value = formatted.substring(1, formatted.length - 3).trim();
        resultArea.style.display = 'block';
    };

    btnMinify.onclick = () => {
        const text = input.value;
        if (!text.trim()) {
            showAlert('Please enter HTML code.', 'error');
            return;
        }
        hideAlert();
        output.value = text.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
        resultArea.style.display = 'block';
    };

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(output.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy Code', 2000);
    };
};
