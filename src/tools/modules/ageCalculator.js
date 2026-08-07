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
        title: 'Your Exact Age'
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
        
        const birthDate = new Date(selectedDate);
        const today = new Date();

        if (birthDate > today) {
            showAlert('Birth date cannot be in the future.', 'error');
            resultBox.hide();
            return;
        }

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        resultBox.update(`You are:<br>
            <strong>${years}</strong> years, 
            <strong>${months}</strong> months, and 
            <strong>${days}</strong> days old.
        `);
        hideAlert();
    };
});
