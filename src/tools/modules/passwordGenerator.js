import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        container.innerHTML = `
                            <label for="passLength">Password Length:</label>
                            <input type="number" id="passLength" value="16" min="8" max="128">
                            <div class="option-group">
                                <input type="checkbox" id="incUppercase" checked> <label for="incUppercase">Uppercase (A-Z)</label><br>
                                <input type="checkbox" id="incLowercase" checked> <label for="incLowercase">Lowercase (a-z)</label><br>
                                <input type="checkbox" id="incNumbers" checked> <label for="incNumbers">Numbers (0-9)</label><br>
                                <input type="checkbox" id="incSymbols" checked> <label for="incSymbols">Symbols (!@#$%^&*)</label>
                            </div>
                            <button id="generatePassBtn">Generate Password</button>
                            <div class="result-area" style="margin-top:1rem; display:flex; align-items:center; justify-content:space-between;">
                                <input type="text" id="generatedPassword" readonly style="flex-grow:1; margin-right:10px; background-color: var(--background-color); border: 1px solid var(--tool-card-background); color: var(--text-color);">
                                <button id="copyPassBtn" title="Copy to Clipboard" style="padding: 0.5em 0.8em;">📋</button>
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


                        generateBtn.onclick = () => {
                            const length = parseInt(lengthInput.value);
                            let charset = '';
                            let guaranteedChars = ''; // To ensure at least one char from each selected set


                            if (uppercaseCheck.checked) {
                                charset += charSets.uppercase;
                                guaranteedChars += charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)];
                            }
                            if (lowercaseCheck.checked) {
                                charset += charSets.lowercase;
                                 guaranteedChars += charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)];
                            }
                            if (numbersCheck.checked) {
                                charset += charSets.numbers;
                                guaranteedChars += charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)];
                            }
                            if (symbolsCheck.checked) {
                                charset += charSets.symbols;
                                guaranteedChars += charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)];
                            }


                            if (charset === '') {
                                showAlert('Please select at least one character type.', 'error');
                                passwordOutput.value = '';
                                return;
                            }
                            if (length < 8 || length > 128) {
                                showAlert('Password length must be between 8 and 128.', 'error');
                                return;
                            }
                            if (length < guaranteedChars.length) {
                                showAlert('Password length is too short to include one of each selected character type.', 'error');
                                return;
                            }




                            let password = guaranteedChars;
                            for (let i = guaranteedChars.length; i < length; i++) {
                                password += charset.charAt(Math.floor(Math.random() * charset.length));
                            }
                            
                            // Shuffle the password to make guaranteed characters random
                            password = password.split('').sort(() => 0.5 - Math.random()).join('');


                            passwordOutput.value = password;
                            hideAlert();
                        };


                        copyBtn.onclick = () => {
                            if (passwordOutput.value) {
                                navigator.clipboard.writeText(passwordOutput.value)
                                    .then(() => showAlert('Password copied to clipboard!', 'success'))
                                    .catch(err => showAlert('Failed to copy password.', 'error'));
                            }
                        };
                    };
