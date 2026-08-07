import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="hashInputText">Input Text:</label>
            <textarea id="hashInputText" rows="4" placeholder="Enter text to generate hashes..."></textarea>

            <button id="genHashBtn" style="margin-top:1.2rem;">🔐 Generate Hashes</button>

            <div id="hashResult" class="result-area" style="display:none; margin-top:1.2rem; font-family:monospace;">
                <label style="color:var(--accent-color); font-weight:600;">SHA-256 Hash:</label>
                <input type="text" id="hashSha256" readonly style="margin-bottom:1rem;">

                <label style="color:var(--accent-color); font-weight:600;">SHA-512 Hash:</label>
                <input type="text" id="hashSha512" readonly style="margin-bottom:1rem;">

                <label style="color:var(--accent-color); font-weight:600;">SHA-1 Hash:</label>
                <input type="text" id="hashSha1" readonly>
            </div>
        </div>
    `;

    const input = container.querySelector('#hashInputText');
    const genBtn = container.querySelector('#genHashBtn');
    const resultDiv = container.querySelector('#hashResult');
    const sha256Out = container.querySelector('#hashSha256');
    const sha512Out = container.querySelector('#hashSha512');
    const sha1Out = container.querySelector('#hashSha1');

    async function computeHash(algorithm, text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest(algorithm, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    genBtn.onclick = async () => {
        const text = input.value;
        if (!text) {
            showAlert('Please enter text to compute hash.', 'error');
            return;
        }
        hideAlert();

        try {
            sha256Out.value = await computeHash('SHA-256', text);
            sha512Out.value = await computeHash('SHA-512', text);
            sha1Out.value = await computeHash('SHA-1', text);
            resultDiv.style.display = 'block';
        } catch (err) {
            console.error(err);
            showAlert('Error generating hash using WebCrypto.', 'error');
        }
    };
};
