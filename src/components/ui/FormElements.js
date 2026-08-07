/**
 * FormElements.js
 * Centralized UI component library for standard inputs, buttons, and form controls.
 */

export const createInput = ({ id, type = 'text', label, placeholder = '', value = '', required = false, onChange, min, max, step }) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';
    wrapper.style.marginBottom = '1rem';

    if (label) {
        const lbl = document.createElement('label');
        lbl.htmlFor = id;
        lbl.textContent = label;
        lbl.style.display = 'block';
        lbl.style.marginBottom = '0.5rem';
        lbl.style.fontWeight = '500';
        wrapper.appendChild(lbl);
    }

    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.placeholder = placeholder;
    input.value = value;
    if (required) input.required = true;
    
    // Add extra attributes if provided
    if (min !== undefined) input.min = min;
    if (max !== undefined) input.max = max;
    if (step !== undefined) input.step = step;

    // Apply standard styles (these map to main.css but ensure consistency)
    input.className = 'form-control';
    input.style.width = '100%';
    input.style.padding = '0.75rem';
    input.style.border = '1px solid var(--tool-card-border)';
    input.style.borderRadius = 'var(--radius-md)';
    input.style.background = 'var(--surface-color)';
    input.style.color = 'var(--text-primary)';
    input.style.fontSize = '1rem';

    if (onChange) {
        input.addEventListener('input', (e) => onChange(e.target.value, e));
    }

    wrapper.appendChild(input);
    return wrapper;
};

export const createButton = ({ text, id, onClick, variant = 'primary', type = 'button', icon = '' }) => {
    const btn = document.createElement('button');
    if (id) btn.id = id;
    btn.type = type;
    btn.className = variant === 'primary' ? 'primary-button' : 'secondary-button';
    
    // Inline flex to align icon and text
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.gap = '0.5rem';
    
    // Apply common styles to avoid relying solely on exact class match if refactored
    btn.style.padding = '0.75rem 1.5rem';
    btn.style.borderRadius = 'var(--radius-md)';
    btn.style.fontWeight = '600';
    btn.style.cursor = 'pointer';
    btn.style.border = variant === 'primary' ? 'none' : '1px solid var(--tool-card-border)';
    btn.style.background = variant === 'primary' ? 'var(--primary-color)' : 'transparent';
    btn.style.color = variant === 'primary' ? 'white' : 'var(--text-primary)';
    
    btn.innerHTML = `${icon ? `<span>${icon}</span>` : ''}<span>${text}</span>`;

    if (onClick) {
        btn.addEventListener('click', onClick);
    }

    return btn;
};

export const createSelect = ({ id, label, options = [], onChange }) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';
    wrapper.style.marginBottom = '1rem';

    if (label) {
        const lbl = document.createElement('label');
        lbl.htmlFor = id;
        lbl.textContent = label;
        lbl.style.display = 'block';
        lbl.style.marginBottom = '0.5rem';
        lbl.style.fontWeight = '500';
        wrapper.appendChild(lbl);
    }

    const select = document.createElement('select');
    select.id = id;
    select.className = 'form-control';
    select.style.width = '100%';
    select.style.padding = '0.75rem';
    select.style.border = '1px solid var(--tool-card-border)';
    select.style.borderRadius = 'var(--radius-md)';
    select.style.background = 'var(--surface-color)';
    select.style.color = 'var(--text-primary)';

    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        select.appendChild(option);
    });

    if (onChange) {
        select.addEventListener('change', (e) => onChange(e.target.value, e));
    }

    wrapper.appendChild(select);
    return wrapper;
};
