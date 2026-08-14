import { showAlert, hideAlert } from '../../utils/alerts.js';

function base64UrlDecodeUtf8(str) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0: break;
        case 2: output += '=='; break;
        case 3: output += '='; break;
        default: throw new Error('Illegal base64url string');
    }
    const binary = atob(output);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
}

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="jwtInput">Encoded JWT Token (Header.Payload.Signature):</label>
            <textarea id="jwtInput" rows="4" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."></textarea>

            <button id="decodeJwtBtn" style="margin-top:1.2rem;">🔓 Decode JWT Token</button>

            <div id="jwtResult" class="result-area" style="display:none; margin-top:1.2rem;">
                <label style="color:var(--accent-color); font-weight:600; display:block; margin-bottom:0.3rem;">Header (Decoded JSON):</label>
                <textarea id="jwtHeader" rows="4" readonly style="font-family:monospace; margin-bottom:1rem; width:100%;"></textarea>

                <label style="color:var(--accent-color); font-weight:600; display:block; margin-bottom:0.3rem;">Payload / Claims (Decoded JSON):</label>
                <textarea id="jwtPayload" rows="7" readonly style="font-family:monospace; margin-bottom:1rem; width:100%;"></textarea>

                <div id="jwtMeta" style="font-size:0.85rem; color:var(--text-secondary);"></div>
            </div>
        </div>
    `;

    const input = container.querySelector('#jwtInput');
    const decodeBtn = container.querySelector('#decodeJwtBtn');
    const resultDiv = container.querySelector('#jwtResult');
    const headerOut = container.querySelector('#jwtHeader');
    const payloadOut = container.querySelector('#jwtPayload');
    const metaOut = container.querySelector('#jwtMeta');

    decodeBtn.onclick = () => {
        const token = input.value.trim();
        if (!token) {
            showAlert('Please paste a JWT token.', 'error');
            return;
        }

        try {
            const parts = token.split('.');
            if (parts.length < 2) {
                showAlert('Invalid JWT format. A valid JWT token has at least 2 parts (Header.Payload) separated by dots.', 'error');
                return;
            }

            hideAlert();
            const headerStr = base64UrlDecodeUtf8(parts[0]);
            const payloadStr = base64UrlDecodeUtf8(parts[1]);

            const parsedHeader = JSON.parse(headerStr);
            const parsedPayload = JSON.parse(payloadStr);

            headerOut.value = JSON.stringify(parsedHeader, null, 2);
            payloadOut.value = JSON.stringify(parsedPayload, null, 2);

            let metaHtml = '';
            if (parsedPayload.exp) {
                const expDate = new Date(parsedPayload.exp * 1000);
                const isExpired = Date.now() > expDate.getTime();
                metaHtml += `<p><strong>Expires At (exp):</strong> ${expDate.toUTCString()} ${isExpired ? '<span style="color:#ef4444;">(Expired)</span>' : '<span style="color:#22c55e;">(Active)</span>'}</p>`;
            }
            if (parsedPayload.iat) {
                const iatDate = new Date(parsedPayload.iat * 1000);
                metaHtml += `<p><strong>Issued At (iat):</strong> ${iatDate.toUTCString()}</p>`;
            }
            metaOut.innerHTML = metaHtml;

            resultDiv.style.display = 'block';
            showAlert('JWT successfully decoded!', 'success');
        } catch (err) {
            console.error(err);
            showAlert('Error decoding JWT token. Ensure the token is valid Base64URL and contains valid JSON.', 'error');
        }
    };
};
