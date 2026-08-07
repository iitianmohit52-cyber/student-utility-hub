/**
 * Layouts.js
 * Standard layout components for tools (Results box, layouts).
 */

export const createResultBox = ({ id, title = 'Result', html = '' }) => {
    const wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.className = 'result-area';
    wrapper.style.marginTop = '1.5rem';
    wrapper.style.padding = '1.5rem';
    wrapper.style.background = 'var(--surface-elevated)';
    wrapper.style.border = '1px solid var(--tool-card-border)';
    wrapper.style.borderRadius = 'var(--radius-lg)';
    wrapper.style.display = html ? 'block' : 'none';

    const header = document.createElement('h3');
    header.textContent = title;
    header.style.marginTop = '0';
    header.style.marginBottom = '1rem';
    header.style.color = 'var(--primary-color)';
    header.style.fontSize = '1.1rem';

    const content = document.createElement('div');
    content.className = 'result-content';
    content.innerHTML = html;

    wrapper.appendChild(header);
    wrapper.appendChild(content);

    // Method to update content dynamically
    wrapper.update = (newHtml) => {
        content.innerHTML = newHtml;
        wrapper.style.display = 'block';
    };

    wrapper.hide = () => {
        wrapper.style.display = 'none';
        content.innerHTML = '';
    };

    return wrapper;
};

export const createToolLayout = ({ inputs = [], actions = [], resultBox = null }) => {
    const container = document.createElement('div');
    container.className = 'tool-layout';

    // Inputs Area
    const inputsArea = document.createElement('div');
    inputsArea.className = 'tool-inputs';
    inputs.forEach(el => inputsArea.appendChild(el));
    container.appendChild(inputsArea);

    // Actions Area
    const actionsArea = document.createElement('div');
    actionsArea.className = 'tool-actions';
    actionsArea.style.display = 'flex';
    actionsArea.style.gap = '1rem';
    actionsArea.style.marginTop = '1.5rem';
    actions.forEach(el => actionsArea.appendChild(el));
    container.appendChild(actionsArea);

    // Result Box Area
    if (resultBox) {
        container.appendChild(resultBox);
    }

    return container;
};
