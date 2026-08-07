import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox, createSelect } from '../../components/ui/index.js';

export default createTool('gstCalculator', ({ container, showAlert, hideAlert }) => {
    let amount = 0;
    let gstRate = 18;
    let gstType = 'exclusive'; // 'inclusive' or 'exclusive'

    const amountInput = createInput({
        id: 'gstAmount',
        type: 'number',
        label: 'Base Amount ($ / ₹ / £):',
        value: '',
        min: 0,
        step: 'any',
        placeholder: 'Enter base amount',
        onChange: (val) => amount = parseFloat(val) || 0
    });

    const rateSelect = createSelect({
        id: 'gstRate',
        label: 'GST Rate (%):',
        options: [
            { value: '5', label: '5%' },
            { value: '12', label: '12%' },
            { value: '18', label: '18% (Standard)' },
            { value: '28', label: '28%' }
        ],
        onChange: (val) => gstRate = parseFloat(val) || 18
    });

    const typeSelect = createSelect({
        id: 'gstType',
        label: 'Calculation Type:',
        options: [
            { value: 'exclusive', label: 'GST Exclusive (Add tax to amount)' },
            { value: 'inclusive', label: 'GST Inclusive (Extract tax from amount)' }
        ],
        onChange: (val) => gstType = val
    });

    const calculateBtn = createButton({
        id: 'calculateGstBtn',
        text: 'Calculate GST',
        icon: '💸',
        onClick: () => calculateGst()
    });

    const resultBox = createResultBox({
        id: 'gstResult',
        title: 'GST Calculation Breakdown'
    });

    const layout = createToolLayout({
        inputs: [amountInput, rateSelect, typeSelect],
        actions: [calculateBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const calculateGst = () => {
        if (amount <= 0) {
            showAlert('Please enter a base amount greater than 0.', 'error');
            resultBox.hide();
            return;
        }
        hideAlert();

        let netAmount = 0;
        let gstAmount = 0;
        let totalAmount = 0;

        if (gstType === 'exclusive') {
            netAmount = amount;
            gstAmount = (amount * gstRate) / 100;
            totalAmount = amount + gstAmount;
        } else {
            totalAmount = amount;
            netAmount = amount / (1 + gstRate / 100);
            gstAmount = totalAmount - netAmount;
        }

        resultBox.update(`
            <div style="font-size:0.95rem; line-height:1.6;">
                <p style="border-bottom:1px solid var(--tool-card-border); padding-bottom:0.5rem; display:flex; justify-content:space-between;">
                    <span>Net Price (Excluding GST):</span> 
                    <strong>${netAmount.toFixed(2)}</strong>
                </p>
                <p style="border-bottom:1px solid var(--tool-card-border); padding-bottom:0.5rem; display:flex; justify-content:space-between;">
                    <span>GST Amount (${gstRate}%):</span> 
                    <strong>+ ${gstAmount.toFixed(2)}</strong>
                </p>
                <p style="font-size:1.1rem; color:var(--primary-color); display:flex; justify-content:space-between; margin-top:0.5rem;">
                    <span>Total Price (Including GST):</span> 
                    <strong>${totalAmount.toFixed(2)}</strong>
                </p>
            </div>
        `);
    };
});
