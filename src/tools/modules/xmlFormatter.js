import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';

export default createTool('xmlFormatter', ({ container, showAlert, hideAlert }) => {
    let xmlInputVal = '';

    const textarea = document.createElement('div');
    textarea.className = 'form-group';
    textarea.style.marginBottom = '1rem';
    textarea.innerHTML = `
        <label for="xmlInput" style="display:block; margin-bottom:0.5rem; font-weight:500;">Input XML / HTML:</label>
        <textarea id="xmlInput" class="form-control" style="width:100%; height:200px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical;" placeholder="<note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>"></textarea>
    `;
    const textInput = textarea.querySelector('#xmlInput');
    textInput.addEventListener('input', (e) => {
        xmlInputVal = e.target.value;
    });

    const formatBtn = createButton({
        id: 'formatXmlBtn',
        text: 'Format XML',
        icon: '📝',
        onClick: () => formatXmlData()
    });

    const resultBox = createResultBox({
        id: 'xmlResult',
        title: 'Pretty Printed XML'
    });

    const layout = createToolLayout({
        inputs: [textarea],
        actions: [formatBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const prettyPrintXml = (xmlStr, indent = '  ') => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlStr, 'application/xml');
        
        const errorNode = doc.querySelector('parsererror');
        if (errorNode) {
            throw new Error(errorNode.textContent);
        }
        
        let formatted = '';
        const serializeNode = (node, depth = 0) => {
            const spacing = indent.repeat(depth);
            if (node.nodeType === Node.ELEMENT_NODE) {
                formatted += spacing + `<${node.nodeName}`;
                for (let i = 0; i < node.attributes.length; i++) {
                    const attr = node.attributes[i];
                    formatted += ` ${attr.name}="${attr.value}"`;
                }
                if (node.childNodes.length === 0) {
                    formatted += ' />\n';
                } else {
                    // Check if children are just text nodes
                    const hasOnlyTextChildren = Array.from(node.childNodes).every(c => c.nodeType === Node.TEXT_NODE);
                    if (hasOnlyTextChildren) {
                        formatted += `>${node.textContent.trim()}</${node.nodeName}>\n`;
                    } else {
                        formatted += '>\n';
                        for (let i = 0; i < node.childNodes.length; i++) {
                            serializeNode(node.childNodes[i], depth + 1);
                        }
                        formatted += spacing + `</${node.nodeName}>\n`;
                    }
                }
            } else if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue.trim();
                if (text) {
                    formatted += spacing + text + '\n';
                }
            } else if (node.nodeType === Node.COMMENT_NODE) {
                formatted += spacing + `<!--${node.nodeValue}-->\n`;
            }
        }
        
        for (let i = 0; i < doc.childNodes.length; i++) {
            serializeNode(doc.childNodes[i]);
        }
        return formatted.trim();
    };

    const formatXmlData = () => {
        if (!xmlInputVal.trim()) {
            showAlert('Please enter XML content to format.', 'error');
            return;
        }

        try {
            hideAlert();
            const formatted = prettyPrintXml(xmlInputVal);

            resultBox.update(`
                <textarea id="formattedXmlOutput" readonly style="width:100%; height:200px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical; margin-bottom:1rem;">${formatted}</textarea>
                <div style="display:flex; gap:1rem;">
                    <button type="button" class="primary-button" id="copyResultBtn">📋 Copy Output</button>
                    <button type="button" class="secondary-button" id="clearBtn">✕ Reset</button>
                </div>
            `);

            const output = resultBox.querySelector('#formattedXmlOutput');
            
            resultBox.querySelector('#copyResultBtn').onclick = () => {
                output.select();
                document.execCommand('copy');
                showAlert('Formatted XML copied to clipboard!', 'success');
            };

            resultBox.querySelector('#clearBtn').onclick = () => {
                textInput.value = '';
                xmlInputVal = '';
                resultBox.hide();
            };
        } catch (err) {
            console.error(err);
            showAlert('Failed to parse XML. Make sure it is well-formed XML.', 'error');
        }
    };
});
