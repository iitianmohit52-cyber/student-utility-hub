const fs = require('fs');
const content = fs.readFileSync('src/tools/initializers.js', 'utf8');
const keys = [];
const regex = /([a-zA-Z0-9_]+)\s*:\s*\(\w*\)\s*=>\s*\{/g;
let match;
while ((match = regex.exec(content)) !== null) {
    keys.push(match[1]);
}
console.log(keys);
if (content.includes('qrcodegen')) {
    console.log('qrcodegen found in initializers');
} else {
    console.log('qrcodegen NOT found in initializers');
}
