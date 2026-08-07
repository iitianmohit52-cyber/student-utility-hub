import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="slugInputText">Enter Title or String:</label>
            <input type="text" id="slugInputText" placeholder="e.g. 10 Best Online Student Utilities for 2026!">

            <button id="genSlugBtn" style="margin-top:1.2rem;">🔗 Generate URL Slug</button>

            <div id="slugResultArea" class="result-area" style="display:none; margin-top:1.2rem;">
                <label for="slugOutput">Clean URL Slug:</label>
                <input type="text" id="slugOutput" readonly>
                <button id="copySlugBtn" style="margin-top:0.8rem;">📋 Copy Slug</button>
            </div>
        </div>
    `;

    const input = container.querySelector('#slugInputText');
    const genBtn = container.querySelector('#genSlugBtn');
    const resultArea = container.querySelector('#slugResultArea');
    const output = container.querySelector('#slugOutput');
    const copyBtn = container.querySelector('#copySlugBtn');

    genBtn.onclick = () => {
        const text = input.value.trim();
        if (!text) {
            showAlert('Please enter text to generate a slug.', 'error');
            return;
        }
        hideAlert();

        const slug = text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        output.value = slug;
        resultArea.style.display = 'block';
    };

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(output.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy Slug', 2000);
    };
};
