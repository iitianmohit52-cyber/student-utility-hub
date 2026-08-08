/**
 * Layouts.js
 * Standard layout components for tools (Results box, layouts).
 */

export const createResultBox = ({ id, title = 'Task Completed Successfully', html = '', onReset = null, relatedCategory = '' }) => {
    const wrapper = document.createElement('div');
    if (id) wrapper.id = id;
    wrapper.className = 'result-area';
    wrapper.style.display = html ? 'block' : 'none';

    const header = document.createElement('div');
    header.className = 'result-area-header';
    header.innerHTML = `
        <h3 class="result-area-title"><span>✓</span> ${title}</h3>
    `;

    const content = document.createElement('div');
    content.className = 'result-content';
    content.innerHTML = html;

    const completionFooter = document.createElement('div');
    completionFooter.className = 'result-completion-actions';
    completionFooter.style.cssText = 'margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--tool-card-border); display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; justify-content: space-between;';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'secondary-button';
    resetBtn.innerHTML = '🔄 Start New Task';
    resetBtn.style.cssText = 'padding: 0.5rem 1rem; font-size: 0.88rem;';
    resetBtn.onclick = () => {
        wrapper.hide();
        if (onReset) onReset();
    };

    completionFooter.appendChild(resetBtn);
    
    wrapper.appendChild(header);
    wrapper.appendChild(content);
    wrapper.appendChild(completionFooter);

    wrapper.update = (newHtml, customTitle = title) => {
        content.innerHTML = newHtml;
        const titleEl = header.querySelector('.result-area-title');
        if (titleEl) titleEl.innerHTML = `<span>✓</span> ${customTitle}`;
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
