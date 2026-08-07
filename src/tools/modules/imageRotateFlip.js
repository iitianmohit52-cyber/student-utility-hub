import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';

export default createTool('imageRotateFlip', ({ container, showAlert, hideAlert }) => {
    let selectedFile = null;
    let rotation = 0; // 0, 90, 180, 270
    let flipH = false;
    let flipV = false;
    let canvas = null;
    let ctx = null;
    let originalImage = null;

    const fileInput = createInput({
        id: 'imageFile',
        type: 'file',
        label: 'Select Image File:',
        required: true,
        onChange: (val, e) => {
            selectedFile = e.target.files[0];
            loadImage();
        }
    });
    fileInput.querySelector('input').accept = 'image/*';

    const rotateLBtn = createButton({
        text: 'Rotate Left ↺',
        variant: 'secondary',
        onClick: () => {
            rotation = (rotation - 90 + 360) % 360;
            applyTransforms();
        }
    });

    const rotateRBtn = createButton({
        text: 'Rotate Right ↻',
        variant: 'secondary',
        onClick: () => {
            rotation = (rotation + 90) % 360;
            applyTransforms();
        }
    });

    const flipHBtn = createButton({
        text: 'Flip Horizontal ↔',
        variant: 'secondary',
        onClick: () => {
            flipH = !flipH;
            applyTransforms();
        }
    });

    const flipVBtn = createButton({
        text: 'Flip Vertical ↕',
        variant: 'secondary',
        onClick: () => {
            flipV = !flipV;
            applyTransforms();
        }
    });

    const downloadBtn = createButton({
        id: 'downloadImageBtn',
        text: 'Download Transformed Image',
        icon: '🔄',
        onClick: () => downloadTransformed()
    });

    const resultBox = createResultBox({
        id: 'imageResult',
        title: 'Preview Output'
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
        inputs: [fileInput, rotateLBtn, rotateRBtn, flipHBtn, flipVBtn, canvasContainer],
        actions: [downloadBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const loadImage = () => {
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.onload = () => {
                rotation = 0;
                flipH = false;
                flipV = false;
                applyTransforms();
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    };

    const applyTransforms = () => {
        if (!originalImage) return;

        // Calculate output canvas size based on rotation
        const isSwapped = rotation === 90 || rotation === 270;
        const outWidth = isSwapped ? originalImage.naturalHeight : originalImage.naturalWidth;
        const outHeight = isSwapped ? originalImage.naturalWidth : originalImage.naturalHeight;

        canvas.width = outWidth;
        canvas.height = outHeight;

        ctx.save();
        
        // Translate context to center to allow rotation & flipping
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);
        
        // Apply flipping
        const scaleX = flipH ? -1 : 1;
        const scaleY = flipV ? -1 : 1;
        ctx.scale(scaleX, scaleY);
        
        // Draw the image centered
        ctx.drawImage(originalImage, -originalImage.naturalWidth / 2, -originalImage.naturalHeight / 2);
        
        ctx.restore();
        resultBox.update(`<p style="color:var(--success-color); text-align:center; font-weight:600;">✅ Transformations preview applied!</p>`);
    };

    const downloadTransformed = () => {
        if (!originalImage) {
            showAlert('Please select an image first.', 'error');
            return;
        }
        
        const dataUrl = canvas.toDataURL(selectedFile.type);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `transformed_${selectedFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
});
