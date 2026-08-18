import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <textarea id="wcText" placeholder="Paste or type your text here..." rows="8"></textarea>
        <div id="wcResult" class="result-area" style="margin-top:1rem;">
            Words: <strong id="wcWords">0</strong><br>
            Characters (with spaces): <strong id="wcCharsWithSpaces">0</strong><br>
            Characters (no spaces): <strong id="wcCharsNoSpaces">0</strong><br>
            Spaces: <strong id="wcSpaces">0</strong><br>
            Sentences: <strong id="wcSentences">0</strong><br>
            Paragraphs: <strong id="wcParagraphs">0</strong><br>
            Reading Time: <strong id="wcReadingTime">~0 min</strong>
        </div>
    `;
    const textArea = container.querySelector('#wcText');
    const wordsSpan = container.querySelector('#wcWords');
    const charsWithSpacesSpan = container.querySelector('#wcCharsWithSpaces');
    const charsNoSpacesSpan = container.querySelector('#wcCharsNoSpaces');
    const spacesSpan = container.querySelector('#wcSpaces');
    const sentencesSpan = container.querySelector('#wcSentences');
    const paragraphsSpan = container.querySelector('#wcParagraphs');
    const readingTimeSpan = container.querySelector('#wcReadingTime');

    textArea.oninput = () => {
        const text = textArea.value;
        
        // Accurate word counting supporting Unicode / international text
        const trimmed = text.trim();
        const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
        
        const charsWithSpaces = text.length;
        const charsNoSpaces = text.replace(/\s+/g, '').length;
        const spaces = (text.match(/\s/g) || []).length;

        const sentenceMatches = text.match(/[^.!?\n]+[.!?]+(?:\s|$)/g);
        const sentences = sentenceMatches ? sentenceMatches.length : (trimmed ? 1 : 0);
        
        const paragraphsArray = text.split(/\n+/).filter(p => p.trim() !== '');
        const paragraphs = paragraphsArray.length;
        
        const wpm = 200;
        const readingTimeMinutes = words / wpm;
        let readingTimeText = '~0 min';
        if (words === 0) {
            readingTimeText = '~0 min';
        } else if (readingTimeMinutes < 1) {
            const seconds = Math.max(1, Math.round(readingTimeMinutes * 60));
            readingTimeText = `~${seconds} sec`;
        } else {
            readingTimeText = `~${Math.ceil(readingTimeMinutes)} min`;
        }

        wordsSpan.textContent = words.toLocaleString();
        charsWithSpacesSpan.textContent = charsWithSpaces.toLocaleString();
        charsNoSpacesSpan.textContent = charsNoSpaces.toLocaleString();
        spacesSpan.textContent = spaces.toLocaleString();
        sentencesSpan.textContent = sentences.toLocaleString();
        paragraphsSpan.textContent = paragraphs.toLocaleString();
        readingTimeSpan.textContent = readingTimeText;
    };
};
