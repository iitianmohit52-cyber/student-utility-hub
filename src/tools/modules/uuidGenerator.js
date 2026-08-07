import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';

export default createTool('uuidGenerator', ({ container, showAlert, hideAlert }) => {
    let count = 5;

    const countInput = createInput({
        id: 'uuidCount',
        type: 'number',
        label: 'Number of UUIDs to generate:',
        value: '5',
        min: 1,
        max: 500,
        onChange: (val) => count = parseInt(val) || 5
    });

    const generateBtn = createButton({
        id: 'generateUuidBtn',
        text: 'Generate UUIDs',
        icon: '🆔',
        onClick: () => generateUuids()
    });

    const resultBox = createResultBox({
        id: 'uuidResult',
        title: 'Generated UUIDs Output'
    });

    const layout = createToolLayout({
        inputs: [countInput],
        actions: [generateBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const generateUUIDv4 = () => {
        // Fallback for older browsers without crypto.randomUUID
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const generateUuids = () => {
        hideAlert();
        
        const list = [];
        for (let i = 0; i < count; i++) {
            list.push(generateUUIDv4());
        }

        const outputStr = list.join('\n');

        resultBox.update(`
            <textarea id="uuidOutput" readonly style="width:100%; height:180px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical; margin-bottom:1rem;">${outputStr}</textarea>
            <div style="display:flex; gap:1rem;">
                <button type="button" class="primary-button" id="copyResultBtn">📋 Copy UUIDs</button>
                <button type="button" class="secondary-button" id="clearBtn">✕ Reset</button>
            </div>
        `);

        const uuidOutput = resultBox.querySelector('#uuidOutput');
        
        resultBox.querySelector('#copyResultBtn').onclick = () => {
            uuidOutput.select();
            document.execCommand('copy');
            showAlert('UUIDs copied to clipboard!', 'success');
        };

        resultBox.querySelector('#clearBtn').onclick = () => {
            resultBox.hide();
        };
    };
});
