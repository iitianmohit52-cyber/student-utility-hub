const fs = require('fs');
const path = './src/tools/modules';
fs.readdirSync(path).forEach(f => {
    if (f.endsWith('.js')) {
        const p = path + '/' + f;
        let c = fs.readFileSync(p, 'utf8');
        c = c.replace(/from '\.\.\/utils\/alerts\.js'/g, "from '../../utils/alerts.js'");
        fs.writeFileSync(p, c);
    }
});
console.log('Fixed imports');
