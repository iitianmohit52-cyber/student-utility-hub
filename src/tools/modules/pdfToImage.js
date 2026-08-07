import { showAlert, hideAlert } from '../../utils/alerts.js';

const loadPdfJs = async () => {
    if (window.pdfjsLib) return window.pdfjsLib;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve(window.pdfjsLib);
        };
        script.onerror = () => reject(new Error('Failed to load PDF rendering library'));
        document.head.appendChild(script);
    });
};

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="pdfToImgFile">Select PDF File:</label>
            <input type="file" id="pdfToImgFile" accept="application/pdf">

            <label for="imgFormatSelect" style="margin-top:1rem;">Output Image Format:</label>
            <select id="imgFormatSelect">
                <option value="image/png">PNG Format</option>
                <option value="image/jpeg">JPG Format</option>
            </select>

            <button id="renderPdfToImgBtn" style="margin-top:1.2rem;">🖼️ Convert PDF to Images</button>
            <div id="pdfToImgResult" class="result-area" style="display:none;"></div>
        </div>
    `;

    const fileInput = container.querySelector('#pdfToImgFile');
    const formatSelect = container.querySelector('#imgFormatSelect');
    const convertBtn = container.querySelector('#renderPdfToImgBtn');
    const resultDiv = container.querySelector('#pdfToImgResult');

    convertBtn.onclick = async () => {
        const file = fileInput.files[0];
        const format = formatSelect.value;
        const ext = format === 'image/png' ? 'png' : 'jpg';

        if (!file) {
            showAlert('Please select a PDF file.', 'error');
            return;
        }

        try {
            convertBtn.disabled = true;
            convertBtn.textContent = 'Rendering PDF Pages...';
            hideAlert();

            const pdfjsLib = await loadPdfJs();
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            resultDiv.innerHTML = `<p style="font-weight:600; margin-bottom:1rem; color:var(--accent-color);">Generated Page Images (${pdf.numPages} Page(s)):</p><div id="pageImagesGrid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:1rem;"></div>`;
            const grid = resultDiv.querySelector('#pageImagesGrid');
            resultDiv.style.display = 'block';

            for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: ctx, viewport: viewport }).promise;

                const imgUrl = canvas.toDataURL(format, 0.9);
                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'background:var(--surface-color); padding:0.5rem; border-radius:8px; border:1px solid var(--tool-card-border); text-align:center;';
                wrapper.innerHTML = `
                    <img src="${imgUrl}" style="max-width:100%; border-radius:4px; margin-bottom:0.5rem;" alt="Page ${pageNum}">
                    <a href="${imgUrl}" download="page-${pageNum}.${ext}" class="tool-button" style="padding:0.4rem 0.6rem; font-size:0.8rem; text-decoration:none;">📥 Page ${pageNum}</a>
                `;
                grid.appendChild(wrapper);
            }
        } catch (err) {
            console.error(err);
            showAlert('Error rendering PDF to images.', 'error');
        } finally {
            convertBtn.disabled = false;
            convertBtn.textContent = '🖼️ Convert PDF to Images';
        }
    };
};
