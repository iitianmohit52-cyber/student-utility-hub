import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';

export default createTool('ageCalculator', ({ container, showAlert, hideAlert }) => {
    let selectedDate = '';

    const dateInput = createInput({
        id: 'birthDate',
        type: 'date',
        label: 'Enter your Date of Birth:',
        required: true,
        onChange: (val) => selectedDate = val
    });

    const calculateBtn = createButton({
        id: 'calculateAgeBtn',
        text: 'Calculate Age',
        icon: '🎂',
        onClick: () => calculateAge()
    });

    const resultBox = createResultBox({
        id: 'ageResult',
        title: 'Your Exact Age & Milestones'
    });

    const layout = createToolLayout({
        inputs: [dateInput],
        actions: [calculateBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const calculateAge = () => {
        if (!selectedDate) {
            showAlert('Please enter your date of birth.', 'error');
            resultBox.hide();
            return;
        }

        const parts = selectedDate.split('-').map(Number);
        if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
            showAlert('Invalid date selected.', 'error');
            return;
        }

        // Local timezone explicit construction
        const birthDate = new Date(parts[0], parts[1] - 1, parts[2]);
        const today = new Date();
        const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (birthDate > todayZero) {
            showAlert('Birth date cannot be in the future.', 'error');
            resultBox.hide();
            return;
        }

        let years = todayZero.getFullYear() - birthDate.getFullYear();
        let months = todayZero.getMonth() - birthDate.getMonth();
        let days = todayZero.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(todayZero.getFullYear(), todayZero.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        // Total units
        const diffMs = todayZero.getTime() - birthDate.getTime();
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);

        // Next birthday
        let nextBday = new Date(todayZero.getFullYear(), parts[1] - 1, parts[2]);
        if (nextBday < todayZero) {
            nextBday = new Date(todayZero.getFullYear() + 1, parts[1] - 1, parts[2]);
        }
        const daysToNextBday = Math.ceil((nextBday.getTime() - todayZero.getTime()) / (1000 * 60 * 60 * 24));

        resultBox.update(`
            <div style="text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:0.3rem;">You are currently:</p>
                <h3 style="font-size:1.8rem; color:var(--primary-color); margin:0.3rem 0;">
                    ${years} Years, ${months} Months, ${days} Days
                </h3>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.8rem; margin-top:1.2rem; text-align:left;">
                    <div style="background:var(--surface-color); padding:0.8rem; border-radius:6px; border:1px solid var(--tool-card-border);">
                        <span style="font-size:0.8rem; color:var(--text-secondary);">Total Days</span>
                        <p style="font-size:1.2rem; font-weight:700; color:var(--text-primary); margin:0.2rem 0;">${totalDays.toLocaleString()}</p>
                    </div>
                    <div style="background:var(--surface-color); padding:0.8rem; border-radius:6px; border:1px solid var(--tool-card-border);">
                        <span style="font-size:0.8rem; color:var(--text-secondary);">Total Weeks</span>
                        <p style="font-size:1.2rem; font-weight:700; color:var(--text-primary); margin:0.2rem 0;">${totalWeeks.toLocaleString()}</p>
                    </div>
                    <div style="background:var(--surface-color); padding:0.8rem; border-radius:6px; border:1px solid var(--tool-card-border);">
                        <span style="font-size:0.8rem; color:var(--text-secondary);">Next Birthday in</span>
                        <p style="font-size:1.2rem; font-weight:700; color:var(--success-color); margin:0.2rem 0;">${daysToNextBday === 0 ? 'Today! 🎉' : `${daysToNextBday} Days`}</p>
                    </div>
                </div>
            </div>
        `);
        hideAlert();
    };
});
