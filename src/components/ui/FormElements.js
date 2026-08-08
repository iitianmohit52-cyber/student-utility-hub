/**
 * FormElements.js
 * Centralized UI component library for standard inputs, buttons, and form controls.
 */

export const createInput = ({ id, type = 'text', label, placeholder = '', value = '', required = false, onChange, min, max, step }) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';

    if (label) {
        const lbl = document.createElement('label');
        lbl.htmlFor = id;
        lbl.textContent = label;
        wrapper.appendChild(lbl);
    }

    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.placeholder = placeholder;
    input.value = value;
    if (required) input.required = true;
    
    if (min !== undefined) input.min = min;
    if (max !== undefined) input.max = max;
    if (step !== undefined) input.step = step;

    input.className = 'form-control';

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
    
    btn.innerHTML = `${icon ? `<span>${icon}</span>` : ''}<span>${text}</span>`;

    if (onClick) {
        btn.addEventListener('click', onClick);
    }

    return btn;
};

export const createSelect = ({ id, label, options = [], onChange }) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';

    if (label) {
        const lbl = document.createElement('label');
        lbl.htmlFor = id;
        lbl.textContent = label;
        wrapper.appendChild(lbl);
    }

    const select = document.createElement('select');
    select.id = id;
    select.className = 'form-control';

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
