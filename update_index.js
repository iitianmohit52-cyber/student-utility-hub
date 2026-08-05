const fs = require('fs');
let html = fs.readFileSync('index.backup.html', 'utf8');

const styleStart = html.indexOf('<style>');
if (styleStart !== -1) {
    const styleEnd = html.indexOf('</style>', styleStart) + 8;
    html = html.substring(0, styleStart) + html.substring(styleEnd);
}

const searchStr = '// --- QR Code Generation Library';
const scriptStartPos = html.lastIndexOf('<script>', html.indexOf(searchStr));

if (scriptStartPos !== -1) {
    const scriptEndPos = html.lastIndexOf('</script>') + 9;
    html = html.substring(0, scriptStartPos) + html.substring(scriptEndPos);
}

const articleStart = html.indexOf('<div id="toolsArticleContainer"');
let articleHtml = '';
if (articleStart !== -1) {
    const articleClose = html.indexOf('</article>', articleStart);
    const divClose = html.indexOf('</div>', articleClose);
    articleHtml = html.substring(articleStart, divClose + 6);
}

const adHtml = "<center><script>atOptions = {'key':'8e66e91b14cffa8ee5bf749701fffec8','format':'iframe','height':90,'width':728,'params':{}};</script><script src='https://www.highperformanceformat.com/8e66e91b14cffa8ee5bf749701fffec8/invoke.js'></script></center>";

const newBody = "<body>" + adHtml + "<div id='app'></div>" + articleHtml + adHtml + "<script type='module' src='/src/main.js'></script></body>";

const bodyStart = html.indexOf('<body>');
const bodyEnd = html.indexOf('</body>') + 7;

html = html.substring(0, bodyStart) + newBody + html.substring(bodyEnd);
fs.writeFileSync('index.html', html);
console.log('Fixed index.html completely');
