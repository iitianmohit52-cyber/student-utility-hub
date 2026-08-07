import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox, createSelect } from '../../components/ui/index.js';

export default createTool('imageWatermark', ({ container, showAlert, hideAlert }) => {
    let selectedFile = null;
    let watermarkText = 'Student Utility Hub';
    let watermarkOpacity = 0.5;
    let watermarkColor = '#ffffff';
    let watermarkPosition = 'center'; // 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'tile'
    let canvas = null;
    let ctx = null;
    let originalImage = null;

    const fileInput = createInput({
        id: 'imageFile',
        type: 'file',
        label: 'Select Image to Watermark:',
        required: true,
        onChange: (val, e) => {
            selectedFile = e.target.files[0];
            loadImage();
        }
    });
    fileInput.querySelector('input').accept = 'image/*';

    const textInput = createInput({
        id: 'watermarkText',
        type: 'text',
        label: 'Watermark Text:',
        value: 'Student Utility Hub',
        onChange: (val) => {
            watermarkText = val;
            applyWatermark();
        }
    });

    const opacityInput = createInput({
        id: 'watermarkOpacity',
        type: 'range',
        label: 'Watermark Opacity:',
        value: '50',
        min: 0,
        max: 100,
        onChange: (val) => {
            watermarkOpacity = (parseInt(val) || 50) / 100;
            applyWatermark();
        }
    });

    const colorInput = createInput({
        id: 'watermarkColor',
        type: 'color',
        label: 'Watermark Color:',
        value: '#ffffff',
        onChange: (val) => {
            watermarkColor = val;
            applyWatermark();
        }
    });

    const positionSelect = createSelect({
        id: 'watermarkPosition',
        label: 'Position:',
        options: [
            { value: 'center', label: 'Center' },
            { value: 'top-left', label: 'Top Left' },
            { value: 'top-right', label: 'Top Right' },
            { value: 'bottom-left', label: 'Bottom Left' },
            { value: 'bottom-right', label: 'Bottom Right' },
            { value: 'tile', label: 'Tile / Repeated' }
        ],
        onChange: (val) => {
            watermarkPosition = val;
            applyWatermark();
        }
    });

    const saveBtn = createButton({
        id: 'saveWatermarkBtn',
        text: 'Download Watermarked Image',
        icon: '💧',
        onClick: () => downloadWatermarked()
    });

    const resultBox = createResultBox({
        id: 'imageResult',
        title: 'Preview Watermark'
    });

    const canvasContainer = document.createElement('div');
    canvasContainer.style.textAlign = 'center';
    canvasContainer.style.marginTop = '1.5rem';
    
    canvas = document.createElement('canvas');
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '400px';
    canvas.style.border = '1px solid var(--tool-card-border)';
    canvasContainer.appendChild(canvas);
    ctx = canvas.getContext('2d');

    const layout = createToolLayout({
        inputs: [fileInput, textInput, opacityInput, colorInput, positionSelect, canvasContainer],
        actions: [saveBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const loadImage = () => {
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.onload = () => {
                canvas.width = originalImage.naturalWidth;
                canvas.height = originalImage.naturalHeight;
                applyWatermark();
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    };

    const applyWatermark = () => {
        if (!originalImage) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(originalImage, 0, 0);

        ctx.save();
        ctx.globalAlpha = watermarkOpacity;
        ctx.fillStyle = watermarkColor;
        
        // Dynamic Font Sizing based on image width
        const fontSize = Math.max(16, Math.floor(canvas.width / 25));
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textBaseline = 'middle';

        const textMetrics = ctx.measureText(watermarkText);
        const textWidth = textMetrics.width;
        const padding = 20;

        if (watermarkPosition === 'center') {
            ctx.textAlign = 'center';
            ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2);
        } else if (watermarkPosition === 'top-left') {
            ctx.textAlign = 'left';
            ctx.fillText(watermarkText, padding, padding + fontSize / 2);
        } else if (watermarkPosition === 'top-right') {
            ctx.textAlign = 'right';
            ctx.fillText(watermarkText, canvas.width - padding, padding + fontSize / 2);
        } else if (watermarkPosition === 'bottom-left') {
            ctx.textAlign = 'left';
            ctx.fillText(watermarkText, padding, canvas.height - padding - fontSize / 2);
        } else if (watermarkPosition === 'bottom-right') {
            ctx.textAlign = 'right';
            ctx.fillText(watermarkText, canvas.width - padding, canvas.height - padding - fontSize / 2);
        } else if (watermarkPosition === 'tile') {
            ctx.textAlign = 'left';
            const stepX = textWidth + 100;
            const stepY = fontSize + 150;
            for (let x = 0; x < canvas.width; x += stepX) {
                for (let y = 0; y < canvas.height; y += stepY) {
                    ctx.fillText(watermarkText, x, y);
                }
            }
        }

        ctx.restore();
        resultBox.update(`<p style="color:var(--success-color); text-align:center; font-weight:600;">✅ Watermark applied correctly!</p>`);
    };

    const downloadWatermarked = () => {
        if (!originalImage) {
            showAlert('Please select an image first.', 'error');
            return;
        }
        
        const dataUrl = canvas.toDataURL(selectedFile.type);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `watermarked_${selectedFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
});
