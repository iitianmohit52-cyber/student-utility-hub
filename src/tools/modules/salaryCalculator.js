import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';

export default createTool('salaryCalculator', ({ container, showAlert, hideAlert }) => {
    let rate = 25;
    let hoursPerWeek = 40;
    let weeksPerYear = 52;

    const rateInput = createInput({
        id: 'salaryRate',
        type: 'number',
        label: 'Hourly Pay Rate ($ / ₹):',
        value: '25',
        min: 0,
        onChange: (val) => rate = parseFloat(val) || 0
    });

    const hoursInput = createInput({
        id: 'salaryHours',
        type: 'number',
        label: 'Work Hours per Week:',
        value: '40',
        min: 1,
        max: 168,
        onChange: (val) => hoursPerWeek = parseFloat(val) || 40
    });

    const weeksInput = createInput({
        id: 'salaryWeeks',
        type: 'number',
        label: 'Paid Weeks per Year:',
        value: '52',
        min: 1,
        max: 52,
        onChange: (val) => weeksPerYear = parseFloat(val) || 52
    });

    const calculateBtn = createButton({
        id: 'calculateSalaryBtn',
        text: 'Calculate Salary Breakdown',
        icon: '💵',
        onClick: () => calculateSalary()
    });

    const resultBox = createResultBox({
        id: 'salaryResult',
        title: 'Salary & Income Breakdown'
    });

    const layout = createToolLayout({
        inputs: [rateInput, hoursInput, weeksInput],
        actions: [calculateBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const calculateSalary = () => {
        if (rate <= 0 || hoursPerWeek <= 0 || weeksPerYear <= 0) {
            showAlert('Please enter values greater than 0.', 'error');
            resultBox.hide();
            return;
        }
        hideAlert();

        const dailyRate = rate * (hoursPerWeek / 5); // Assumes 5 working days
        const weeklyRate = rate * hoursPerWeek;
        const monthlyRate = (weeklyRate * weeksPerYear) / 12;
        const annualRate = weeklyRate * weeksPerYear;

        resultBox.update(`
            <div style="font-size:0.95rem; line-height:1.6;">
                <p style="border-bottom:1px solid var(--tool-card-border); padding-bottom:0.5rem; display:flex; justify-content:space-between;">
                    <span>Hourly Income:</span> 
                    <strong>$ / ₹ ${rate.toFixed(2)}</strong>
                </p>
                <p style="border-bottom:1px solid var(--tool-card-border); padding-bottom:0.5rem; display:flex; justify-content:space-between;">
                    <span>Daily Income (8h average):</span> 
                    <strong>$ / ₹ ${(rate * 8).toFixed(2)}</strong>
                </p>
                <p style="border-bottom:1px solid var(--tool-card-border); padding-bottom:0.5rem; display:flex; justify-content:space-between;">
                    <span>Weekly Income:</span> 
                    <strong>$ / ₹ ${weeklyRate.toFixed(2)}</strong>
                </p>
                <p style="border-bottom:1px solid var(--tool-card-border); padding-bottom:0.5rem; display:flex; justify-content:space-between;">
                    <span>Monthly Income:</span> 
                    <strong>$ / ₹ ${monthlyRate.toFixed(2)}</strong>
                </p>
                <p style="font-size:1.15rem; color:var(--primary-color); display:flex; justify-content:space-between; margin-top:0.5rem;">
                    <span>Annual Salary:</span> 
                    <strong>$ / ₹ ${annualRate.toFixed(2)}</strong>
                </p>
            </div>
        `);
    };
});
