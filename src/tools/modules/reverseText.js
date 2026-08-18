import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox, createSelect } from '../../components/ui/index.js';

export default createTool('reverseText', ({ container, showAlert, hideAlert }) => {
    let rawText = '';
    let reverseMode = 'entire';

    const textarea = document.createElement('div');
    textarea.className = 'form-group';
    textarea.style.marginBottom = '1rem';
    textarea.innerHTML = `
        <label for="rawTextInput" style="display:block; margin-bottom:0.5rem; font-weight:500;">Input Text:</label>
        <textarea id="rawTextInput" class="form-control" style="width:100%; height:200px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical;" placeholder="Enter text to reverse..."></textarea>
    `;
    const textInput = textarea.querySelector('#rawTextInput');
    textInput.addEventListener('input', (e) => {
        rawText = e.target.value;
    });

    const modeSelect = createSelect({
        id: 'reverseMode',
        label: 'Reverse Mode:',
        options: [
            { value: 'entire', label: 'Reverse Entire Text (Character-by-Character)' },
            { value: 'each-word', label: 'Reverse Letters in Each Word' },
            { value: 'words', label: 'Reverse Word Order' },
            { value: 'lines', label: 'Reverse Line-by-Line' },
            { value: 'words-in-lines', label: 'Reverse Word Order in Each Line' }
        ],
        onChange: (val) => reverseMode = val
    });

    const reverseBtn = createButton({
        id: 'reverseTextBtn',
        text: 'Reverse Text',
        icon: '↩️',
        onClick: () => runReverse()
    });

    const resultBox = createResultBox({
        id: 'textResult',
        title: 'Reversed Text Output'
    });

    const layout = createToolLayout({
        inputs: [textarea, modeSelect],
        actions: [reverseBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const runReverse = () => {
        if (!rawText) {
            showAlert('Please enter some text to reverse.', 'error');
            return;
        }
        hideAlert();

        let output = '';

        if (reverseMode === 'entire') {
            // Unicode-safe reverse using Array.from to prevent broken surrogate pairs
            output = Array.from(rawText).reverse().join('');
        } else if (reverseMode === 'each-word') {
            output = rawText.replace(/\S+/g, (word) => Array.from(word).reverse().join(''));
        } else if (reverseMode === 'words') {
            const tokens = rawText.split(/(\s+)/);
            const words = tokens.filter((_, idx) => idx % 2 === 0);
            const spaces = tokens.filter((_, idx) => idx % 2 !== 0);
            words.reverse();
            output = '';
            for (let i = 0; i < words.length; i++) {
                output += words[i];
                if (i < spaces.length) output += spaces[i];
            }
        } else if (reverseMode === 'lines') {
            output = rawText.split(/\r?\n/).reverse().join('\n');
        } else if (reverseMode === 'words-in-lines') {
            const lines = rawText.split(/\r?\n/);
            const processed = lines.map(line => {
                const parts = line.trim().split(/\s+/).filter(Boolean);
                return parts.reverse().join(' ');
            });
            output = processed.join('\n');
        }

        resultBox.update(`
            <textarea id="reversedOutput" readonly style="width:100%; height:200px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical; margin-bottom:1rem;"></textarea>
            <div style="display:flex; gap:1rem;">
                <button type="button" class="primary-button" id="copyResultBtn">📋 Copy Reversed Text</button>
                <button type="button" class="secondary-button" id="clearBtn">✕ Reset</button>
            </div>
        `);

        const reversedOutput = resultBox.querySelector('#reversedOutput');
        if (reversedOutput) reversedOutput.value = output;
        
        resultBox.querySelector('#copyResultBtn').onclick = () => {
            reversedOutput.select();
            document.execCommand('copy');
            showAlert('Reversed text copied to clipboard!', 'success');
        };

        resultBox.querySelector('#clearBtn').onclick = () => {
            textInput.value = '';
            rawText = '';
            resultBox.hide();
        };
    };
});
