/**
 * Layouts.js
 * Standard layout components for tools (Results box, layouts).
 */

export const createResultBox = ({ id, title = 'Result', html = '' }) => {
    const wrapper = document.createElement('div');
    if (id) wrapper.id = id;
    wrapper.className = 'result-area';
    wrapper.style.display = html ? 'block' : 'none';

    const header = document.createElement('h3');
    header.className = 'result-area-title';
    header.innerHTML = `<span>✓</span> ${title}`;

    const content = document.createElement('div');
    content.className = 'result-content';
    content.innerHTML = html;

    wrapper.appendChild(header);
    wrapper.appendChild(content);

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
    actions.forEach(el => actionsArea.appendChild(el));
    container.appendChild(actionsArea);

    // Result Box Area
    if (resultBox) {
        container.appendChild(resultBox);
    }

    return container;
};
