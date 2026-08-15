import { showAlert, hideAlert } from '../../utils/alerts.js';
import { escapeHTML } from '../../utils/sanitize.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div>
                    <label for="authorName">Author Name(s):</label>
                    <input type="text" id="authorName" placeholder="e.g. Smith, John A." value="Smith, John A.">
                </div>
                <div>
                    <label for="pubYear">Year of Publication:</label>
                    <input type="number" id="pubYear" placeholder="2026" value="2026">
                </div>
            </div>

            <label for="titleName" style="margin-top:1rem;">Article / Book Title:</label>
            <input type="text" id="titleName" placeholder="e.g. Modern Client-Side Web Utilities" value="Modern Client-Side Web Utilities">

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1rem;">
                <div>
                    <label for="publisherName">Publisher / Journal:</label>
                    <input type="text" id="publisherName" placeholder="e.g. Academic Press" value="Academic Press">
                </div>
                <div>
                    <label for="citeStyle">Citation Style:</label>
                    <select id="citeStyle">
                        <option value="APA">APA 7th Edition</option>
                        <option value="MLA">MLA 9th Edition</option>
                        <option value="Chicago">Chicago 17th Edition</option>
                    </select>
                </div>
            </div>

            <button id="genCiteBtn" style="margin-top:1.2rem;">📖 Generate Citation</button>

            <div id="citeResultArea" class="result-area" style="display:none; margin-top:1.2rem;">
                <label for="citeOutput">Formatted Citation:</label>
                <div id="citeOutput" style="background:var(--surface-color); padding:1rem; border-radius:8px; border:1px solid var(--tool-card-border); font-family:serif; line-height:1.6;"></div>
                <button id="copyCiteBtn" style="margin-top:0.8rem;">📋 Copy Citation</button>
            </div>
        </div>
    `;

    const authorInput = container.querySelector('#authorName');
    const yearInput = container.querySelector('#pubYear');
    const titleInput = container.querySelector('#titleName');
    const pubInput = container.querySelector('#publisherName');
    const styleSelect = container.querySelector('#citeStyle');
    const genBtn = container.querySelector('#genCiteBtn');
    const resultArea = container.querySelector('#citeResultArea');
    const outputDiv = container.querySelector('#citeOutput');
    const copyBtn = container.querySelector('#copyCiteBtn');

    genBtn.onclick = () => {
        const author = escapeHTML(authorInput.value.trim());
        const year = escapeHTML(yearInput.value.trim());
        const title = escapeHTML(titleInput.value.trim());
        const pub = escapeHTML(pubInput.value.trim());
        const style = styleSelect.value;

        if (!title || !author) {
            showAlert('Please enter author and title.', 'error');
            return;
        }
        hideAlert();

        let citation = '';
        if (style === 'APA') {
            citation = `${author} (${year || 'n.d.'}). <em>${title}</em>. ${pub ? pub + '.' : ''}`;
        } else if (style === 'MLA') {
            citation = `${author}. "${title}." <em>${pub || 'Publisher'}</em>, ${year || '2026'}.`;
        } else {
            citation = `${author}. <em>${title}</em>. ${pub ? pub + ', ' : ''}${year || '2026'}.`;
        }

        outputDiv.innerHTML = citation;
        resultArea.style.display = 'block';
    };

    copyBtn.onclick = () => {
        const temp = document.createElement('div');
        temp.innerHTML = outputDiv.innerHTML;
        navigator.clipboard.writeText(temp.textContent || temp.innerText);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy Citation', 2000);
    };
};
