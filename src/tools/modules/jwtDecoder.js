import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="jwtInput">Encoded JWT Token:</label>
            <textarea id="jwtInput" rows="4" placeholder="eyJh..."></textarea>

            <button id="decodeJwtBtn" style="margin-top:1.2rem;">🔓 Decode JWT Token</button>

            <div id="jwtResult" class="result-area" style="display:none; margin-top:1.2rem;">
                <label style="color:var(--accent-color); font-weight:600;">Header:</label>
                <textarea id="jwtHeader" rows="3" readonly style="font-family:monospace; margin-bottom:1rem;"></textarea>

                <label style="color:var(--accent-color); font-weight:600;">Payload:</label>
                <textarea id="jwtPayload" rows="6" readonly style="font-family:monospace;"></textarea>
            </div>
        </div>
    `;

    const input = container.querySelector('#jwtInput');
    const decodeBtn = container.querySelector('#decodeJwtBtn');
    const resultDiv = container.querySelector('#jwtResult');
    const headerOut = container.querySelector('#jwtHeader');
    const payloadOut = container.querySelector('#jwtPayload');

    decodeBtn.onclick = () => {
        const token = input.value.trim();
        if (!token) {
            showAlert('Please paste a JWT token.', 'error');
            return;
        }

        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                showAlert('Invalid JWT format. A valid JWT token has 3 parts separated by dots.', 'error');
                return;
            }

            hideAlert();
            const headerStr = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
            const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));

            headerOut.value = JSON.stringify(JSON.parse(headerStr), null, 2);
            payloadOut.value = JSON.stringify(JSON.parse(payloadStr), null, 2);

            resultDiv.style.display = 'block';
        } catch (err) {
            console.error(err);
            showAlert('Error decoding JWT token. Ensure token is correctly Base64Url encoded.', 'error');
        }
    };
};
