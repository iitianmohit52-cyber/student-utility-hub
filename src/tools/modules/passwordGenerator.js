import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="passLength">Password Length:</label>
            <input type="number" id="passLength" value="16" min="8" max="128">
            <div class="option-group" style="margin: 1rem 0;">
                <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; cursor:pointer;">
                    <input type="checkbox" id="incUppercase" checked> Uppercase Letters (A-Z)
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; cursor:pointer;">
                    <input type="checkbox" id="incLowercase" checked> Lowercase Letters (a-z)
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; cursor:pointer;">
                    <input type="checkbox" id="incNumbers" checked> Numbers (0-9)
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
                    <input type="checkbox" id="incSymbols" checked> Symbols (!@#$%^&*)
                </label>
            </div>
            <button id="generatePassBtn" class="primary-button">🔑 Generate Secure Password</button>
            <div class="result-area" style="margin-top:1.2rem; display:flex; align-items:center; gap:0.5rem;">
                <input type="text" id="generatedPassword" readonly style="flex-grow:1; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:1.05rem;">
                <button type="button" id="copyPassBtn" class="secondary-button" title="Copy to Clipboard" style="padding:0.75rem 1rem;">📋 Copy</button>
            </div>
        </div>
    `;

    const lengthInput = container.querySelector('#passLength');
    const uppercaseCheck = container.querySelector('#incUppercase');
    const lowercaseCheck = container.querySelector('#incLowercase');
    const numbersCheck = container.querySelector('#incNumbers');
    const symbolsCheck = container.querySelector('#incSymbols');
    const generateBtn = container.querySelector('#generatePassBtn');
    const passwordOutput = container.querySelector('#generatedPassword');
    const copyBtn = container.querySelector('#copyPassBtn');

    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    const getSecureRandomInt = (max) => {
        if (max <= 1) return 0;
        const maxUint32 = 0xFFFFFFFF;
        const limit = maxUint32 - (maxUint32 % max);
        const buffer = new Uint32Array(1);
        let rand;
        do {
            if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
                crypto.getRandomValues(buffer);
                rand = buffer[0];
            } else {
                return Math.floor(Math.random() * max);
            }
        } while (rand >= limit);
        return rand % max;
    };

    const secureShuffle = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = getSecureRandomInt(i + 1);
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    };

    generateBtn.onclick = () => {
        const length = parseInt(lengthInput.value, 10);
        let charset = '';
        const guaranteed = [];

        if (uppercaseCheck.checked) {
            charset += charSets.uppercase;
            guaranteed.push(charSets.uppercase[getSecureRandomInt(charSets.uppercase.length)]);
        }
        if (lowercaseCheck.checked) {
            charset += charSets.lowercase;
            guaranteed.push(charSets.lowercase[getSecureRandomInt(charSets.lowercase.length)]);
        }
        if (numbersCheck.checked) {
            charset += charSets.numbers;
            guaranteed.push(charSets.numbers[getSecureRandomInt(charSets.numbers.length)]);
        }
        if (symbolsCheck.checked) {
            charset += charSets.symbols;
            guaranteed.push(charSets.symbols[getSecureRandomInt(charSets.symbols.length)]);
        }

        if (charset === '') {
            showAlert('Please select at least one character type.', 'error');
            passwordOutput.value = '';
            return;
        }
        if (isNaN(length) || length < 8 || length > 128) {
            showAlert('Password length must be between 8 and 128.', 'error');
            return;
        }
        if (length < guaranteed.length) {
            showAlert('Password length is too short for the selected character types.', 'error');
            return;
        }

        const passwordChars = [...guaranteed];
        for (let i = guaranteed.length; i < length; i++) {
            const randIdx = getSecureRandomInt(charset.length);
            passwordChars.push(charset.charAt(randIdx));
        }

        const finalPassword = secureShuffle(passwordChars).join('');
        passwordOutput.value = finalPassword;
        hideAlert();
    };

    copyBtn.onclick = () => {
        if (passwordOutput.value) {
            navigator.clipboard.writeText(passwordOutput.value)
                .then(() => showAlert('Password copied to clipboard!', 'success'))
                .catch(() => showAlert('Failed to copy password.', 'error'));
        }
    };
};
