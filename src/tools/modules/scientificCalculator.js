import { createTool } from '../core/ToolFactory.js';
import { createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';

export default createTool('scientificCalculator', ({ container, showAlert, hideAlert }) => {
    let expression = '';
    let isDegreeMode = false; // false = Radians, true = Degrees

    // Calculator Display Wrapper
    const displayWrapper = document.createElement('div');
    displayWrapper.className = 'form-group';
    displayWrapper.style.marginBottom = '1rem';

    const displayInput = document.createElement('input');
    displayInput.type = 'text';
    displayInput.readOnly = true;
    displayInput.style.width = '100%';
    displayInput.style.padding = '1rem';
    displayInput.style.fontSize = '1.5rem';
    displayInput.style.fontFamily = 'monospace';
    displayInput.style.textAlign = 'right';
    displayInput.style.border = '1px solid var(--tool-card-border)';
    displayInput.style.borderRadius = 'var(--radius-md)';
    displayInput.style.background = 'var(--surface-color)';
    displayInput.style.color = 'var(--text-primary)';
    displayInput.value = '0';
    displayWrapper.appendChild(displayInput);

    // Mode Indicator
    const modeBadge = document.createElement('div');
    modeBadge.style.fontSize = '0.8rem';
    modeBadge.style.color = 'var(--text-secondary)';
    modeBadge.style.marginTop = '0.3rem';
    modeBadge.style.textAlign = 'right';
    modeBadge.textContent = 'Mode: RAD (Radians)';
    displayWrapper.appendChild(modeBadge);

    // Calculator Grid Layout
    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(5, 1fr)';
    gridContainer.style.gap = '0.5rem';
    gridContainer.style.marginTop = '0.5rem';

    // Buttons definition: [label, action/char, isCommand]
    const calcButtons = [
        ['sin', 'sin(', false], ['cos', 'cos(', false], ['tan', 'tan(', false], ['DEG/RAD', 'toggle_deg', true], ['C', 'clear', true],
        ['ln', 'ln(', false], ['log', 'log(', false], ['π', 'pi', false], ['(', '(', false], [')', ')', false],
        ['√', 'sqrt(', false], ['^', '^', false], ['e', 'e', false], ['mod', '%', false], ['⌫', 'backspace', true],
        ['7', '7', false], ['8', '8', false], ['9', '9', false], ['/', '/', false], ['*', '*', false],
        ['4', '4', false], ['5', '5', false], ['6', '6', false], ['-', '-', false], ['+', '+', false],
        ['1', '1', false], ['2', '2', false], ['3', '3', false], ['.', '.', false], ['=', 'equal', true],
        ['0', '0', false]
    ];

    calcButtons.forEach(([label, action, isCmd]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        btn.style.padding = '0.75rem 0';
        btn.style.fontSize = '1rem';
        btn.style.fontWeight = '600';
        btn.style.borderRadius = 'var(--radius-sm)';
        btn.style.cursor = 'pointer';
        
        if (isCmd) {
            btn.style.background = action === 'equal' ? 'var(--primary-color)' : 'var(--surface-elevated)';
            btn.style.color = action === 'equal' ? 'white' : 'var(--text-primary)';
            btn.style.border = '1px solid var(--tool-card-border)';
        } else if (isNaN(label) && label !== '.') {
            btn.style.background = 'var(--surface-elevated)';
            btn.style.color = 'var(--primary-color)';
            btn.style.border = '1px solid var(--tool-card-border)';
        } else {
            btn.style.background = 'var(--surface-color)';
            btn.style.color = 'var(--text-primary)';
            btn.style.border = '1px solid var(--tool-card-border)';
        }

        if (label === '0') {
            btn.style.gridColumn = 'span 2';
        }

        btn.addEventListener('click', () => handleInput(action));
        gridContainer.appendChild(btn);
    });

    const resultBox = createResultBox({
        id: 'calcHistory',
        title: 'Calculator History'
    });

    const layout = createToolLayout({
        inputs: [displayWrapper, gridContainer],
        actions: [],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const handleInput = (action) => {
        hideAlert();
        if (action === 'clear') {
            expression = '';
            displayInput.value = '0';
        } else if (action === 'backspace') {
            expression = expression.slice(0, -1);
            displayInput.value = expression || '0';
        } else if (action === 'equal') {
            evaluateExpression();
        } else if (action === 'toggle_deg') {
            isDegreeMode = !isDegreeMode;
            modeBadge.textContent = isDegreeMode ? 'Mode: DEG (Degrees)' : 'Mode: RAD (Radians)';
            showAlert(`Switched to ${isDegreeMode ? 'Degrees (DEG)' : 'Radians (RAD)'} mode.`, 'info');
        } else {
            expression += action;
            displayInput.value = expression;
        }
    };

    const evaluateExpression = () => {
        if (!expression) return;

        try {
            // Helpers for degree/rad trigonometric functions
            const degToRad = (x) => isDegreeMode ? (x * Math.PI) / 180 : x;
            const _sin = (x) => Math.sin(degToRad(x));
            const _cos = (x) => Math.cos(degToRad(x));
            const _tan = (x) => Math.tan(degToRad(x));
            const _sqrt = (x) => Math.sqrt(x);
            const _log = (x) => Math.log10(x);
            const _ln = (x) => Math.log(x);
            const _pi = Math.PI;
            const _e = Math.E;

            // Safe token replacement
            let parsedExpr = expression
                .replace(/sin\(/g, '_sin(')
                .replace(/cos\(/g, '_cos(')
                .replace(/tan\(/g, '_tan(')
                .replace(/sqrt\(/g, '_sqrt(')
                .replace(/log\(/g, '_log(')
                .replace(/ln\(/g, '_ln(')
                .replace(/\bpi\b/g, '_pi')
                .replace(/\be\b/g, '_e')
                .replace(/\^/g, '**');

            // Sanitize expression allowing only math operations and identifiers
            if (!/^[0-9+\-*/().%*\s_sinco_ta_sqr_lg_p_e]+$/.test(parsedExpr)) {
                // Double check with safe allowed characters
                const isSafe = /^[_a-zA-Z0-9+\-*/().%\s]+$/.test(parsedExpr);
                if (!isSafe) throw new Error('Unsafe tokens in expression');
            }

            const evaluateFn = new Function('_sin', '_cos', '_tan', '_sqrt', '_log', '_ln', '_pi', '_e', `return (${parsedExpr});`);
            const rawResult = evaluateFn(_sin, _cos, _tan, _sqrt, _log, _ln, _pi, _e);

            if (rawResult === undefined || isNaN(rawResult) || !isFinite(rawResult)) {
                throw new Error('Calculation error');
            }

            const formattedResult = Number.isInteger(rawResult) 
                ? rawResult 
                : parseFloat(rawResult.toFixed(8)).toString();
            
            // Log to History
            const historyItem = `<div style="font-family:monospace; margin-bottom:0.5rem; display:flex; justify-content:space-between; border-bottom:1px solid var(--tool-card-border); padding-bottom:0.3rem;">
                <span>${expression} =</span>
                <strong style="color:var(--primary-color);">${formattedResult}</strong>
            </div>`;
            
            const historyContainer = resultBox.querySelector('.result-content');
            if (historyContainer) {
                historyContainer.innerHTML = historyItem + historyContainer.innerHTML;
            }

            expression = formattedResult.toString();
            displayInput.value = expression;
        } catch (err) {
            showAlert('Invalid mathematical expression.', 'error');
        }
    };
});
