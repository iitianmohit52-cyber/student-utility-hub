import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';

export default createTool('imageBackgroundRemover', ({ container, showAlert, hideAlert }) => {
    let selectedFile = null;
    let tolerance = 30;
    let targetColor = { r: 255, g: 255, b: 255 }; // Default to white
    let canvas = null;
    let ctx = null;
    let originalImage = null;

    const fileInput = createInput({
        id: 'imageFile',
        type: 'file',
        label: 'Select Image:',
        required: true,
        onChange: (val, e) => {
            selectedFile = e.target.files[0];
            loadImage();
        }
    });
    fileInput.querySelector('input').accept = 'image/*';

    const toleranceInput = createInput({
        id: 'tolerance',
        type: 'range',
        label: 'Color Tolerance (adjust to remove more/less background):',
        value: '30',
        min: 0,
        max: 100,
        onChange: (val) => {
            tolerance = parseInt(val) || 30;
            processBackground();
        }
    });

    const removeBtn = createButton({
        id: 'removeBgBtn',
        text: 'Download Transparent PNG',
        icon: '🧼',
        onClick: () => downloadTransparentImage()
    });

    const resultBox = createResultBox({
        id: 'imageResult',
        title: 'Preview Transparent Image'
    });

    // Custom Canvas Preview Container
    const canvasContainer = document.createElement('div');
    canvasContainer.style.textAlign = 'center';
    canvasContainer.style.marginTop = '1.5rem';
    canvasContainer.style.overflow = 'auto';
    
    canvas = document.createElement('canvas');
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '400px';
    canvas.style.border = '1px dashed var(--tool-card-border)';
    canvas.style.backgroundImage = 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)';
    canvas.style.backgroundSize = '20px 20px';
    canvas.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
    canvasContainer.appendChild(canvas);
    ctx = canvas.getContext('2d');

    // Click on canvas to pick background color to remove
    canvas.addEventListener('click', (e) => {
        if (!originalImage) return;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
        const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(originalImage, 0, 0);
        
        const pixel = tempCtx.getImageData(x, y, 1, 1).data;
        targetColor = { r: pixel[0], g: pixel[1], b: pixel[2] };
        processBackground();
    });

    const layout = createToolLayout({
        inputs: [fileInput, toleranceInput, canvasContainer],
        actions: [removeBtn],
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
                ctx.drawImage(originalImage, 0, 0);
                
                // Automatically pick the top-left pixel color as target background color
                const pixel = ctx.getImageData(0, 0, 1, 1).data;
                targetColor = { r: pixel[0], g: pixel[1], b: pixel[2] };
                
                processBackground();
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    };

    const processBackground = () => {
        if (!originalImage) return;
        
        // Reset to original image
        ctx.drawImage(originalImage, 0, 0);
        
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        
        const t = tolerance * 2.55; // Normalize tolerance slider (0-100 to 0-255)
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calculate Euclidean distance between colors
            const diff = Math.sqrt(
                Math.pow(r - targetColor.r, 2) +
                Math.pow(g - targetColor.g, 2) +
                Math.pow(b - targetColor.b, 2)
            );
            
            if (diff <= t) {
                data[i + 3] = 0; // Set alpha to transparent
            }
        }
        
        ctx.putImageData(imgData, 0, 0);
        resultBox.update(`<p style="color:var(--text-secondary); text-align:center; font-size:0.9rem;">💡 Click on the image to select the color you want to remove.</p>`);
    };

    const downloadTransparentImage = () => {
        if (!originalImage) {
            showAlert('Please load an image first.', 'error');
            return;
        }
        
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `transparent_${selectedFile.name.replace(/\.[^/.]+$/, "")}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
});
