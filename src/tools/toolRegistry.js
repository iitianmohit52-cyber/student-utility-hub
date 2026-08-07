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

export const tools = rawTools.map((tool, index, arr) => {
    const slug = tool.id;
    const title = tool.name;
    const seoTitle = `${tool.name} - Free Online Tool | Student Utility Hub`;
    const seoDescription = tool.description;
    const searchTags = tool.keywords || [];
    const popularity = index % 3 === 0 ? 'high' : 'medium';
    const version = '1.0.0';
    const status = 'active';
    
    // Automatically find related tools of the same category if none are explicitly declared
    let relatedTools = arr
        .filter(t => t.category === tool.category && t.id !== tool.id)
        .map(t => t.id)
        .slice(0, 6); // Grab up to 6 tools of the same category

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
    { id: 'pdf', name: 'PDF Tools', icon: '📄', description: 'Manage, merge, and convert PDF documents.' },
    { id: 'image', name: 'Image Tools', icon: '🖼️', description: 'Edit, compress, and convert images.' },
    { id: 'text', name: 'Text & Content', icon: '📝', description: 'Format, analyze, and generate text.' },
    { id: 'developer', name: 'Developer Tools', icon: '💻', description: 'Utilities for coding and web development.' },
    { id: 'calculator', name: 'Calculators', icon: '🧮', description: 'Financial, health, and math calculators.' },
    { id: 'student', name: 'Student Utilities', icon: '🎓', description: 'Tools for studying and academic success.' },
    { id: 'media', name: 'Audio & Video', icon: '🎵', description: 'Convert and edit media files.' }
];
