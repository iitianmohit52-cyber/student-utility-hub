import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="jsInputText">JavaScript Code:</label>
            <textarea id="jsInputText" rows="6" placeholder="function hello(){console.log('world');}"></textarea>

            <div style="display:flex; gap:1rem; margin-top:1rem;">
                <button type="button" id="btnFormatJs" class="primary-btn" style="flex:1;">✨ Format JS</button>
                <button type="button" id="btnMinifyJs" class="tool-button" style="flex:1;">🗜️ Minify JS</button>
            </div>

            <div id="jsResultArea" class="result-area" style="display:none; margin-top:1.2rem;">
                <label for="jsOutputText">Result:</label>
                <textarea id="jsOutputText" rows="6" readonly></textarea>
                <button id="copyJsBtn" style="margin-top:0.8rem;">📋 Copy JS</button>
            </div>
        </div>
    `;

    const input = container.querySelector('#jsInputText');
    const btnFormat = container.querySelector('#btnFormatJs');
    const btnMinify = container.querySelector('#btnMinifyJs');
    const resultArea = container.querySelector('#jsResultArea');
    const output = container.querySelector('#jsOutputText');
    const copyBtn = container.querySelector('#copyJsBtn');

    btnFormat.onclick = () => {
        const text = input.value;
        if (!text.trim()) {
            showAlert('Please enter JavaScript code.', 'error');
            return;
        }
        hideAlert();
        let formatted = text
            .replace(/\s*;\s*/g, ';\n')
            .replace(/\s*\{\s*/g, ' {\n  ')
            .replace(/\s*\}\s*/g, '\n}\n');
        output.value = formatted.trim();
        resultArea.style.display = 'block';
    };

    btnMinify.onclick = () => {
        const text = input.value;
        if (!text.trim()) {
            showAlert('Please enter JavaScript code.', 'error');
            return;
        }
        hideAlert();
        output.value = text
            .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
            .replace(/\s+/g, ' ')
            .replace(/\s*([\{\}\(\);,:=])\s*/g, '$1')
            .trim();
        resultArea.style.display = 'block';
    };

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(output.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy JS', 2000);
    };
};
