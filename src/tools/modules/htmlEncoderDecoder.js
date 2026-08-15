import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';

export default createTool('htmlEncoderDecoder', ({ container, showAlert, hideAlert }) => {
    let rawText = '';

    const textarea = document.createElement('div');
    textarea.className = 'form-group';
    textarea.style.marginBottom = '1rem';
    textarea.innerHTML = `
        <label for="rawTextInput" style="display:block; margin-bottom:0.5rem; font-weight:500;">Input Text / HTML:</label>
        <textarea id="rawTextInput" class="form-control" style="width:100%; height:200px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical;" placeholder="Enter text or HTML here..."></textarea>
    `;
    const textInput = textarea.querySelector('#rawTextInput');
    textInput.addEventListener('input', (e) => {
        rawText = e.target.value;
    });

    const encodeBtn = createButton({
        id: 'encodeBtn',
        text: 'Encode HTML',
        icon: '🔣',
        onClick: () => runEncode()
    });

    const decodeBtn = createButton({
        id: 'decodeBtn',
        text: 'Decode HTML',
        icon: '🔓',
        onClick: () => runDecode()
    });

    const resultBox = createResultBox({
        id: 'textResult',
        title: 'Output Result'
    });

    const layout = createToolLayout({
        inputs: [textarea],
        actions: [encodeBtn, decodeBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const runEncode = () => {
        if (!rawText) {
            showAlert('Please enter text to encode.', 'error');
            return;
        }
        hideAlert();

        const temp = document.createElement('div');
        temp.textContent = rawText;
        const encoded = temp.innerHTML;

        showResult(encoded);
    };

    const runDecode = () => {
        if (!rawText) {
            showAlert('Please enter HTML to decode.', 'error');
            return;
        }
        hideAlert();

        const temp = document.createElement('div');
        temp.innerHTML = rawText;
        const decoded = temp.textContent;

        showResult(decoded);
    };

    const showResult = (resultStr) => {
        resultBox.update(`
            <textarea id="outputField" readonly style="width:100%; height:200px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical; margin-bottom:1rem;"></textarea>
            <div style="display:flex; gap:1rem;">
                <button type="button" class="primary-button" id="copyResultBtn">📋 Copy Output</button>
                <button type="button" class="secondary-button" id="clearBtn">✕ Reset</button>
            </div>
        `);

        const outputField = resultBox.querySelector('#outputField');
        if (outputField) outputField.value = resultStr;
        
        resultBox.querySelector('#copyResultBtn').onclick = () => {
            outputField.select();
            document.execCommand('copy');
            showAlert('Output copied to clipboard!', 'success');
        };

        resultBox.querySelector('#clearBtn').onclick = () => {
            textInput.value = '';
            rawText = '';
            resultBox.hide();
        };
    };
});
