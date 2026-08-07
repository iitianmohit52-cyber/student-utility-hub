import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox, createSelect } from '../../components/ui/index.js';

export default createTool('timestampConverter', ({ container, showAlert, hideAlert }) => {
    let timestampInputVal = Math.floor(Date.now() / 1000).toString();
    let timestampUnit = 'seconds'; // 'seconds' or 'ms'
    let humanDateInputVal = new Date().toISOString();

    const timestampGroup = document.createElement('div');
    timestampGroup.style.borderBottom = '1px solid var(--tool-card-border)';
    timestampGroup.style.paddingBottom = '1.5rem';
    timestampGroup.style.marginBottom = '1.5rem';

    const header1 = document.createElement('h4');
    header1.textContent = '1. Convert Epoch Timestamp to Date';
    header1.style.marginBottom = '1rem';
    timestampGroup.appendChild(header1);

    const timeInput = createInput({
        id: 'epochTimestamp',
        type: 'text',
        label: 'Epoch Timestamp:',
        value: timestampInputVal,
        onChange: (val) => timestampInputVal = val
    });
    timestampGroup.appendChild(timeInput);

    const unitSelect = createSelect({
        id: 'epochUnit',
        label: 'Unit:',
        options: [
            { value: 'seconds', label: 'Seconds (standard)' },
            { value: 'ms', label: 'Milliseconds' }
        ],
        onChange: (val) => timestampUnit = val
    });
    timestampGroup.appendChild(unitSelect);

    const convToDateBtn = createButton({
        text: 'Convert to Date ➔',
        onClick: () => convertToDate()
    });
    timestampGroup.appendChild(convToDateBtn);

    // Section 2: Date to Timestamp
    const dateGroup = document.createElement('div');
    dateGroup.style.marginBottom = '1.5rem';

    const header2 = document.createElement('h4');
    header2.textContent = '2. Convert Human Date to Epoch';
    header2.style.marginBottom = '1rem';
    dateGroup.appendChild(header2);

    const dateInput = createInput({
        id: 'humanDate',
        type: 'text',
        label: 'Date String (ISO, GMT, Local):',
        value: humanDateInputVal,
        onChange: (val) => humanDateInputVal = val
    });
    dateGroup.appendChild(dateInput);

    const convToTimeBtn = createButton({
        text: 'Convert to Epoch ➔',
        onClick: () => convertToEpoch()
    });
    dateGroup.appendChild(convToTimeBtn);

    const resultBox = createResultBox({
        id: 'conversionResult',
        title: 'Conversion Result'
    });

    const inputsWrapper = document.createElement('div');
    inputsWrapper.appendChild(timestampGroup);
    inputsWrapper.appendChild(dateGroup);

    const layout = createToolLayout({
        inputs: [inputsWrapper],
        actions: [],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const convertToDate = () => {
        hideAlert();
        try {
            const rawVal = parseFloat(timestampInputVal);
            if (isNaN(rawVal)) {
                showAlert('Please enter a valid numeric timestamp.', 'error');
                return;
            }

            const timestamp = timestampUnit === 'seconds' ? rawVal * 1000 : rawVal;
            const date = new Date(timestamp);
            
            if (isNaN(date.getTime())) {
                showAlert('Invalid timestamp value.', 'error');
                return;
            }

            resultBox.update(`
                <div style="font-size:0.95rem; line-height:1.6;">
                    <p><strong>GMT Time:</strong> <code>${date.toUTCString()}</code></p>
                    <p><strong>Local Time:</strong> <code>${date.toString()}</code></p>
                    <p><strong>ISO 8601:</strong> <code>${date.toISOString()}</code></p>
                </div>
            `);
        } catch (err) {
            showAlert('Failed to parse timestamp.', 'error');
        }
    };

    const convertToEpoch = () => {
        hideAlert();
        try {
            const date = new Date(humanDateInputVal);
            if (isNaN(date.getTime())) {
                showAlert('Invalid date format. Use ISO format (e.g. YYYY-MM-DDTHH:mm:ss).', 'error');
                return;
            }

            const ms = date.getTime();
            const sec = Math.floor(ms / 1000);

            resultBox.update(`
                <div style="font-size:0.95rem; line-height:1.6;">
                    <p><strong>Seconds (Unix epoch):</strong> <code>${sec}</code></p>
                    <p><strong>Milliseconds:</strong> <code>${ms}</code></p>
                </div>
            `);
        } catch (err) {
            showAlert('Failed to convert date to epoch.', 'error');
        }
    };
});
