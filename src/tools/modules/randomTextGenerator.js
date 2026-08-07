import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox, createSelect } from '../../components/ui/index.js';

const WORDS_POOL = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
    'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut',
    'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris',
    'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure',
    'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore',
    'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non',
    'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
    'est', 'laborum', 'developer', 'startup', 'interface', 'responsive', 'optimization',
    'experience', 'design', 'performance', 'serverless', 'scaling', 'cloud', 'database'
];

export default createTool('randomTextGenerator', ({ container, showAlert, hideAlert }) => {
    let countType = 'paragraphs';
    let countNum = 3;

    const countInput = createInput({
        id: 'countNum',
        type: 'number',
        label: 'Number of Items:',
        value: '3',
        min: 1,
        max: 100,
        onChange: (val) => countNum = parseInt(val) || 3
    });

    const typeSelect = createSelect({
        id: 'countType',
        label: 'Type:',
        options: [
            { value: 'paragraphs', label: 'Paragraphs' },
            { value: 'sentences', label: 'Sentences' },
            { value: 'words', label: 'Words' }
        ],
        onChange: (val) => countType = val
    });

    const generateBtn = createButton({
        id: 'generateTextBtn',
        text: 'Generate Text',
        icon: '🎲',
        onClick: () => generateText()
    });

    const resultBox = createResultBox({
        id: 'textResult',
        title: 'Generated Output'
    });

    const layout = createToolLayout({
        inputs: [countInput, typeSelect],
        actions: [generateBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const getRandomWord = () => WORDS_POOL[Math.floor(Math.random() * WORDS_POOL.length)];

    const generateSentence = () => {
        const wordCount = Math.floor(Math.random() * 8) + 6; // 6 to 13 words
        const words = [];
        for (let i = 0; i < wordCount; i++) {
            words.push(getRandomWord());
        }
        const sentence = words.join(' ');
        return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    };

    const generateParagraph = () => {
        const sentenceCount = Math.floor(Math.random() * 4) + 4; // 4 to 7 sentences
        const sentences = [];
        for (let i = 0; i < sentenceCount; i++) {
            sentences.push(generateSentence());
        }
        return sentences.join(' ');
    };

    const generateText = () => {
        hideAlert();
        let output = '';

        if (countType === 'words') {
            const words = [];
            for (let i = 0; i < countNum; i++) {
                words.push(getRandomWord());
            }
            output = words.join(' ');
        } else if (countType === 'sentences') {
            const sentences = [];
            for (let i = 0; i < countNum; i++) {
                sentences.push(generateSentence());
            }
            output = sentences.join(' ');
        } else if (countType === 'paragraphs') {
            const paragraphs = [];
            for (let i = 0; i < countNum; i++) {
                paragraphs.push(generateParagraph());
            }
            output = paragraphs.join('\n\n');
        }

        resultBox.update(`
            <textarea id="generatedOutput" readonly style="width:100%; height:200px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical; margin-bottom:1rem;">${output}</textarea>
            <div style="display:flex; gap:1rem;">
                <button type="button" class="primary-button" id="copyResultBtn">📋 Copy Generated Text</button>
                <button type="button" class="secondary-button" id="clearBtn">✕ Reset</button>
            </div>
        `);

        const generatedOutput = resultBox.querySelector('#generatedOutput');
        
        resultBox.querySelector('#copyResultBtn').onclick = () => {
            generatedOutput.select();
            document.execCommand('copy');
            showAlert('Generated text copied to clipboard!', 'success');
        };

        resultBox.querySelector('#clearBtn').onclick = () => {
            resultBox.hide();
        };
    };
});
