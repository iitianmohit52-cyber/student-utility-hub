import { createTool } from '../core/ToolFactory.js';
import { createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';

const loadPdfLib = async () => {
    if (window.PDFLib) return window.PDFLib;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
        script.onload = () => resolve(window.PDFLib);
        script.onerror = () => reject(new Error('Failed to load PDF library'));
        document.head.appendChild(script);
    });
};

export default createTool('screenshotToPdf', ({ container, showAlert, hideAlert }) => {
    let imagesList = [];

    // Drag-and-drop or Upload box
    const uploadBox = document.createElement('div');
    uploadBox.style.border = '2px dashed var(--tool-card-border)';
    uploadBox.style.borderRadius = 'var(--radius-lg)';
    uploadBox.style.padding = '2rem';
    uploadBox.style.textAlign = 'center';
    uploadBox.style.cursor = 'pointer';
    uploadBox.style.background = 'var(--surface-elevated)';
    uploadBox.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📸</div>
        <p style="margin:0 0 0.5rem 0; font-weight:600; color:var(--text-primary);">Paste Screenshot (Ctrl + V) or Click to Upload</p>
        <p style="margin:0; font-size:0.8rem; color:var(--text-secondary);">Supports PNG, JPG, WEBP, and Clipboard Pastes. Combine multiple images.</p>
        <input type="file" id="screenshotFiles" accept="image/*" multiple style="display:none;">
    `;
    const hiddenFileInput = uploadBox.querySelector('#screenshotFiles');

    uploadBox.addEventListener('click', () => {
        hiddenFileInput.click();
    });

    hiddenFileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        addImages(files);
    });

    // Clipboard Paste Listener
    const handlePaste = (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        
        const files = [];
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) files.push(file);
            }
        }
        if (files.length > 0) {
            addImages(files);
            showAlert('Screenshot pasted successfully from clipboard!', 'success');
        }
    };
    
    document.addEventListener('paste', handlePaste);

    // Dynamic Preview Grid of screenshots
    const previewGrid = document.createElement('div');
    previewGrid.style.display = 'grid';
    previewGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
    previewGrid.style.gap = '1rem';
    previewGrid.style.marginTop = '1.5rem';

    const addImages = (files) => {
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagesList.push({
                    name: file.name || `screenshot_${Date.now()}.png`,
                    dataUrl: e.target.result,
                    type: file.type || 'image/png'
                });
                renderPreviews();
            };
            reader.readAsDataURL(file);
        });
    };

    const renderPreviews = () => {
        previewGrid.innerHTML = '';
        imagesList.forEach((img, idx) => {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.border = '1px solid var(--tool-card-border)';
            wrapper.style.borderRadius = 'var(--radius-md)';
            wrapper.style.overflow = 'hidden';
            wrapper.style.height = '100px';

            const previewImg = document.createElement('img');
            previewImg.src = img.dataUrl;
            previewImg.style.width = '100%';
            previewImg.style.height = '100%';
            previewImg.style.objectFit = 'cover';
            wrapper.appendChild(previewImg);

            // Delete button
            const delBtn = document.createElement('button');
            delBtn.textContent = '✕';
            delBtn.style.position = 'absolute';
            delBtn.style.top = '5px';
            delBtn.style.right = '5px';
            delBtn.style.background = 'rgba(0,0,0,0.7)';
            delBtn.style.color = 'white';
            delBtn.style.border = 'none';
            delBtn.style.borderRadius = '50%';
            delBtn.style.width = '20px';
            delBtn.style.height = '20px';
            delBtn.style.cursor = 'pointer';
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                imagesList.splice(idx, 1);
                renderPreviews();
            });
            wrapper.appendChild(delBtn);
            previewGrid.appendChild(wrapper);
        });
    };

    const compileBtn = createButton({
        id: 'compilePdfBtn',
        text: 'Generate PDF',
        icon: '📄',
        onClick: () => compilePdf()
    });

    const resultBox = createResultBox({
        id: 'pdfResult',
        title: 'Compiled PDF Output'
    });

    const layout = createToolLayout({
        inputs: [uploadBox, previewGrid],
        actions: [compileBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const compilePdf = async () => {
        if (imagesList.length === 0) {
            showAlert('Please paste or upload at least one screenshot first.', 'error');
            return;
        }

        try {
            compileBtn.disabled = true;
            compileBtn.textContent = 'Generating PDF...';
            hideAlert();

            const { PDFDocument } = await loadPdfLib();
            const pdfDoc = await PDFDocument.create();

            for (const imgItem of imagesList) {
                // Safely load and convert image to raster JPEG bytes using canvas
                const img = new Image();
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = imgItem.dataUrl;
                });

                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth || img.width || 800;
                canvas.height = img.naturalHeight || img.height || 600;
                const ctx = canvas.getContext('2d');

                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);
                const base64Data = jpegDataUrl.split(',')[1];
                const binaryString = atob(base64Data);
                const jpegBytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    jpegBytes[i] = binaryString.charCodeAt(i);
                }

                const embeddedImage = await pdfDoc.embedJpg(jpegBytes);
                const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
                page.drawImage(embeddedImage, {
                    x: 0,
                    y: 0,
                    width: embeddedImage.width,
                    height: embeddedImage.height
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            resultBox.update(`
                <div style="text-align: center;">
                    <p style="color:var(--success-color); font-weight:600; margin-bottom:1rem;">✅ PDF Compiled from ${imagesList.length} Screenshot(s)!</p>
                    <a href="${url}" download="screenshot_compilation.pdf" class="primary-button" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download PDF Document</a>
                </div>
            `);
            showAlert('PDF compiled successfully!', 'success');
        } catch (err) {
            console.error(err);
            showAlert('Error generating PDF from screenshots.', 'error');
        } finally {
            compileBtn.disabled = false;
            compileBtn.textContent = 'Generate PDF';
        }
    };

    window.currentToolCleanup = () => {
        document.removeEventListener('paste', handlePaste);
    };
});
