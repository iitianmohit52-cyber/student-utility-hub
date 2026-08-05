const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Find the start of toolInitializers
const startIndex = html.indexOf('const toolInitializers = {');
// The toolInitializers object ends near the end of the script before the toolsArticleContainer
// Let's find the closing brace. We know the script ends with </script>.
const scriptEndIndex = html.indexOf('</script>', startIndex);
let toolInitializersCode = html.substring(startIndex, scriptEndIndex);

// We need to just extract it as an exported object.
// So we replace "const toolInitializers = {" with "export const toolInitializers = {"
toolInitializersCode = toolInitializersCode.replace('const toolInitializers = {', 'export const toolInitializers = {');

// We also need to extract the tools array.
const toolsStartIndex = html.indexOf('const tools = [');
const toolsEndIndex = html.indexOf('];', toolsStartIndex) + 2;
let toolsCode = html.substring(toolsStartIndex, toolsEndIndex);
toolsCode = toolsCode.replace('const tools = [', 'export const tools = [');

fs.writeFileSync('src/tools/initializers.js', toolInitializersCode);
console.log('Extraction complete.');
