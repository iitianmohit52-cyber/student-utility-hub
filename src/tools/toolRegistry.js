const rawTools = [
    // --- PDF TOOLS ---
    { id: 'pdfMerge', name: 'PDF Merger', category: 'pdf', icon: '📄', description: 'Combine multiple PDF documents into a single PDF file.', keywords: ['pdf', 'merge', 'combine', 'join'] },
    { id: 'pdfSplit', name: 'PDF Splitter', category: 'pdf', icon: '✂️', description: 'Extract pages or split PDF documents into separate files.', keywords: ['pdf', 'split', 'extract', 'divide', 'separate'] },
    { id: 'pdfToImage', name: 'PDF to Image', category: 'pdf', icon: '🖼️', description: 'Convert PDF pages into high-quality JPG or PNG images.', keywords: ['pdf', 'image', 'convert', 'jpg', 'png', 'extract'] },
    { id: 'imageToPdf', name: 'Image to PDF', category: 'pdf', icon: '📸', description: 'Convert images (JPG, PNG) into a compiled PDF document.', keywords: ['image', 'pdf', 'convert', 'compile', 'jpg', 'png'] },
    { id: 'pdfWatermark', name: 'PDF Watermark', category: 'pdf', icon: '💧', description: 'Add text watermarks to your PDF pages easily.', keywords: ['pdf', 'watermark', 'stamp', 'text', 'protect'] },
    { id: 'pdfPageRotator', name: 'PDF Page Rotator', category: 'pdf', icon: '🔄', description: 'Rotate PDF pages (90°, 180°, 270°) and save.', keywords: ['pdf', 'rotate', 'turn', 'pages', 'orientation'] },
    { id: 'pdfCompress', name: 'PDF Compressor', category: 'pdf', icon: '🗜️', description: 'Reduce PDF file size online while preserving quality.', keywords: ['pdf', 'compress', 'reduce', 'size', 'optimize'] },
    { id: 'pdfUnlock', name: 'PDF Unlocker', category: 'pdf', icon: '🔓', description: 'Remove passwords, security, and restrictions from PDF files.', keywords: ['pdf', 'unlock', 'password', 'decrypt', 'security'] },
    { id: 'pdfProtect', name: 'PDF Protector', category: 'pdf', icon: '🔒', description: 'Encrypt and secure your PDF documents with a strong password.', keywords: ['pdf', 'protect', 'encrypt', 'password', 'security'] },
    { id: 'pdfSign', name: 'PDF Signer', category: 'pdf', icon: '✍️', description: 'Draw, upload, or type your signature to sign PDF documents online.', keywords: ['pdf', 'sign', 'signature', 'draw', 'digital'] },
    { id: 'pdfRemovePages', name: 'Remove PDF Pages', category: 'pdf', icon: '🗑️', description: 'Delete unwanted pages from your PDF file and save the rest.', keywords: ['pdf', 'remove', 'delete', 'pages', 'edit'] },

    // --- IMAGE TOOLS ---
    { id: 'imageConverter', name: 'Image Converter', category: 'image', icon: '🖼️', description: 'Convert images between JPG, PNG, and WEBP formats.', keywords: ['image', 'convert', 'format', 'jpg', 'png', 'webp'] },
    { id: 'imageCompressor', name: 'Image Compressor', category: 'image', icon: '🗜️', description: 'Reduce the file size of your images without quality loss.', keywords: ['image', 'compress', 'reduce', 'size', 'optimize'] },
    { id: 'imageCropper', name: 'Image Cropper', category: 'image', icon: '✂️', description: 'Crop your images with custom aspect ratios.', keywords: ['image', 'crop', 'cut', 'resize', 'ratio'] },
    { id: 'imageResizer', name: 'Image Resizer', category: 'image', icon: '📐', description: 'Resize image dimensions while preserving aspect ratio.', keywords: ['image', 'resize', 'scale', 'dimensions', 'width', 'height'] },
    { id: 'imageFilter', name: 'Image Filter Effects', category: 'image', icon: '🎨', description: 'Apply grayscale, sepia, blur, brightness, and contrast filters.', keywords: ['image', 'filter', 'effects', 'grayscale', 'sepia', 'blur', 'edit'] },
    { id: 'svgToPng', name: 'SVG to PNG Converter', category: 'image', icon: '⚡', description: 'Convert vector SVG files into PNG or JPG images.', keywords: ['svg', 'png', 'image', 'convert', 'vector', 'raster'] },
    { id: 'imageColorExtractor', name: 'Image Color Extractor', category: 'image', icon: '🖌️', description: 'Extract dominant color palettes and hex codes from images.', keywords: ['image', 'color', 'extract', 'palette', 'hex', 'rgb'] },
    { id: 'faviconGenerator', name: 'Favicon Generator', category: 'image', icon: '🔖', description: 'Generate multi-size favicons (16x16, 32x32, 180x180) from an image.', keywords: ['favicon', 'generator', 'icon', 'website', 'logo'] },
    { id: 'imageBackgroundRemover', name: 'Background Remover', category: 'image', icon: '🧼', description: 'Remove backgrounds from images and make them transparent client-side.', keywords: ['image', 'background', 'remover', 'transparent', 'nobg'] },
    { id: 'imageWatermark', name: 'Image Watermarker', category: 'image', icon: '💧', description: 'Add customizable text or image watermarks to your photos.', keywords: ['image', 'watermark', 'stamp', 'text', 'protect'] },
    { id: 'imageMetadata', name: 'Image Metadata Viewer', category: 'image', icon: 'ℹ️', description: 'View hidden EXIF metadata from your pictures like GPS, camera settings, etc.', keywords: ['image', 'exif', 'metadata', 'gps', 'camera', 'info'] },
    { id: 'imageRotateFlip', name: 'Image Rotate & Flip', category: 'image', icon: '🔄', description: 'Rotate, mirror, and flip images horizontally or vertically.', keywords: ['image', 'rotate', 'flip', 'mirror', 'turn'] },
    { id: 'screenshotToPdf', name: 'Screenshot to PDF', category: 'image', icon: '📸', description: 'Convert screenshot images or clipboard pastes directly into a PDF document.', keywords: ['screenshot', 'pdf', 'convert', 'clipboard', 'paste'] },

    // --- TEXT & CONTENT ---
    { id: 'qrCodeGenerator', name: 'QR Code Generator', category: 'text', icon: '📱', description: 'Generate QR codes from text, URLs, or Wi-Fi settings.', keywords: ['qr', 'code', 'generator', 'barcode', 'scan'] },
    { id: 'passwordGenerator', name: 'Password Generator', category: 'text', icon: '🔑', description: 'Create strong, secure, and random passwords.', keywords: ['password', 'generator', 'secure', 'random', 'strong'] },
    { id: 'wordCounter', name: 'Word Counter', category: 'text', icon: '📝', description: 'Count words, characters, sentences, and estimate reading time.', keywords: ['word', 'counter', 'characters', 'sentences', 'reading', 'time'] },
    { id: 'base64', name: 'Base64 Encoder/Decoder', category: 'text', icon: '🔄', description: 'Convert text to Base64 format and vice versa.', keywords: ['base64', 'encode', 'decode', 'convert', 'text'] },
    { id: 'jsonFormatter', name: 'JSON Formatter', category: 'text', icon: '{}', description: 'Format, minify, and validate JSON data structures.', keywords: ['json', 'formatter', 'minify', 'validate', 'beautify'] },
    { id: 'caseConverter', name: 'Case Converter', category: 'text', icon: '🔤', description: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, etc.', keywords: ['case', 'converter', 'uppercase', 'lowercase', 'titlecase', 'text'] },
    { id: 'diffChecker', name: 'Text Diff Checker', category: 'text', icon: '🔍', description: 'Compare two blocks of text line-by-line to spot differences.', keywords: ['diff', 'checker', 'compare', 'text', 'differences'] },
    { id: 'markdownPreviewer', name: 'Markdown Live Previewer', category: 'text', icon: '⬇️', description: 'Write Markdown with real-time rendered HTML preview.', keywords: ['markdown', 'previewer', 'html', 'editor', 'live'] },
    { id: 'loremIpsum', name: 'Lorem Ipsum Generator', category: 'text', icon: '📄', description: 'Generate placeholder text by paragraphs, words, or sentences.', keywords: ['lorem', 'ipsum', 'generator', 'placeholder', 'text'] },
    { id: 'slugGenerator', name: 'URL Slug Generator', category: 'text', icon: '🔗', description: 'Convert strings into clean, SEO-friendly URL slugs.', keywords: ['url', 'slug', 'generator', 'seo', 'clean', 'text'] },
    { id: 'textCleaner', name: 'Text Cleaner & Stripper', category: 'text', icon: '🧹', description: 'Strip HTML tags, extra line breaks, and whitespace from text.', keywords: ['text', 'cleaner', 'strip', 'html', 'whitespace', 'formatting'] },
    { id: 'textToSpeech', name: 'Text to Speech', category: 'text', icon: '🗣️', description: 'Convert written text into natural spoken audio.', keywords: ['text', 'speech', 'tts', 'audio', 'voice', 'read'] },
    { id: 'speechToText', name: 'Speech to Text', category: 'text', icon: '🎙️', description: 'Transcribe your voice into formatted text in real-time.', keywords: ['speech', 'text', 'stt', 'transcribe', 'voice', 'dictation'] },
    { id: 'duplicateLineRemover', name: 'Duplicate Line Remover', category: 'text', icon: '👯', description: 'Clean text by finding and removing duplicate lines instantly.', keywords: ['duplicate', 'lines', 'remove', 'cleaner', 'dedup'] },
    { id: 'textSorter', name: 'Text Sorter', category: 'text', icon: '📶', description: 'Sort text lines alphabetically, numerically, by length, or in reverse.', keywords: ['text', 'sort', 'sorter', 'lines', 'alphabetical'] },
    { id: 'reverseText', name: 'Reverse Text Generator', category: 'text', icon: '↩️', description: 'Reverse your text, words, letters, or paragraphs in one click.', keywords: ['text', 'reverse', 'invert', 'mirror', 'backwards'] },
    { id: 'randomTextGenerator', name: 'Random Text Generator', category: 'text', icon: '🎲', description: 'Generate random words, sentences, or paragraphs for placeholder copy.', keywords: ['text', 'generator', 'random', 'lorem', 'placeholder'] },
    { id: 'htmlEncoderDecoder', name: 'HTML Encoder & Decoder', category: 'text', icon: '🔣', description: 'Convert text to HTML entities or decode them back to plain text.', keywords: ['html', 'encode', 'decode', 'entities', 'convert'] },

    // --- DEVELOPER TOOLS ---
    { id: 'htmlFormatter', name: 'HTML Formatter & Minifier', category: 'developer', icon: '🌐', description: 'Beautify or compress HTML code markup.', keywords: ['html', 'formatter', 'minifier', 'beautify', 'code'] },
    { id: 'cssMinifier', name: 'CSS Minifier & Formatter', category: 'developer', icon: '🎨', description: 'Minify stylesheet code to optimize site performance.', keywords: ['css', 'minifier', 'formatter', 'beautify', 'code', 'styles'] },
    { id: 'jsFormatter', name: 'JS Formatter & Minifier', category: 'developer', icon: '📜', description: 'Beautify or minify JavaScript code snippets.', keywords: ['js', 'javascript', 'formatter', 'minifier', 'beautify', 'code'] },
    { id: 'jwtDecoder', name: 'JWT Token Decoder', category: 'developer', icon: '🔓', description: 'Decode and inspect JSON Web Token header and payload.', keywords: ['jwt', 'decoder', 'token', 'json', 'web', 'inspect'] },
    { id: 'hashGenerator', name: 'Hash Generator', category: 'developer', icon: '🔐', description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes.', keywords: ['hash', 'generator', 'md5', 'sha1', 'sha256', 'sha512', 'crypto'] },
    { id: 'urlEncoder', name: 'URL Encoder/Decoder', category: 'developer', icon: '🌐', description: 'Encode or decode strings for safe URL query parameters.', keywords: ['url', 'encoder', 'decoder', 'escape', 'query', 'params'] },
    { id: 'regexTester', name: 'Regex Tester & Evaluator', category: 'developer', icon: '🧪', description: 'Test regular expressions with real-time syntax matching.', keywords: ['regex', 'tester', 'evaluator', 'regular', 'expression', 'match'] },
    { id: 'colorPicker', name: 'Color Picker & Hex Converter', category: 'developer', icon: '🎨', description: 'Pick colors and convert HEX, RGB, HSL values.', keywords: ['color', 'picker', 'hex', 'rgb', 'hsl', 'converter'] },
    { id: 'uuidGenerator', name: 'UUID Generator', category: 'developer', icon: '🆔', description: 'Generate random UUID (v4) strings in bulk instantly.', keywords: ['uuid', 'guid', 'generator', 'random', 'unique'] },
    { id: 'timestampConverter', name: 'Timestamp Converter', category: 'developer', icon: '⏰', description: 'Convert Unix epoch timestamps to human-readable dates and vice versa.', keywords: ['timestamp', 'converter', 'epoch', 'unix', 'date'] },
    { id: 'sqlFormatter', name: 'SQL Formatter', category: 'developer', icon: '💾', description: 'Beautify, format, and align SQL queries automatically.', keywords: ['sql', 'formatter', 'format', 'beautify', 'sql-server'] },
    { id: 'xmlFormatter', name: 'XML Formatter', category: 'developer', icon: '📝', description: 'Format and pretty-print XML/HTML documents with custom indentation.', keywords: ['xml', 'formatter', 'format', 'pretty', 'beautify'] },
    { id: 'qrCodeScanner', name: 'QR Code Scanner', category: 'developer', icon: '📷', description: 'Scan QR codes from your webcam or uploaded image files.', keywords: ['qr', 'scanner', 'scan', 'reader', 'camera'] },

    // --- CALCULATORS ---
    { id: 'ageCalculator', name: 'Age Calculator', category: 'calculator', icon: '🎂', description: 'Calculate exact age in years, months, days, and hours.', keywords: ['age', 'calculator', 'years', 'months', 'days', 'birthday'] },
    { id: 'emiCalculator', name: 'EMI Loan Calculator', category: 'calculator', icon: '💰', description: 'Calculate monthly loan repayment and interest breakdown.', keywords: ['emi', 'loan', 'calculator', 'repayment', 'interest', 'finance'] },
    { id: 'sipCalculator', name: 'SIP Investment Calculator', category: 'calculator', icon: '📈', description: 'Estimate future wealth returns from monthly SIP investments.', keywords: ['sip', 'investment', 'calculator', 'returns', 'wealth', 'finance'] },
    { id: 'bmiCalculator', name: 'BMI Health Calculator', category: 'calculator', icon: '⚖️', description: 'Calculate Body Mass Index (BMI) and health category.', keywords: ['bmi', 'health', 'calculator', 'weight', 'height', 'fitness'] },
    { id: 'percentageCalculator', name: 'Percentage Calculator', category: 'calculator', icon: '📊', description: 'Calculate percentages, percent change, and proportions.', keywords: ['percentage', 'calculator', 'percent', 'change', 'proportion'] },
    { id: 'cgpaCalculator', name: 'CGPA to Percentage Calculator', category: 'calculator', icon: '🎓', description: 'Convert CGPA/GPA to percentage and grade points.', keywords: ['cgpa', 'percentage', 'calculator', 'gpa', 'grades', 'student'] },
    { id: 'discountCalculator', name: 'Discount & Sale Calculator', category: 'calculator', icon: '🏷️', description: 'Calculate final price, savings, and discounts.', keywords: ['discount', 'sale', 'calculator', 'price', 'savings', 'shopping'] },
    { id: 'compoundInterest', name: 'Compound Interest Calculator', category: 'calculator', icon: '💹', description: 'Compute compound interest with monthly or annual payouts.', keywords: ['compound', 'interest', 'calculator', 'finance', 'investment'] },
    { id: 'gpaCalculator', name: 'Semester GPA Calculator', category: 'calculator', icon: '📚', description: 'Calculate course GPA based on credit hours and grades.', keywords: ['gpa', 'semester', 'calculator', 'grades', 'student', 'university'] },
    { id: 'unitConverter', name: 'Unit Converter', category: 'calculator', icon: '📏', description: 'Convert length, weight, temperature, and volume units.', keywords: ['unit', 'converter', 'length', 'weight', 'temperature', 'volume'] },
    { id: 'gstCalculator', name: 'GST Calculator', category: 'calculator', icon: '💸', description: 'Calculate Goods and Services Tax (GST) inclusive or exclusive values.', keywords: ['gst', 'tax', 'calculator', 'exclusive', 'inclusive'] },
    { id: 'fuelCostCalculator', name: 'Fuel Cost Calculator', category: 'calculator', icon: '⛽', description: 'Calculate trip fuel costs and total consumption for your journeys.', keywords: ['fuel', 'cost', 'trip', 'calculator', 'mileage'] },
    { id: 'salaryCalculator', name: 'Salary Calculator', category: 'calculator', icon: '💵', description: 'Convert hourly wages to weekly, monthly, or annual salary and vice-versa.', keywords: ['salary', 'wage', 'calculator', 'hourly', 'income'] },
    { id: 'timeDurationCalculator', name: 'Time Duration Calculator', category: 'calculator', icon: '⌛', description: 'Calculate the precise duration of time between two dates or hours.', keywords: ['time', 'duration', 'date', 'calculator', 'hours'] },
    { id: 'scientificCalculator', name: 'Scientific Calculator', category: 'calculator', icon: '🧮', description: 'Advanced scientific calculator with trigonometric, log, and memory functions.', keywords: ['scientific', 'calculator', 'math', 'trig', 'science'] },

    // --- STUDENT UTILITIES ---
    { id: 'pomodoroTimer', name: 'Pomodoro Study Timer', category: 'student', icon: '🍅', description: 'Productivity study timer with work/break intervals.', keywords: ['pomodoro', 'timer', 'study', 'productivity', 'work', 'break'] },
    { id: 'citationGenerator', name: 'Citation Generator (APA/MLA)', category: 'student', icon: '📖', description: 'Generate APA, MLA, and Chicago citations for bibliographies.', keywords: ['citation', 'generator', 'apa', 'mla', 'chicago', 'bibliography'] },
    { id: 'gpaScaleConverter', name: 'GPA Scale Converter', category: 'student', icon: '🔄', description: 'Convert grades between 4.0, 5.0, and 10.0 GPA scales.', keywords: ['gpa', 'scale', 'converter', 'grades', 'student'] },
    { id: 'timer', name: 'Timer & Stopwatch', category: 'student', icon: '⏱️', description: 'Dual-function countdown timer and precise stopwatch.', keywords: ['timer', 'stopwatch', 'countdown', 'time', 'student'] },

    // --- AUDIO & VIDEO ---
    { id: 'videoConverter', name: 'Video Format Converter', category: 'media', icon: '🎬', description: 'Convert video files right inside your browser.', keywords: ['video', 'converter', 'format', 'media', 'mp4'] },
    { id: 'audioConverter', name: 'Audio Converter', category: 'media', icon: '🎵', description: 'Convert audio tracks to WAV and audio formats.', keywords: ['audio', 'converter', 'format', 'media', 'mp3', 'wav'] },
    { id: 'audioTrimmer', name: 'Audio Trimmer & Cutter', category: 'media', icon: '✂️', description: 'Trim and extract audio clips effortlessly.', keywords: ['audio', 'trimmer', 'cutter', 'clip', 'media', 'music'] }
];

// Search-Intent SEO Metadata Matrix for all 77 Active Tools
const toolIntentMetadata = {
    // --- PDF TOOLS ---
    pdfMerge: {
        seoTitle: 'Merge PDF Online Free – Combine Multiple PDF Files | Student Utility Hub',
        seoDescription: 'Combine multiple PDF documents into a single PDF file securely. Fast, free client-side PDF merger with custom page ordering and zero server uploads.'
    },
    pdfSplit: {
        seoTitle: 'Split PDF Online Free – Extract & Separate PDF Pages | Student Utility Hub',
        seoDescription: 'Extract specific pages or split PDF documents into separate files online. 100% private, instant browser-native PDF page splitter.'
    },
    pdfToImage: {
        seoTitle: 'PDF to Image Converter – Convert PDF Pages to JPG & PNG | Student Utility Hub',
        seoDescription: 'Convert PDF pages into high-resolution JPG or PNG images directly in your browser. Fast, free, and completely secure client-side extraction.'
    },
    imageToPdf: {
        seoTitle: 'Image to PDF Converter – Convert JPG & PNG to PDF | Student Utility Hub',
        seoDescription: 'Convert JPG, PNG, and WebP images into a compiled PDF document. Adjust margins, page orientation, and download your unified PDF instantly.'
    },
    pdfWatermark: {
        seoTitle: 'Add Watermark to PDF Online – Custom Text Stamp | Student Utility Hub',
        seoDescription: 'Add custom text watermarks to your PDF pages easily. Protect confidential documents with adjustable opacity, size, and rotation locally.'
    },
    pdfPageRotator: {
        seoTitle: 'Rotate PDF Pages Online – Change PDF Orientation (90°, 180°, 270°) | Student Utility Hub',
        seoDescription: 'Rotate individual or all PDF pages clockwise and counter-clockwise. Fix orientation and save your aligned PDF file in seconds.'
    },
    pdfCompress: {
        seoTitle: 'Compress PDF Online Free – Reduce PDF Size Securely | Student Utility Hub',
        seoDescription: 'Reduce PDF file size online while preserving document quality. Client-side PDF compressor that processes files locally with zero uploads.'
    },
    pdfUnlock: {
        seoTitle: 'Unlock PDF Online – Remove Password & Security Restrictions | Student Utility Hub',
        seoDescription: 'Remove passwords, printing restrictions, and security limits from PDF files in your browser. Safe, instant client-side PDF unlocker.'
    },
    pdfProtect: {
        seoTitle: 'Protect PDF Online – Encrypt PDF with Strong Password | Student Utility Hub',
        seoDescription: 'Encrypt and secure your PDF documents with standard password encryption. Keep sensitive academic and business records private.'
    },
    pdfSign: {
        seoTitle: 'Sign PDF Online Free – Add Digital Signature to PDF | Student Utility Hub',
        seoDescription: 'Draw, type, or upload your signature to sign PDF documents online for free. Fast, legally compliant client-side document signing.'
    },
    pdfRemovePages: {
        seoTitle: 'Remove Pages from PDF – Delete Unwanted PDF Pages Online | Student Utility Hub',
        seoDescription: 'Delete specific unwanted pages from your PDF file and save the clean document. Fast, interactive page selector with zero server uploads.'
    },

    // --- IMAGE TOOLS ---
    imageConverter: {
        seoTitle: 'Image Converter Online – Convert JPG, PNG, WebP Free | Student Utility Hub',
        seoDescription: 'Convert images between JPG, PNG, and WebP formats instantly. High-speed client-side image converter preserving high fidelity.'
    },
    imageCompressor: {
        seoTitle: 'Image Compressor Online – Reduce JPG, PNG & WebP Size | Student Utility Hub',
        seoDescription: 'Reduce image file size without visual quality loss. Multi-candidate compression supporting JPG, PNG, and modern WebP formats.'
    },
    imageCropper: {
        seoTitle: 'Image Cropper Online – Crop Photos with Custom Aspect Ratios | Student Utility Hub',
        seoDescription: 'Crop pictures online with freeform or fixed aspect ratios (1:1, 16:9, 4:3). Fast browser-based photo cropping tool with instant export.'
    },
    imageResizer: {
        seoTitle: 'Image Resizer Online – Resize Image Dimensions & Pixels | Student Utility Hub',
        seoDescription: 'Resize image dimensions in pixels or percentages while locking aspect ratio. Scale down photos for web upload limits safely.'
    },
    imageFilter: {
        seoTitle: 'Image Filter Effects – Apply Grayscale, Sepia, Blur & Contrast | Student Utility Hub',
        seoDescription: 'Apply photo filter effects including grayscale, vintage sepia, blur, brightness, and contrast adjustments in real time.'
    },
    svgToPng: {
        seoTitle: 'SVG to PNG Converter – Convert Vector SVG to High-Res PNG | Student Utility Hub',
        seoDescription: 'Convert vector SVG files into raster PNG or JPG images with custom resolution scaling. High-quality vector rendering in your browser.'
    },
    imageColorExtractor: {
        seoTitle: 'Image Color Palette Extractor – Get Dominant HEX & RGB Codes | Student Utility Hub',
        seoDescription: 'Extract dominant color palettes and HEX/RGB codes from any photo. Perfect for UI/UX designers and artists creating harmonious themes.'
    },
    faviconGenerator: {
        seoTitle: 'Favicon Generator Online – Generate 16x16, 32x32 & Apple Icons | Student Utility Hub',
        seoDescription: 'Generate multi-size website favicons (16x16, 32x32, 48x48, 180x180) from an image. Download standardized favicon assets in one click.'
    },
    imageBackgroundRemover: {
        seoTitle: 'Background Remover Online – Make Images Transparent Free | Student Utility Hub',
        seoDescription: 'Remove solid backgrounds from photos and create transparent PNG images client-side. Fast, free cutout tool with zero server latency.'
    },
    imageWatermark: {
        seoTitle: 'Watermark Images Online – Add Custom Logo & Text Stamp | Student Utility Hub',
        seoDescription: 'Add customizable text or logo watermarks to your photographs. Protect your portfolio and images from unauthorized distribution.'
    },
    imageMetadata: {
        seoTitle: 'Image EXIF Metadata Viewer – Inspect Camera & GPS Data | Student Utility Hub',
        seoDescription: 'Inspect hidden EXIF metadata from photographs including camera model, exposure settings, ISO, date, and geolocation coordinates.'
    },
    imageRotateFlip: {
        seoTitle: 'Rotate & Flip Image Online – Mirror Photos Horizontally/Vertically | Student Utility Hub',
        seoDescription: 'Rotate images by 90/180/270 degrees and flip photos horizontally or vertically. Fast client-side photo orientation editor.'
    },
    screenshotToPdf: {
        seoTitle: 'Screenshot to PDF Converter – Paste & Convert Images to PDF | Student Utility Hub',
        seoDescription: 'Convert clipboard screenshots or image files directly into a compiled PDF document. Ideal for compiling bug reports and study notes.'
    },

    // --- TEXT & CONTENT ---
    qrCodeGenerator: {
        seoTitle: 'QR Code Generator Online – Create Custom QR Codes for Free | Student Utility Hub',
        seoDescription: 'Generate scannable QR codes for URLs, text, Wi-Fi networks, and contact cards. Download high-resolution PNG QR images instantly.'
    },
    passwordGenerator: {
        seoTitle: 'Strong Password Generator – Create Secure Random Passwords | Student Utility Hub',
        seoDescription: 'Generate strong, uncrackable passwords using the Web Crypto API. Customize length, uppercase, lowercase, numbers, and special symbols.'
    },
    wordCounter: {
        seoTitle: 'Word Counter Online – Character Count, Words & Reading Time | Student Utility Hub',
        seoDescription: 'Count words, characters with/without spaces, sentences, paragraphs, and reading time in real time. Accurate Unicode text analyzer.'
    },
    base64: {
        seoTitle: 'Base64 Encoder & Decoder – UTF-8 Safe Text Conversion | Student Utility Hub',
        seoDescription: 'Encode text strings to Base64 format and decode Base64 back to plain text. Full UTF-8, emoji, and special character support.'
    },
    jsonFormatter: {
        seoTitle: 'JSON Formatter & Validator – Beautify, Minify & Inspect JSON | Student Utility Hub',
        seoDescription: 'Format, beautify, validate, and minify JSON data online. Features 2-space indentation, syntax highlighting, and instant error detection.'
    },
    caseConverter: {
        seoTitle: 'Case Converter Online – UPPERCASE, lowercase, Title Case, camelCase | Student Utility Hub',
        seoDescription: 'Convert text case between UPPERCASE, lowercase, Title Case, sentence case, camelCase, snake_case, and kebab-case in one click.'
    },
    diffChecker: {
        seoTitle: 'Text Diff Checker Online – Compare Text & Find Differences | Student Utility Hub',
        seoDescription: 'Compare two text blocks side-by-side or line-by-line to spot differences, additions, and deletions. Fast diff inspection tool.'
    },
    markdownPreviewer: {
        seoTitle: 'Markdown Live Previewer – Real-Time Markdown to HTML Editor | Student Utility Hub',
        seoDescription: 'Write GitHub-flavored Markdown with real-time rendered HTML preview. Includes copy HTML output and formatted text view.'
    },
    loremIpsum: {
        seoTitle: 'Lorem Ipsum Generator – Placeholder Dummy Text by Paragraphs | Student Utility Hub',
        seoDescription: 'Generate custom Lorem Ipsum placeholder text by paragraphs, sentences, or words for web design mockups and copy layout.'
    },
    slugGenerator: {
        seoTitle: 'URL Slug Generator – Create SEO-Friendly Clean URL Slugs | Student Utility Hub',
        seoDescription: 'Convert article titles and strings into clean, lowercase, hyphenated URL slugs optimized for SEO and readability.'
    },
    textCleaner: {
        seoTitle: 'Text Cleaner & HTML Stripper – Remove Tags & Extra Spaces | Student Utility Hub',
        seoDescription: 'Strip HTML tags, unwanted line breaks, and duplicate spaces from dirty copy. Clean formatted text for web publishing.'
    },
    textToSpeech: {
        seoTitle: 'Text to Speech Online – Natural Voice Audio Reader | Student Utility Hub',
        seoDescription: 'Convert written text into natural spoken speech using your browser native Web Speech API. Adjust voice, pitch, and speed.'
    },
    speechToText: {
        seoTitle: 'Speech to Text Online – Voice Dictation & Audio Transcription | Student Utility Hub',
        seoDescription: 'Transcribe spoken voice into formatted text in real-time. Fast browser-based voice dictation with zero audio recordings uploaded.'
    },
    duplicateLineRemover: {
        seoTitle: 'Duplicate Line Remover – Clean & Deduplicate Text Lists | Student Utility Hub',
        seoDescription: 'Find and remove duplicate lines from lists and data sets instantly. Features case-sensitivity controls and empty line removal.'
    },
    textSorter: {
        seoTitle: 'Text Sorter Online – Alphabetical, Numerical & Length Sorting | Student Utility Hub',
        seoDescription: 'Sort text lines alphabetically (A-Z, Z-A), numerically, by character length, or in reverse order. Clean list organizer.'
    },
    reverseText: {
        seoTitle: 'Reverse Text Generator – Invert Words, Letters & Backwards Text | Student Utility Hub',
        seoDescription: 'Reverse text backwards, invert letter order, flip entire sentences, or mirror paragraphs. Surrogate-pair and emoji safe.'
    },
    randomTextGenerator: {
        seoTitle: 'Random Text & Word Generator – Creative Writing & Mockup Copy | Student Utility Hub',
        seoDescription: 'Generate random words, sentences, and paragraphs for placeholder copy, typing practice, and creative brainstorms.'
    },
    htmlEncoderDecoder: {
        seoTitle: 'HTML Entity Encoder & Decoder – Escape Special Characters | Student Utility Hub',
        seoDescription: 'Convert special characters into HTML entities (e.g. &amp;, &lt;, &gt;) and decode entities back to plain text for safe web embedding.'
    },

    // --- DEVELOPER TOOLS ---
    htmlFormatter: {
        seoTitle: 'HTML Formatter & Minifier – Beautify HTML Code Online | Student Utility Hub',
        seoDescription: 'Beautify nested HTML code markup with custom indentation or minify HTML to reduce payload size and optimize page speed.'
    },
    cssMinifier: {
        seoTitle: 'CSS Minifier & Formatter – Compress Stylesheet Code | Student Utility Hub',
        seoDescription: 'Minify CSS stylesheet code to reduce file size and improve Core Web Vitals. Removes whitespace, comments, and redundant rules.'
    },
    jsFormatter: {
        seoTitle: 'JavaScript Formatter & Minifier – Beautify JS Code Online | Student Utility Hub',
        seoDescription: 'Format, beautify, and minify JavaScript snippets. Clean up obfuscated script code with structured indentation.'
    },
    jwtDecoder: {
        seoTitle: 'JWT Token Decoder – Inspect JSON Web Token Header & Claims | Student Utility Hub',
        seoDescription: 'Decode and inspect JSON Web Tokens (JWT) client-side. View decoded header algorithms, payload claims, and expiration timestamps securely.'
    },
    hashGenerator: {
        seoTitle: 'Hash Generator – MD5, SHA-1, SHA-256 & SHA-512 Hashes | Student Utility Hub',
        seoDescription: 'Generate cryptographic hash strings including MD5, SHA-1, SHA-256, and SHA-512. Fast client-side checksum generator.'
    },
    urlEncoder: {
        seoTitle: 'URL Encoder & Decoder – Percent-Encoding for Query Parameters | Student Utility Hub',
        seoDescription: 'Encode special characters for URL query strings (percent-encoding) and decode encoded URLs back to human-readable strings.'
    },
    regexTester: {
        seoTitle: 'Regex Tester & Debugger – Real-Time Regular Expression Evaluator | Student Utility Hub',
        seoDescription: 'Test regular expressions against sample text with real-time match highlighting, capture groups breakdown, and flag controls.'
    },
    colorPicker: {
        seoTitle: 'Color Picker & Hex Converter – HEX, RGB, HSL & CMYK Codes | Student Utility Hub',
        seoDescription: 'Pick colors visually and convert between HEX, RGB, and HSL values. Copy web-ready CSS color strings in one click.'
    },
    uuidGenerator: {
        seoTitle: 'UUID Generator (v4) – Bulk Random GUID & UUID Strings | Student Utility Hub',
        seoDescription: 'Generate RFC 4122 compliant version 4 UUIDs (GUIDs) individually or in bulk. Cryptographically random and unique keys.'
    },
    timestampConverter: {
        seoTitle: 'Unix Timestamp Converter – Epoch Seconds to Date & Time | Student Utility Hub',
        seoDescription: 'Convert Unix epoch timestamps (seconds and milliseconds) to human-readable UTC/Local dates and convert dates to timestamps.'
    },
    sqlFormatter: {
        seoTitle: 'SQL Formatter Online – Beautify & Align SQL Queries | Student Utility Hub',
        seoDescription: 'Format and beautify complex SQL queries. Standardizes keyword capitalization (SELECT, FROM, WHERE) and aligns clauses.'
    },
    xmlFormatter: {
        seoTitle: 'XML Formatter & Beautifier – Pretty-Print XML Documents | Student Utility Hub',
        seoDescription: 'Pretty-print and indent XML documents with tree formatting. Validates XML tags and makes nested schemas human-readable.'
    },
    qrCodeScanner: {
        seoTitle: 'QR Code Scanner Online – Scan QR Codes with Camera or Image | Student Utility Hub',
        seoDescription: 'Scan QR codes using your device camera webcam or upload an image file. Decodes URLs and text data locally without cloud uploads.'
    },

    // --- CALCULATORS ---
    ageCalculator: {
        seoTitle: 'Age Calculator – Exact Age in Years, Months, Days & Hours | Student Utility Hub',
        seoDescription: 'Calculate exact age from date of birth in years, months, days, minutes, and hours. Accurate birthday and leap-year age calculation.'
    },
    emiCalculator: {
        seoTitle: 'EMI Loan Calculator – Monthly Loan Repayment & Interest Breakdown | Student Utility Hub',
        seoDescription: 'Calculate monthly EMI repayments, total interest payable, and amortization schedules for home, car, and personal loans with interactive charts.'
    },
    sipCalculator: {
        seoTitle: 'SIP Investment Calculator – Estimate Mutual Fund Returns & Wealth | Student Utility Hub',
        seoDescription: 'Estimate future returns and wealth growth from monthly Systematic Investment Plans (SIP). Calculate compounding mutual fund investment values.'
    },
    bmiCalculator: {
        seoTitle: 'BMI Calculator – Body Mass Index & WHO Health Classification | Student Utility Hub',
        seoDescription: 'Calculate Body Mass Index (BMI) using metric (kg/cm) or imperial (lbs/inches) units. Includes WHO weight category classifications.'
    },
    percentageCalculator: {
        seoTitle: 'Percentage Calculator – Calculate Percentages & Percent Change | Student Utility Hub',
        seoDescription: 'Calculate percentages of numbers, percentage increases/decreases, and proportions. Accurate multi-formula percentage tool.'
    },
    cgpaCalculator: {
        seoTitle: 'CGPA to Percentage Calculator – Convert CGPA to Percentage (9.5x) | Student Utility Hub',
        seoDescription: 'Convert university CGPA to percentage using standard formula (CGPA x 9.5). Find corresponding academic grades and divisions.'
    },
    discountCalculator: {
        seoTitle: 'Discount Calculator – Calculate Sale Prices & Total Savings | Student Utility Hub',
        seoDescription: 'Calculate final sale prices, discount percentages, and total money saved during shopping and promotions.'
    },
    compoundInterest: {
        seoTitle: 'Compound Interest Calculator – Future Value with Compounding | Student Utility Hub',
        seoDescription: 'Calculate compound interest and total investment growth with annual, semi-annual, quarterly, or monthly compounding frequencies.'
    },
    gpaCalculator: {
        seoTitle: 'Semester GPA Calculator – Weighted Course Grade Point Average | Student Utility Hub',
        seoDescription: 'Calculate semester GPA based on course credit hours and letter grades. Fast weighted average grade point calculation for students.'
    },
    unitConverter: {
        seoTitle: 'Unit Converter – Length, Weight, Temperature & Area Conversions | Student Utility Hub',
        seoDescription: 'Convert between metric and imperial units for length (meters/feet), weight (kg/lbs), temperature (C/F/K), area, and volume.'
    },
    gstCalculator: {
        seoTitle: 'GST Calculator India – Calculate GST Inclusive & Exclusive Amount | Student Utility Hub',
        seoDescription: 'Calculate Goods and Services Tax (GST) online for Indian tax slabs (5%, 12%, 18%, 28%). Accurate GST inclusive and exclusive price breakdown.'
    },
    fuelCostCalculator: {
        seoTitle: 'Fuel Cost Calculator – Trip Mileage & Gasoline Cost Estimation | Student Utility Hub',
        seoDescription: 'Calculate total trip fuel expense and liters/gallons required based on distance, vehicle mileage (km/l or mpg), and fuel price.'
    },
    salaryCalculator: {
        seoTitle: 'Salary Calculator – Convert Hourly Wage to Annual & Monthly Pay | Student Utility Hub',
        seoDescription: 'Convert hourly wages to weekly, monthly, and annual salaries. Calculate equivalent full-time and part-time income figures.'
    },
    timeDurationCalculator: {
        seoTitle: 'Time Duration Calculator – Calculate Hours & Minutes Between Times | Student Utility Hub',
        seoDescription: 'Calculate the exact elapsed time (hours, minutes, days) between two timestamps, clock times, or calendar dates.'
    },
    scientificCalculator: {
        seoTitle: 'Scientific Calculator Online – Trigonometry, Logarithms & Math Functions | Student Utility Hub',
        seoDescription: 'Advanced scientific calculator with trigonometric (sin, cos, tan), logarithmic (log, ln), roots (sqrt), powers, and memory operations.'
    },

    // --- STUDENT UTILITIES ---
    pomodoroTimer: {
        seoTitle: 'Pomodoro Study Timer – 25/5 Productivity Clock & Focus Intervals | Student Utility Hub',
        seoDescription: 'Boost student focus and study productivity using the Pomodoro technique. Features customizable work/break intervals and notification chimes.'
    },
    citationGenerator: {
        seoTitle: 'Citation Generator – APA, MLA & Chicago Style Bibliographies | Student Utility Hub',
        seoDescription: 'Generate standardized academic citations in APA 7th, MLA 9th, and Chicago formats for books, websites, and journal articles.'
    },
    gpaScaleConverter: {
        seoTitle: 'GPA Scale Converter – Convert Between 4.0, 5.0 & 10.0 Scales | Student Utility Hub',
        seoDescription: 'Convert academic grade point averages between 4.0 US scale, 5.0 scale, and 10.0 Indian/European grading systems accurately.'
    },
    timer: {
        seoTitle: 'Online Timer & Stopwatch – Precise Countdown & Lap Counter | Student Utility Hub',
        seoDescription: 'Dual-purpose full-screen countdown timer and millisecond-accurate stopwatch with lap tracking for study sessions and workouts.'
    },

    // --- AUDIO & VIDEO ---
    videoConverter: {
        seoTitle: 'Video Format Converter – Convert MP4, WebM & Video In Browser | Student Utility Hub',
        seoDescription: 'Convert video files right inside your browser. Fast, free client-side video conversion with zero cloud uploads or size tracking.'
    },
    audioConverter: {
        seoTitle: 'Audio Converter Online – Convert Tracks to Uncompressed WAV | Student Utility Hub',
        seoDescription: 'Convert audio files to uncompressed high-fidelity WAV format natively in your browser using the Web Audio API.'
    },
    audioTrimmer: {
        seoTitle: 'Audio Trimmer & Cutter – Cut MP3 & Audio Slices Online | Student Utility Hub',
        seoDescription: 'Trim audio tracks, cut audio clips, and export selected segments as uncompressed audio slices. Fast waveform timeline trimming.'
    }
};

// Curated high-intent related tools mapping for all 77 active tools
const curatedRelatedToolsMap = {
    pdfMerge: ['pdfSplit', 'pdfCompress', 'pdfToImage', 'imageToPdf', 'pdfPageRotator', 'pdfRemovePages'],
    pdfSplit: ['pdfMerge', 'pdfRemovePages', 'pdfCompress', 'pdfPageRotator', 'pdfToImage', 'pdfUnlock'],
    pdfToImage: ['imageToPdf', 'imageConverter', 'imageCompressor', 'pdfSplit', 'screenshotToPdf', 'pdfCompress'],
    imageToPdf: ['screenshotToPdf', 'pdfMerge', 'pdfCompress', 'imageConverter', 'imageResizer', 'pdfToImage'],
    pdfWatermark: ['imageWatermark', 'pdfProtect', 'pdfSign', 'pdfMerge', 'pdfPageRotator', 'pdfCompress'],
    pdfPageRotator: ['pdfSplit', 'pdfRemovePages', 'pdfMerge', 'imageRotateFlip', 'pdfCompress', 'pdfWatermark'],
    pdfCompress: ['pdfMerge', 'pdfSplit', 'imageCompressor', 'pdfUnlock', 'imageToPdf', 'pdfProtect'],
    pdfUnlock: ['pdfProtect', 'pdfCompress', 'pdfMerge', 'pdfSign', 'pdfSplit', 'passwordGenerator'],
    pdfProtect: ['pdfUnlock', 'passwordGenerator', 'pdfWatermark', 'pdfSign', 'pdfCompress', 'pdfMerge'],
    pdfSign: ['pdfWatermark', 'pdfProtect', 'pdfMerge', 'imageToPdf', 'pdfSplit', 'pdfUnlock'],
    pdfRemovePages: ['pdfSplit', 'pdfPageRotator', 'pdfMerge', 'pdfCompress', 'imageToPdf', 'pdfWatermark'],

    imageConverter: ['imageCompressor', 'imageResizer', 'svgToPng', 'faviconGenerator', 'imageCropper', 'imageFilter'],
    imageCompressor: ['imageConverter', 'imageResizer', 'pdfCompress', 'imageCropper', 'imageFilter', 'svgToPng'],
    imageCropper: ['imageResizer', 'imageRotateFlip', 'imageCompressor', 'imageBackgroundRemover', 'faviconGenerator', 'imageConverter'],
    imageResizer: ['imageCropper', 'imageCompressor', 'imageConverter', 'faviconGenerator', 'imageRotateFlip', 'imageFilter'],
    imageFilter: ['imageCropper', 'imageResizer', 'imageColorExtractor', 'imageCompressor', 'imageRotateFlip', 'imageWatermark'],
    svgToPng: ['imageConverter', 'imageResizer', 'faviconGenerator', 'imageColorExtractor', 'colorPicker', 'imageBackgroundRemover'],
    imageColorExtractor: ['colorPicker', 'imageFilter', 'svgToPng', 'cssMinifier', 'faviconGenerator', 'imageMetadata'],
    faviconGenerator: ['imageResizer', 'imageCropper', 'svgToPng', 'imageConverter', 'qrCodeGenerator', 'colorPicker'],
    imageBackgroundRemover: ['imageCropper', 'imageConverter', 'imageCompressor', 'imageFilter', 'imageWatermark', 'svgToPng'],
    imageWatermark: ['pdfWatermark', 'imageCropper', 'imageResizer', 'imageFilter', 'imageRotateFlip', 'imageBackgroundRemover'],
    imageMetadata: ['imageCompressor', 'imageConverter', 'imageRotateFlip', 'timestampConverter', 'imageColorExtractor', 'qrCodeScanner'],
    imageRotateFlip: ['imageCropper', 'imageResizer', 'pdfPageRotator', 'imageFilter', 'imageCompressor', 'imageWatermark'],
    screenshotToPdf: ['imageToPdf', 'pdfMerge', 'pdfCompress', 'imageCropper', 'qrCodeScanner', 'imageConverter'],

    qrCodeGenerator: ['qrCodeScanner', 'urlEncoder', 'slugGenerator', 'passwordGenerator', 'base64', 'uuidGenerator'],
    passwordGenerator: ['hashGenerator', 'pdfProtect', 'base64', 'uuidGenerator', 'qrCodeGenerator', 'randomTextGenerator'],
    wordCounter: ['caseConverter', 'textCleaner', 'duplicateLineRemover', 'textSorter', 'diffChecker', 'markdownPreviewer'],
    base64: ['jwtDecoder', 'urlEncoder', 'hashGenerator', 'htmlEncoderDecoder', 'jsonFormatter', 'passwordGenerator'],
    jsonFormatter: ['jwtDecoder', 'xmlFormatter', 'sqlFormatter', 'jsFormatter', 'htmlFormatter', 'diffChecker'],
    caseConverter: ['slugGenerator', 'wordCounter', 'textCleaner', 'reverseText', 'textSorter', 'loremIpsum'],
    diffChecker: ['wordCounter', 'textCleaner', 'markdownPreviewer', 'jsonFormatter', 'caseConverter', 'duplicateLineRemover'],
    markdownPreviewer: ['htmlFormatter', 'diffChecker', 'wordCounter', 'loremIpsum', 'textCleaner', 'citationGenerator'],
    loremIpsum: ['randomTextGenerator', 'wordCounter', 'markdownPreviewer', 'slugGenerator', 'caseConverter', 'textCleaner'],
    slugGenerator: ['caseConverter', 'urlEncoder', 'textCleaner', 'wordCounter', 'loremIpsum', 'qrCodeGenerator'],
    textCleaner: ['wordCounter', 'duplicateLineRemover', 'textSorter', 'htmlEncoderDecoder', 'caseConverter', 'diffChecker'],
    textToSpeech: ['speechToText', 'wordCounter', 'audioConverter', 'audioTrimmer', 'timer', 'pomodoroTimer'],
    speechToText: ['textToSpeech', 'wordCounter', 'textCleaner', 'audioConverter', 'audioTrimmer', 'timer'],
    duplicateLineRemover: ['textSorter', 'textCleaner', 'wordCounter', 'diffChecker', 'reverseText', 'caseConverter'],
    textSorter: ['duplicateLineRemover', 'textCleaner', 'reverseText', 'wordCounter', 'caseConverter', 'slugGenerator'],
    reverseText: ['textSorter', 'caseConverter', 'wordCounter', 'textCleaner', 'duplicateLineRemover', 'randomTextGenerator'],
    randomTextGenerator: ['loremIpsum', 'passwordGenerator', 'uuidGenerator', 'wordCounter', 'slugGenerator', 'reverseText'],
    htmlEncoderDecoder: ['textCleaner', 'base64', 'urlEncoder', 'htmlFormatter', 'markdownPreviewer', 'xmlFormatter'],

    htmlFormatter: ['cssMinifier', 'jsFormatter', 'xmlFormatter', 'jsonFormatter', 'markdownPreviewer', 'htmlEncoderDecoder'],
    cssMinifier: ['htmlFormatter', 'jsFormatter', 'colorPicker', 'imageColorExtractor', 'jsonFormatter', 'svgToPng'],
    jsFormatter: ['htmlFormatter', 'cssMinifier', 'jsonFormatter', 'jwtDecoder', 'regexTester', 'sqlFormatter'],
    jwtDecoder: ['base64', 'jsonFormatter', 'hashGenerator', 'timestampConverter', 'uuidGenerator', 'urlEncoder'],
    hashGenerator: ['passwordGenerator', 'jwtDecoder', 'base64', 'uuidGenerator', 'urlEncoder', 'pdfProtect'],
    urlEncoder: ['base64', 'slugGenerator', 'qrCodeGenerator', 'htmlEncoderDecoder', 'jwtDecoder', 'hashGenerator'],
    regexTester: ['jsonFormatter', 'jsFormatter', 'textCleaner', 'diffChecker', 'wordCounter', 'xmlFormatter'],
    colorPicker: ['imageColorExtractor', 'cssMinifier', 'svgToPng', 'faviconGenerator', 'imageFilter', 'htmlFormatter'],
    uuidGenerator: ['passwordGenerator', 'hashGenerator', 'timestampConverter', 'jwtDecoder', 'randomTextGenerator', 'qrCodeGenerator'],
    timestampConverter: ['timeDurationCalculator', 'ageCalculator', 'jwtDecoder', 'timer', 'uuidGenerator', 'salaryCalculator'],
    sqlFormatter: ['jsonFormatter', 'xmlFormatter', 'jsFormatter', 'htmlFormatter', 'diffChecker', 'regexTester'],
    xmlFormatter: ['htmlFormatter', 'jsonFormatter', 'sqlFormatter', 'jsFormatter', 'diffChecker', 'htmlEncoderDecoder'],
    qrCodeScanner: ['qrCodeGenerator', 'screenshotToPdf', 'urlEncoder', 'imageMetadata', 'base64', 'imageColorExtractor'],

    ageCalculator: ['timeDurationCalculator', 'bmiCalculator', 'percentageCalculator', 'salaryCalculator', 'timer', 'gpaCalculator'],
    emiCalculator: ['sipCalculator', 'compoundInterest', 'salaryCalculator', 'gstCalculator', 'discountCalculator', 'percentageCalculator'],
    sipCalculator: ['compoundInterest', 'emiCalculator', 'salaryCalculator', 'percentageCalculator', 'discountCalculator', 'gstCalculator'],
    bmiCalculator: ['ageCalculator', 'unitConverter', 'percentageCalculator', 'pomodoroTimer', 'timer', 'fuelCostCalculator'],
    percentageCalculator: ['cgpaCalculator', 'discountCalculator', 'gstCalculator', 'sipCalculator', 'gpaCalculator', 'compoundInterest'],
    cgpaCalculator: ['gpaCalculator', 'gpaScaleConverter', 'percentageCalculator', 'pomodoroTimer', 'citationGenerator', 'wordCounter'],
    discountCalculator: ['gstCalculator', 'percentageCalculator', 'salaryCalculator', 'emiCalculator', 'compoundInterest', 'sipCalculator'],
    compoundInterest: ['sipCalculator', 'emiCalculator', 'salaryCalculator', 'percentageCalculator', 'discountCalculator', 'gstCalculator'],
    gpaCalculator: ['cgpaCalculator', 'gpaScaleConverter', 'percentageCalculator', 'pomodoroTimer', 'citationGenerator', 'wordCounter'],
    unitConverter: ['fuelCostCalculator', 'bmiCalculator', 'timeDurationCalculator', 'percentageCalculator', 'scientificCalculator', 'ageCalculator'],
    gstCalculator: ['discountCalculator', 'salaryCalculator', 'percentageCalculator', 'emiCalculator', 'compoundInterest', 'sipCalculator'],
    fuelCostCalculator: ['unitConverter', 'timeDurationCalculator', 'salaryCalculator', 'percentageCalculator', 'discountCalculator', 'emiCalculator'],
    salaryCalculator: ['timeDurationCalculator', 'gstCalculator', 'emiCalculator', 'sipCalculator', 'discountCalculator', 'percentageCalculator'],
    timeDurationCalculator: ['timestampConverter', 'ageCalculator', 'timer', 'fuelCostCalculator', 'pomodoroTimer', 'salaryCalculator'],
    scientificCalculator: ['percentageCalculator', 'unitConverter', 'compoundInterest', 'gpaCalculator', 'emiCalculator', 'sipCalculator'],

    pomodoroTimer: ['timer', 'citationGenerator', 'gpaCalculator', 'cgpaCalculator', 'wordCounter', 'timeDurationCalculator'],
    citationGenerator: ['wordCounter', 'markdownPreviewer', 'pomodoroTimer', 'gpaCalculator', 'cgpaCalculator', 'gpaScaleConverter'],
    gpaScaleConverter: ['cgpaCalculator', 'gpaCalculator', 'percentageCalculator', 'pomodoroTimer', 'citationGenerator', 'wordCounter'],
    timer: ['pomodoroTimer', 'timeDurationCalculator', 'ageCalculator', 'textToSpeech', 'audioTrimmer', 'speechToText'],

    videoConverter: ['audioConverter', 'audioTrimmer', 'screenshotToPdf', 'imageConverter', 'imageCompressor', 'imageResizer'],
    audioConverter: ['audioTrimmer', 'videoConverter', 'textToSpeech', 'speechToText', 'timer', 'imageMetadata'],
    audioTrimmer: ['audioConverter', 'videoConverter', 'textToSpeech', 'speechToText', 'timer', 'audioConverter']
};

export const toKebabCase = (str) => {
    if (!str) return '';
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
};

export const tools = rawTools.map((tool, index, arr) => {
    const slug = toKebabCase(tool.id);
    const title = tool.name;
    const categoryName = tool.category === 'developer' ? 'Developer' : (tool.category === 'student' ? 'Student' : tool.category.toUpperCase());
    
    // Custom search-intent metadata if available, otherwise intent-driven fallback
    const intent = toolIntentMetadata[tool.id];
    const seoTitle = intent?.seoTitle || `${tool.name} Online – Free ${categoryName} Tool | Student Utility Hub`;
    const seoDescription = intent?.seoDescription || `Use our free online ${tool.name} to ${tool.description.toLowerCase().replace(/\.$/, '')} safely. Runs 100% client-side in your browser for absolute privacy.`;
    
    const searchTags = tool.keywords || [];
    const popularity = index % 3 === 0 ? 'high' : 'medium';
    const version = '1.0.0';
    const status = 'active';
    
    // Use curated related tools if defined, otherwise fall back to category items
    let relatedTools = curatedRelatedToolsMap[tool.id] || arr
        .filter(t => t.category === tool.category && t.id !== tool.id)
        .map(t => t.id)
        .slice(0, 6);

    return {
        ...tool,
        slug,
        title,
        seoTitle,
        seoDescription,
        searchTags,
        popularity,
        version,
        status,
        relatedTools
    };
});

export const categories = [
    { id: 'all', name: 'All Tools', icon: '✨', description: 'Browse all available utilities.' },
    { id: 'pdf', name: 'PDF Tools', icon: '📄', description: 'Manage, merge, compress, and convert PDF documents.' },
    { id: 'image', name: 'Image Tools', icon: '🖼️', description: 'Edit, compress, convert, and crop images.' },
    { id: 'text', name: 'Text & Content', icon: '📝', description: 'Format, analyze, clean, and generate text.' },
    { id: 'developer', name: 'Developer Tools', icon: '💻', description: 'Utilities for coding, token decoding, and web development.' },
    { id: 'calculator', name: 'Calculators', icon: '🧮', description: 'Financial, tax, health, and mathematical calculators.' },
    { id: 'student', name: 'Student Utilities', icon: '🎓', description: 'Tools for studying, Pomodoro timing, and academic success.' },
    { id: 'media', name: 'Audio & Video', icon: '🎵', description: 'Convert and trim media files locally.' }
];
