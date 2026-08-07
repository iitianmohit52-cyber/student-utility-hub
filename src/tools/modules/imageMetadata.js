import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';

const loadExifLib = async () => {
    if (window.EXIF) return window.EXIF;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.min.js';
        script.onload = () => resolve(window.EXIF);
        script.onerror = () => reject(new Error('Failed to load EXIF library'));
        document.head.appendChild(script);
    });
};

export default createTool('imageMetadata', ({ container, showAlert, hideAlert }) => {
    let selectedFile = null;

    const fileInput = createInput({
        id: 'imageFile',
        type: 'file',
        label: 'Select Image File (JPEG/TIFF for EXIF data):',
        required: true,
        onChange: (val, e) => {
            selectedFile = e.target.files[0];
        }
    });
    fileInput.querySelector('input').accept = 'image/jpeg, image/tiff';

    const viewBtn = createButton({
        id: 'viewMetadataBtn',
        text: 'View Metadata / EXIF',
        icon: 'ℹ️',
        onClick: () => viewMetadata()
    });

    const resultBox = createResultBox({
        id: 'metadataResult',
        title: 'EXIF Metadata Output'
    });

    const layout = createToolLayout({
        inputs: [fileInput],
        actions: [viewBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const viewMetadata = async () => {
        if (!selectedFile) {
            showAlert('Please select an image file first.', 'error');
            return;
        }

        try {
            viewBtn.disabled = true;
            viewBtn.textContent = 'Reading EXIF...';
            hideAlert();

            const EXIF = await loadExifLib();

            EXIF.getData(selectedFile, function() {
                const allMetadata = EXIF.getAllTags(this);
                
                if (!allMetadata || Object.keys(allMetadata).length === 0) {
                    resultBox.update(`
                        <p style="color:var(--warning-color); text-align:center; font-weight:600;">
                            ⚠️ No EXIF metadata tags found in this image.
                        </p>
                        <p style="text-align:center; font-size:0.85rem; color:var(--text-secondary);">
                            Most messaging apps and websites strip EXIF metadata to protect privacy. Try uploading an original photo taken directly on your device.
                        </p>
                    `);
                    return;
                }

                // Render EXIF data in a clean key-value table
                let tableHtml = `
                    <table style="width:100%; border-collapse: collapse; margin-top:1rem; font-size:0.9rem;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--tool-card-border); text-align:left;">
                                <th style="padding: 0.5rem; color: var(--primary-color);">Tag Name</th>
                                <th style="padding: 0.5rem; color: var(--primary-color);">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                for (const [key, val] of Object.entries(allMetadata)) {
                    if (typeof val === 'object' && val !== null) continue; // skip nested complex objects
                    tableHtml += `
                        <tr style="border-bottom: 1px solid var(--tool-card-border);">
                            <td style="padding: 0.5rem; font-weight: 500; color: var(--text-primary);">${key}</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary); word-break: break-all;">${val}</td>
                        </tr>
                    `;
                }

                tableHtml += `</tbody></table>`;
                resultBox.update(tableHtml);
            });
        } catch (err) {
            console.error(err);
            showAlert('Error reading metadata from image.', 'error');
        } finally {
            viewBtn.disabled = false;
            viewBtn.textContent = 'View Metadata / EXIF';
        }
    };
});
