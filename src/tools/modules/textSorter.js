import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox, createSelect } from '../../components/ui/index.js';

export default createTool('textSorter', ({ container, showAlert, hideAlert }) => {
    let rawText = '';
    let sortMethod = 'alphabetical-asc';

    const textarea = document.createElement('div');
    textarea.className = 'form-group';
    textarea.style.marginBottom = '1rem';
    textarea.innerHTML = `
        <label for="rawTextInput" style="display:block; margin-bottom:0.5rem; font-weight:500;">Input Text to Sort:</label>
        <textarea id="rawTextInput" class="form-control" style="width:100%; height:200px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical;" placeholder="Enter lines of text to sort..."></textarea>
    `;
    const textInput = textarea.querySelector('#rawTextInput');
    textInput.addEventListener('input', (e) => {
        rawText = e.target.value;
    });

    const sortSelect = createSelect({
        id: 'sortMethod',
        label: 'Sort Method:',
        options: [
            { value: 'alphabetical-asc', label: 'Alphabetical (A - Z)' },
            { value: 'alphabetical-desc', label: 'Alphabetical (Z - A)' },
            { value: 'length-asc', label: 'By Line Length (Shortest to Longest)' },
            { value: 'length-desc', label: 'By Line Length (Longest to Shortest)' },
            { value: 'numerical-asc', label: 'Numerical (Ascending)' },
            { value: 'numerical-desc', label: 'Numerical (Descending)' },
            { value: 'reverse', label: 'Reverse Order of Lines' }
        ],
        onChange: (val) => sortMethod = val
    });

    const sortBtn = createButton({
        id: 'sortTextBtn',
        text: 'Sort Lines',
        icon: '📶',
        onClick: () => sortText()
    });

    const resultBox = createResultBox({
        id: 'textResult',
        title: 'Sorted Text Output'
    });

    const layout = createToolLayout({
        inputs: [textarea, sortSelect],
        actions: [sortBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const sortText = () => {
        if (!rawText.trim()) {
            showAlert('Please enter some text to sort.', 'error');
            return;
        }
        hideAlert();

        const lines = rawText.split(/\r?\n/);

        if (sortMethod === 'alphabetical-asc') {
            lines.sort((a, b) => a.localeCompare(b));
        } else if (sortMethod === 'alphabetical-desc') {
            lines.sort((a, b) => b.localeCompare(a));
        } else if (sortMethod === 'length-asc') {
            lines.sort((a, b) => a.length - b.length);
        } else if (sortMethod === 'length-desc') {
            lines.sort((a, b) => b.length - a.length);
        } else if (sortMethod === 'numerical-asc') {
            lines.sort((a, b) => {
                const numA = parseFloat(a) || 0;
                const numB = parseFloat(b) || 0;
                return numA - numB;
            });
        } else if (sortMethod === 'numerical-desc') {
            lines.sort((a, b) => {
                const numA = parseFloat(a) || 0;
                const numB = parseFloat(b) || 0;
                return numB - numA;
            });
        } else if (sortMethod === 'reverse') {
            lines.reverse();
        }

        const sortedResult = lines.join('\n');

        resultBox.update(`
            <textarea id="sortedOutput" readonly style="width:100%; height:200px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical; margin-bottom:1rem;"></textarea>
            <div style="display:flex; gap:1rem;">
                <button type="button" class="primary-button" id="copyResultBtn">📋 Copy Sorted Text</button>
                <button type="button" class="secondary-button" id="clearBtn">✕ Reset</button>
            </div>
        `);

        const sortedOutput = resultBox.querySelector('#sortedOutput');
        if (sortedOutput) sortedOutput.value = sortedResult;
        
        resultBox.querySelector('#copyResultBtn').onclick = () => {
            sortedOutput.select();
            document.execCommand('copy');
            showAlert('Sorted text copied to clipboard!', 'success');
        };

        resultBox.querySelector('#clearBtn').onclick = () => {
            textInput.value = '';
            rawText = '';
            resultBox.hide();
        };
    };
});
