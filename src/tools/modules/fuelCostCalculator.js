import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox, createSelect } from '../../components/ui/index.js';

export default createTool('fuelCostCalculator', ({ container, showAlert, hideAlert }) => {
    let distance = 100;
    let fuelEconomy = 15; // km per liter / mpg
    let fuelPrice = 1.5; // cost per liter / gallon
    let unitType = 'metric'; // 'metric' (km, L, $/L) or 'imperial' (miles, gal, $/gal)

    const unitSelect = createSelect({
        id: 'fuelUnit',
        label: 'Unit System:',
        options: [
            { value: 'metric', label: 'Metric (Kilometers, Liters)' },
            { value: 'imperial', label: 'Imperial (Miles, Gallons)' }
        ],
        onChange: (val) => {
            unitType = val;
            updateLabels();
        }
    });

    const distanceInput = createInput({
        id: 'fuelDistance',
        type: 'number',
        label: 'Distance (km):',
        value: '100',
        min: 0.1,
        onChange: (val) => distance = parseFloat(val) || 0
    });

    const economyInput = createInput({
        id: 'fuelEconomy',
        type: 'number',
        label: 'Fuel Efficiency (km/L):',
        value: '15',
        min: 0.1,
        onChange: (val) => fuelEconomy = parseFloat(val) || 0
    });

    const priceInput = createInput({
        id: 'fuelPrice',
        type: 'number',
        label: 'Fuel Price (per Liter):',
        value: '1.5',
        min: 0.01,
        step: 0.01,
        onChange: (val) => fuelPrice = parseFloat(val) || 0
    });

    const calculateBtn = createButton({
        id: 'calculateFuelBtn',
        text: 'Calculate Fuel Cost',
        icon: '⛽',
        onClick: () => calculateFuel()
    });

    const resultBox = createResultBox({
        id: 'fuelResult',
        title: 'Trip Summary & Cost Breakdown'
    });

    const layout = createToolLayout({
        inputs: [unitSelect, distanceInput, economyInput, priceInput],
        actions: [calculateBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const updateLabels = () => {
        const distLabel = distanceInput.querySelector('label');
        const econLabel = economyInput.querySelector('label');
        const priceLabel = priceInput.querySelector('label');

        if (unitType === 'metric') {
            distLabel.textContent = 'Distance (km):';
            econLabel.textContent = 'Fuel Efficiency (km/L):';
            priceLabel.textContent = 'Fuel Price (per Liter):';
        } else {
            distLabel.textContent = 'Distance (miles):';
            econLabel.textContent = 'Fuel Efficiency (miles/gallon):';
            priceLabel.textContent = 'Fuel Price (per Gallon):';
        }
    };

    const calculateFuel = () => {
        if (distance <= 0 || fuelEconomy <= 0 || fuelPrice <= 0) {
            showAlert('Please enter positive values for all fields.', 'error');
            resultBox.hide();
            return;
        }
        hideAlert();

        const fuelRequired = distance / fuelEconomy;
        const totalCost = fuelRequired * fuelPrice;

        const volUnit = unitType === 'metric' ? 'Liters' : 'Gallons';
        const distUnit = unitType === 'metric' ? 'km' : 'miles';

        resultBox.update(`
            <div style="font-size:0.95rem; line-height:1.6;">
                <p style="border-bottom:1px solid var(--tool-card-border); padding-bottom:0.5rem; display:flex; justify-content:space-between;">
                    <span>Fuel Required:</span> 
                    <strong>${fuelRequired.toFixed(2)} ${volUnit}</strong>
                </p>
                <p style="border-bottom:1px solid var(--tool-card-border); padding-bottom:0.5rem; display:flex; justify-content:space-between;">
                    <span>Fuel Price:</span> 
                    <strong>${fuelPrice.toFixed(2)} per ${volUnit.slice(0, -1)}</strong>
                </p>
                <p style="font-size:1.1rem; color:var(--primary-color); display:flex; justify-content:space-between; margin-top:0.5rem;">
                    <span>Total Trip Cost:</span> 
                    <strong>$ / ₹ ${totalCost.toFixed(2)}</strong>
                </p>
            </div>
        `);
    };
});
