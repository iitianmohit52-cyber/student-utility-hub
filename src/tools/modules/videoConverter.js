import { showAlert, hideAlert } from '../../utils/alerts.js';
import { isSafeFile } from '../../utils/validate.js';
import { escapeHTML } from '../../utils/sanitize.js';

export default (container) => {
    container.innerHTML = `
        <p>This tool attempts to convert playable videos to MP4 or WebM by re-encoding using MediaRecorder. Success and output quality depend on browser capabilities.</p>
        <input type="file" id="vidConvFile" accept="video/*">
        <label for="vidConvFormat">Convert to:</label>
        <select id="vidConvFormat">
            <option value="video/webm;codecs=vp8,opus">WebM (VP8/Opus)</option>
            <option value="video/webm;codecs=vp9,opus">WebM (VP9/Opus - better quality)</option>
            <option value="video/mp4;codecs=avc1.42E01E,mp4a.40.2">MP4 (H.264/AAC - browser support varies)</option>
        </select>
        <button id="vidConvButton">Convert & Download</button>
        <video id="vidConvPreview" controls style="max-width:100%; margin-top:10px; display:none; background-color:black;"></video>
        <p id="vidConvStatus" class="result-area" style="display:none;"></p>
    `;
    const fileInput = container.querySelector('#vidConvFile');
    const formatSelect = container.querySelector('#vidConvFormat');
    const convertButton = container.querySelector('#vidConvButton');
    const videoPreview = container.querySelector('#vidConvPreview');
    const statusP = container.querySelector('#vidConvStatus');
    let mediaRecorder;
    let recordedChunks = [];
    let originalFileName = 'converted_video';

    fileInput.onchange = (e) => {
        recordedChunks = [];
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
        }
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            if (!isSafeFile(file, null, 500)) { // up to 500MB for video
                showAlert('Invalid file or too large (Max 500MB).', 'error');
                fileInput.value = '';
                return;
            }

            originalFileName = file.name.split('.')[0] || 'video';
            const url = URL.createObjectURL(file);
            videoPreview.src = url;
            videoPreview.style.display = 'block';
            videoPreview.onloadedmetadata = () => {
                showAlert(`Video loaded. Duration: ${videoPreview.duration.toFixed(2)}s. Ready to convert.`, 'info');
                statusP.style.display = 'none';
            }
            videoPreview.onerror = () => showAlert('Error loading video. It might be an unsupported format.', 'error');
        } else {
            videoPreview.style.display = 'none';
            videoPreview.src = "";
        }
    };

    convertButton.onclick = () => {
        if (!videoPreview.src || !videoPreview.src.startsWith('blob:')) {
            showAlert('Please select a video file first.', 'error');
            return;
        }

        const targetMimeType = formatSelect.value;
        if (!MediaRecorder.isTypeSupported(targetMimeType)) {
            showAlert(`Your browser does not support recording to ${targetMimeType}. Try another format or browser.`, 'error');
            return;
        }

        showAlert('Starting conversion... The video will play. Do not close modal.', 'info');
        statusP.textContent = 'Conversion in progress... 0%';
        statusP.style.display = 'block';
        
        videoPreview.currentTime = 0;
        
        const stream = videoPreview.captureStream ? videoPreview.captureStream() : videoPreview.mozCaptureStream ? videoPreview.mozCaptureStream() : null;

        if (!stream) {
            showAlert('Could not capture video stream. Your browser might not support this feature.', 'error');
            return;
        }

        recordedChunks = [];
        try {
            mediaRecorder = new MediaRecorder(stream, { mimeType: targetMimeType });
        } catch (err) {
             showAlert(`Error initializing MediaRecorder with ${targetMimeType}: ${err.message}.`, 'error');
             return;
        }

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            if (recordedChunks.length === 0) {
                showAlert('Conversion stopped, but no data was recorded.', 'error');
                statusP.textContent = 'Conversion failed: No data.';
                return;
            }
            const blob = new Blob(recordedChunks, { type: targetMimeType.split(';')[0] }); 
            const url = URL.createObjectURL(blob);
            const safeBaseName = originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
            const fileExt = targetMimeType.includes('mp4') ? 'mp4' : 'webm';
            a.download = `${safeBaseName}_converted.${fileExt}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showAlert('Video conversion finished!', 'success');
            statusP.textContent = 'Conversion complete!';
            videoPreview.pause();
        };
        
        mediaRecorder.onerror = (event) => {
            showAlert(`MediaRecorder error: ${event.error ? event.error.name : 'Unknown error'}.`, 'error');
            statusP.textContent = `Error: ${event.error ? event.error.name : 'Unknown'}`;
            videoPreview.pause();
        };
        
        videoPreview.onended = () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
        };
        
        videoPreview.ontimeupdate = () => {
            if (videoPreview.duration && mediaRecorder && mediaRecorder.state === 'recording') {
                const progress = (videoPreview.currentTime / videoPreview.duration) * 100;
                statusP.textContent = `Conversion in progress... ${progress.toFixed(0)}%`;
            }
        };

        videoPreview.play().then(() => {
            mediaRecorder.start(1000); 
        }).catch(err => {
            showAlert(`Error playing video for conversion: ${err.message}`, 'error');
            statusP.textContent = `Error: ${err.message}`;
        });
    };
    
    window.currentToolCleanup = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
        if(videoPreview) videoPreview.pause();
        if (videoPreview && videoPreview.src && videoPreview.src.startsWith('blob:')) {
            URL.revokeObjectURL(videoPreview.src);
        }
    };
};
