import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';

export default createTool('duplicateLineRemover', ({ container, showAlert, hideAlert }) => {
    let rawText = '';
    let ignoreCase = false;
    let ignoreEmpty = true;

    const textarea = document.createElement('div');
    textarea.className = 'form-group';
    textarea.style.marginBottom = '1rem';
    textarea.innerHTML = `
        <label for="rawTextInput" style="display:block; margin-bottom:0.5rem; font-weight:500;">Input Text:</label>
        <textarea id="rawTextInput" class="form-control" style="width:100%; height:200px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical;" placeholder="Enter lines of text here..."></textarea>
    `;
    const textInput = textarea.querySelector('#rawTextInput');
    textInput.addEventListener('input', (e) => {
        rawText = e.target.value;
    });

    const caseCheckbox = document.createElement('div');
    caseCheckbox.className = 'form-group';
    caseCheckbox.style.marginBottom = '1rem';
    caseCheckbox.style.display = 'flex';
    caseCheckbox.style.gap = '2rem';
    caseCheckbox.innerHTML = `
        <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
            <input type="checkbox" id="ignoreCaseChk"> Case Insensitive
        </label>
        <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
            <input type="checkbox" id="ignoreEmptyChk" checked> Ignore Empty Lines
        </label>
    `;
    const ignoreCaseChk = caseCheckbox.querySelector('#ignoreCaseChk');
    const ignoreEmptyChk = caseCheckbox.querySelector('#ignoreEmptyChk');
    ignoreCaseChk.addEventListener('change', (e) => ignoreCase = e.target.checked);
    ignoreEmptyChk.addEventListener('change', (e) => ignoreEmpty = e.target.checked);

    const cleanBtn = createButton({
        id: 'cleanTextBtn',
        text: 'Remove Duplicate Lines',
        icon: '🧹',
        onClick: () => cleanText()
    });

    const resultBox = createResultBox({
        id: 'textResult',
        title: 'Cleaned Text Output'
    });

    const layout = createToolLayout({
        inputs: [textarea, caseCheckbox],
        actions: [cleanBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const cleanText = () => {
        if (!rawText.trim()) {
            showAlert('Please enter some text to clean.', 'error');
            return;
        }
        hideAlert();

        const lines = rawText.split(/\r?\n/);
        const seen = new Set();
        const outputLines = [];

        lines.forEach(line => {
            const trimmed = line.trim();
            if (ignoreEmpty && trimmed === '') return;

            const checkValue = ignoreCase ? trimmed.toLowerCase() : trimmed;
            
            if (!seen.has(checkValue)) {
                seen.add(checkValue);
                outputLines.push(line); // Keep original line formatting
            }
        });

        const cleanedResult = outputLines.join('\n');
        
        resultBox.update(`
            <textarea id="cleanedOutput" readonly style="width:100%; height:200px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical; margin-bottom:1rem;">${cleanedResult}</textarea>
            <div style="display:flex; gap:1rem;">
                <button type="button" class="primary-button" id="copyResultBtn">📋 Copy Cleaned Text</button>
                <button type="button" class="secondary-button" id="clearBtn">✕ Reset</button>
            </div>
        `);

        // Event listener binding
        const cleanedOutput = resultBox.querySelector('#cleanedOutput');
        
        resultBox.querySelector('#copyResultBtn').onclick = () => {
            cleanedOutput.select();
            document.execCommand('copy');
            showAlert('Text copied to clipboard!', 'success');
        };

        resultBox.querySelector('#clearBtn').onclick = () => {
            textInput.value = '';
            rawText = '';
            resultBox.hide();
        };
    };
});
