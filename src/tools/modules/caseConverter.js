import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="caseInputText">Enter Text:</label>
            <textarea id="caseInputText" rows="5" placeholder="Type or paste your text here..."></textarea>

            <div class="case-buttons" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.6rem; margin-top:1rem;">
                <button type="button" class="tool-button" data-case="upper">UPPERCASE</button>
                <button type="button" class="tool-button" data-case="lower">lowercase</button>
                <button type="button" class="tool-button" data-case="title">Title Case</button>
                <button type="button" class="tool-button" data-case="camel">camelCase</button>
                <button type="button" class="tool-button" data-case="snake">snake_case</button>
                <button type="button" class="tool-button" data-case="kebab">kebab-case</button>
                <button type="button" class="tool-button" data-case="pascal">PascalCase</button>
            </div>

            <div id="caseResultArea" class="result-area" style="display:none; margin-top:1.2rem;">
                <label for="caseOutputText">Result:</label>
                <textarea id="caseOutputText" rows="5" readonly></textarea>
                <button type="button" id="copyCaseBtn" style="margin-top:0.8rem;">📋 Copy to Clipboard</button>
            </div>
        </div>
    `;

    const input = container.querySelector('#caseInputText');
    const resultArea = container.querySelector('#caseResultArea');
    const output = container.querySelector('#caseOutputText');
    const copyBtn = container.querySelector('#copyCaseBtn');

    container.querySelectorAll('.case-buttons button').forEach(btn => {
        btn.onclick = () => {
            const text = input.value;
            if (!text.trim()) {
                showAlert('Please enter text to convert.', 'error');
                return;
            }
            hideAlert();

            const mode = btn.getAttribute('data-case');
            let res = '';

            switch (mode) {
                case 'upper':
                    res = text.toUpperCase();
                    break;
                case 'lower':
                    res = text.toLowerCase();
                    break;
                case 'title':
                    res = text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                    break;
                case 'camel':
                    res = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                    break;
                case 'snake':
                    res = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || text;
                    break;
                case 'kebab':
                    res = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || text;
                    break;
                case 'pascal':
                    res = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (fl) => fl.toUpperCase()).replace(/\s+/g, '');
                    break;
            }

            output.value = res;
            resultArea.style.display = 'block';
        };
    });

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(output.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy to Clipboard', 2000);
    };
};
