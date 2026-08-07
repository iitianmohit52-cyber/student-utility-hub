import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox, createSelect } from '../../components/ui/index.js';

export default createTool('timeDurationCalculator', ({ container, showAlert, hideAlert }) => {
    let mode = 'dates'; // 'dates' or 'hours'
    
    // Dates Mode inputs
    let startDateVal = '';
    let endDateVal = '';
    
    // Hours Mode inputs
    let startTimeVal = '';
    let endTimeVal = '';

    const modeSelect = createSelect({
        id: 'calcMode',
        label: 'Calculation Mode:',
        options: [
            { value: 'dates', label: 'Duration Between Dates (Days, Months)' },
            { value: 'hours', label: 'Duration Between Hours (Hours, Minutes)' }
        ],
        onChange: (val) => {
            mode = val;
            updateModeVisibility();
        }
    });

    // Inputs Container for Dates Mode
    const datesContainer = document.createElement('div');
    const startInput = createInput({
        id: 'startDate',
        type: 'date',
        label: 'Start Date:',
        onChange: (val) => startDateVal = val
    });
    const endInput = createInput({
        id: 'endDate',
        type: 'date',
        label: 'End Date:',
        onChange: (val) => endDateVal = val
    });
    datesContainer.appendChild(startInput);
    datesContainer.appendChild(endInput);

    // Inputs Container for Hours Mode
    const hoursContainer = document.createElement('div');
    hoursContainer.style.display = 'none';
    const startTimeInput = createInput({
        id: 'startTime',
        type: 'time',
        label: 'Start Time:',
        onChange: (val) => startTimeVal = val
    });
    const endTimeInput = createInput({
        id: 'endTime',
        type: 'time',
        label: 'End Time:',
        onChange: (val) => endTimeVal = val
    });
    hoursContainer.appendChild(startTimeInput);
    hoursContainer.appendChild(endTimeInput);

    const calculateBtn = createButton({
        id: 'calculateDurationBtn',
        text: 'Calculate Duration',
        icon: '⌛',
        onClick: () => calculateDuration()
    });

    const resultBox = createResultBox({
        id: 'durationResult',
        title: 'Calculated Time Duration'
    });

    const layout = createToolLayout({
        inputs: [modeSelect, datesContainer, hoursContainer],
        actions: [calculateBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const updateModeVisibility = () => {
        if (mode === 'dates') {
            datesContainer.style.display = 'block';
            hoursContainer.style.display = 'none';
        } else {
            datesContainer.style.display = 'none';
            hoursContainer.style.display = 'block';
        }
        resultBox.hide();
    };

    const calculateDuration = () => {
        hideAlert();
        if (mode === 'dates') {
            if (!startDateVal || !endDateVal) {
                showAlert('Please select both start and end dates.', 'error');
                return;
            }

            const start = new Date(startDateVal);
            const end = new Date(endDateVal);

            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Calculate breakdown in years, months, days
            let years = end.getFullYear() - start.getFullYear();
            let months = end.getMonth() - start.getMonth();
            let days = end.getDate() - start.getDate();

            if (days < 0) {
                months--;
                const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
                days += prevMonth.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            resultBox.update(`
                <div style="font-size:0.95rem; line-height:1.6; text-align:center;">
                    <p style="font-size:1.2rem; color:var(--primary-color); font-weight:600; margin-bottom:0.5rem;">
                        Total: ${diffDays} Days
                    </p>
                    <p style="color:var(--text-secondary);">
                        Equivalent to: <strong>${Math.abs(years)}</strong> years, <strong>${Math.abs(months)}</strong> months, and <strong>${Math.abs(days)}</strong> days.
                    </p>
                </div>
            `);
        } else {
            if (!startTimeVal || !endTimeVal) {
                showAlert('Please choose both start and end times.', 'error');
                return;
            }

            const [startH, startM] = startTimeVal.split(':').map(Number);
            const [endH, endM] = endTimeVal.split(':').map(Number);

            let diffMin = (endH * 60 + endM) - (startH * 60 + startM);
            
            // If duration crosses midnight
            if (diffMin < 0) {
                diffMin += 24 * 60;
            }

            const hours = Math.floor(diffMin / 60);
            const minutes = diffMin % 60;

            resultBox.update(`
                <div style="font-size:0.95rem; line-height:1.6; text-align:center;">
                    <p style="font-size:1.25rem; color:var(--primary-color); font-weight:600;">
                        Duration: ${hours} Hour(s) & ${minutes} Minute(s)
                    </p>
                    <p style="color:var(--text-secondary); font-size:0.85rem; margin-top:0.3rem;">
                        Total: <strong>${diffMin} Minutes</strong>
                    </p>
                </div>
            `);
        }
    };
});
