import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="cssInputText">CSS Code:</label>
            <textarea id="cssInputText" rows="6" placeholder="body { color: #fff; margin: 0; }"></textarea>

            <div style="display:flex; gap:1rem; margin-top:1rem;">
                <button type="button" id="btnMinifyCss" class="primary-btn" style="flex:1;">🗜️ Minify CSS</button>
                <button type="button" id="btnFormatCss" class="tool-button" style="flex:1;">✨ Format CSS</button>
            </div>

            <div id="cssResultArea" class="result-area" style="display:none; margin-top:1.2rem;">
                <label for="cssOutputText">Result:</label>
                <textarea id="cssOutputText" rows="6" readonly></textarea>
                <button id="copyCssBtn" style="margin-top:0.8rem;">📋 Copy CSS</button>
            </div>
        </div>
    `;

    const input = container.querySelector('#cssInputText');
    const btnMinify = container.querySelector('#btnMinifyCss');
    const btnFormat = container.querySelector('#btnFormatCss');
    const resultArea = container.querySelector('#cssResultArea');
    const output = container.querySelector('#cssOutputText');
    const copyBtn = container.querySelector('#copyCssBtn');

    btnMinify.onclick = () => {
        const text = input.value;
        if (!text.trim()) {
            showAlert('Please enter CSS code.', 'error');
            return;
        }
        hideAlert();
        output.value = text
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s*([\{\}:;,])\s*/g, '$1')
            .replace(/\s+/g, ' ')
            .replace(/;\}/g, '}')
            .trim();
        resultArea.style.display = 'block';
    };

    btnFormat.onclick = () => {
        const text = input.value;
        if (!text.trim()) {
            showAlert('Please enter CSS code.', 'error');
            return;
        }
        hideAlert();
        let formatted = text
            .replace(/\s*\{\s*/g, ' {\n  ')
            .replace(/\s*;\s*/g, ';\n  ')
            .replace(/\s*\}\s*/g, '\n}\n\n');
        output.value = formatted.trim();
        resultArea.style.display = 'block';
    };

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(output.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy CSS', 2000);
    };
};
