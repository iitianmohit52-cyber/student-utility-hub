import { createTool } from '../core/ToolFactory.js';
import { createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';

export default createTool('scientificCalculator', ({ container, showAlert, hideAlert }) => {
    let expression = '';

    // Calculator Display Wrapper
    const displayWrapper = document.createElement('div');
    displayWrapper.className = 'form-group';
    displayWrapper.style.marginBottom = '1.5rem';

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

    // Calculator Grid Layout
    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(5, 1fr)';
    gridContainer.style.gap = '0.5rem';
    gridContainer.style.marginTop = '1rem';

    // Buttons definition: [label, action/char, isCommand]
    const calcButtons = [
        ['sin', 'sin(', false], ['cos', 'cos(', false], ['tan', 'tan(', false], ['deg', 'deg', true], ['C', 'clear', true],
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
        
        // Premium coloring
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
        } else if (action === 'deg') {
            // Toggle angle unit (show premium toast/alert)
            showAlert('Calculator operates in Radians mode for trigonometric functions.', 'success');
        } else {
            expression += action;
            displayInput.value = expression;
        }
    };

    const evaluateExpression = () => {
        if (!expression) return;

        try {
            // Rewrite standard names to Math operations safely
            let parsedExpr = expression
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(')
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/sqrt\(/g, 'Math.sqrt(')
                .replace(/pi/g, 'Math.PI')
                .replace(/e/g, 'Math.E')
                .replace(/\^/g, '**');

            // Sanitize expression
            const cleanExpr = parsedExpr.replace(/[^-+*/().0-9eE%Math.sinco\s]/g, '');
            
            const evaluateFn = new Function(`return (${cleanExpr})`);
            const result = evaluateFn();

            if (result === undefined || isNaN(result)) {
                throw new Error();
            }

            const formattedResult = Number.isInteger(result) ? result : result.toFixed(8).replace(/\.?0+$/, '');
            
            // Log to History
            const historyItem = `<div style="font-family:monospace; margin-bottom:0.5rem; display:flex; justify-content:space-between;">
                <span>${expression} =</span>
                <strong style="color:var(--primary-color);">${formattedResult}</strong>
            </div>`;
            
            const existingHistory = resultBox.querySelector('.result-content').innerHTML;
            resultBox.update(historyItem + existingHistory);

            expression = formattedResult.toString();
            displayInput.value = expression;
        } catch (err) {
            showAlert('Invalid expression or calculation error.', 'error');
        }
    };
});
