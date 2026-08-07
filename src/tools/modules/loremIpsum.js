import { showAlert, hideAlert } from '../../utils/alerts.js';

const words = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur"];

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div>
                    <label for="loremCount">Count:</label>
                    <input type="number" id="loremCount" value="3" min="1" max="50">
                </div>
                <div>
                    <label for="loremType">Type:</label>
                    <select id="loremType">
                        <option value="paragraphs">Paragraphs</option>
                        <option value="sentences">Sentences</option>
                        <option value="words">Words</option>
                    </select>
                </div>
            </div>

            <button id="genLoremBtn" style="margin-top:1.2rem;">📄 Generate Lorem Ipsum</button>

            <div id="loremResult" class="result-area" style="display:none; margin-top:1.2rem;">
                <textarea id="loremOutput" rows="6" readonly></textarea>
                <button id="copyLoremBtn" style="margin-top:0.8rem;">📋 Copy Text</button>
            </div>
        </div>
    `;

    const countInput = container.querySelector('#loremCount');
    const typeSelect = container.querySelector('#loremType');
    const genBtn = container.querySelector('#genLoremBtn');
    const resultDiv = container.querySelector('#loremResult');
    const output = container.querySelector('#loremOutput');
    const copyBtn = container.querySelector('#copyLoremBtn');

    genBtn.onclick = () => {
        const count = parseInt(countInput.value, 10) || 3;
        const type = typeSelect.value;
        hideAlert();

        let result = [];
        if (type === 'words') {
            for (let i = 0; i < count; i++) {
                result.push(words[i % words.length]);
            }
            output.value = result.join(' ');
        } else if (type === 'sentences') {
            for (let i = 0; i < count; i++) {
                let sent = [];
                const len = 8 + (i % 6);
                for (let j = 0; j < len; j++) {
                    sent.push(words[(i * len + j) % words.length]);
                }
                let sentence = sent.join(' ');
                sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
                result.push(sentence);
            }
            output.value = result.join(' ');
        } else {
            for (let p = 0; p < count; p++) {
                let sents = [];
                for (let s = 0; s < 4; s++) {
                    let sent = [];
                    for (let w = 0; w < 10; w++) {
                        sent.push(words[(p * 40 + s * 10 + w) % words.length]);
                    }
                    let sentence = sent.join(' ');
                    sents.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.');
                }
                result.push(sents.join(' '));
            }
            output.value = result.join('\n\n');
        }

        resultDiv.style.display = 'block';
    };

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(output.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy Text', 2000);
    };
};
