const fs = require('fs');
const acorn = require('acorn');

const content = fs.readFileSync('src/tools/initializers.js', 'utf8');

// Parse the AST
const ast = acorn.parse(content, { ecmaVersion: 2020, sourceType: 'module' });

// We expect `export const toolInitializers = { ... }`
let properties = [];
for (const node of ast.body) {
    if (node.type === 'ExportNamedDeclaration') {
        const decl = node.declaration.declarations[0];
        if (decl.id.name === 'toolInitializers') {
            properties = decl.init.properties;
            break;
        }
    }
}

console.log(`Found ${properties.length} tools`);

let extractedCount = 0;
for (const prop of properties) {
    const key = prop.key.name;
    const valueNode = prop.value;
    
    const start = valueNode.start;
    const end = valueNode.end;
    
    // We get the raw text of the arrow function
    const fnText = content.slice(start, end);
    
    const fileContent = `import { showAlert, hideAlert } from '../utils/alerts.js';\n\nexport default ${fnText};\n`;
    
    fs.writeFileSync(`src/tools/${key}.js`, fileContent);
    console.log(`Created ${key}.js`);
    extractedCount++;
}

console.log(`Successfully extracted ${extractedCount} tools.`);
