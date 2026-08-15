import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox, createSelect } from '../../components/ui/index.js';

const loadSqlFormatter = async () => {
    if (window.sqlFormatter) return window.sqlFormatter;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql-formatter/15.4.4/sql-formatter.min.js';
        script.onload = () => resolve(window.sqlFormatter);
        script.onerror = () => reject(new Error('Failed to load SQL Formatter library'));
        document.head.appendChild(script);
    });
};

export default createTool('sqlFormatter', ({ container, showAlert, hideAlert }) => {
    let sqlInputVal = '';
    let sqlDialect = 'sql';

    const textarea = document.createElement('div');
    textarea.className = 'form-group';
    textarea.style.marginBottom = '1rem';
    textarea.innerHTML = `
        <label for="sqlQueryInput" style="display:block; margin-bottom:0.5rem; font-weight:500;">Input SQL Query:</label>
        <textarea id="sqlQueryInput" class="form-control" style="width:100%; height:200px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical;" placeholder="SELECT * FROM users WHERE status = 'active' AND age > 18;"></textarea>
    `;
    const textInput = textarea.querySelector('#sqlQueryInput');
    textInput.addEventListener('input', (e) => {
        sqlInputVal = e.target.value;
    });

    const dialectSelect = createSelect({
        id: 'sqlDialect',
        label: 'SQL Dialect:',
        options: [
            { value: 'sql', label: 'Standard SQL' },
            { value: 'mysql', label: 'MySQL' },
            { value: 'postgresql', label: 'PostgreSQL' },
            { value: 'sqlite', label: 'SQLite' },
            { value: 'mariadb', label: 'MariaDB' }
        ],
        onChange: (val) => sqlDialect = val
    });

    const formatBtn = createButton({
        id: 'formatSqlBtn',
        text: 'Format SQL',
        icon: '💾',
        onClick: () => formatSql()
    });

    const resultBox = createResultBox({
        id: 'sqlResult',
        title: 'Beautified SQL'
    });

    const layout = createToolLayout({
        inputs: [textarea, dialectSelect],
        actions: [formatBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const formatSql = async () => {
        if (!sqlInputVal.trim()) {
            showAlert('Please enter an SQL query to format.', 'error');
            return;
        }

        try {
            formatBtn.disabled = true;
            formatBtn.textContent = 'Formatting...';
            hideAlert();

            const formatter = await loadSqlFormatter();
            
            // Format standard options
            const formatted = formatter.format(sqlInputVal, {
                language: sqlDialect,
                tabWidth: 2,
                keywordCase: 'upper'
            });

            resultBox.update(`
                <textarea id="formattedSqlOutput" readonly style="width:100%; height:200px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; font-size:0.95rem; resize:vertical; margin-bottom:1rem;"></textarea>
                <div style="display:flex; gap:1rem;">
                    <button type="button" class="primary-button" id="copyResultBtn">📋 Copy Formatted SQL</button>
                    <button type="button" class="secondary-button" id="clearBtn">✕ Reset</button>
                </div>
            `);

            const output = resultBox.querySelector('#formattedSqlOutput');
            if (output) output.value = formatted;
            
            resultBox.querySelector('#copyResultBtn').onclick = () => {
                output.select();
                document.execCommand('copy');
                showAlert('Formatted SQL copied to clipboard!', 'success');
            };

            resultBox.querySelector('#clearBtn').onclick = () => {
                textInput.value = '';
                sqlInputVal = '';
                resultBox.hide();
            };
        } catch (err) {
            console.error(err);
            showAlert('Error formatting SQL query. Check for query syntax errors.', 'error');
        } finally {
            formatBtn.disabled = false;
            formatBtn.textContent = 'Format SQL';
        }
    };
});
