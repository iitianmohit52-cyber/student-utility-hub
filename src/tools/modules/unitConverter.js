import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        const units = {
                            length: { name: "Length", items: { meter: 1, kilometer: 1000, centimeter: 0.01, millimeter: 0.001, mile: 1609.34, yard: 0.9144, foot: 0.3048, inch: 0.0254, nautical_mile: 1852 } },
                            weight: { name: "Weight/Mass", items: { kilogram: 1, gram: 0.001, milligram: 0.000001, metric_ton: 1000, pound: 0.45359237, ounce: 0.0283495231, stone: 6.35029318 } },
                            temperature: { name: "Temperature", items: { celsius: 'celsius', fahrenheit: 'fahrenheit', kelvin: 'kelvin' } },
                            area: { name: "Area", items: { square_meter: 1, square_kilometer: 1000000, square_mile: 2589988.11, square_yard: 0.836127, square_foot: 0.092903, acre: 4046.86, hectare: 10000 } },
                            volume: { name: "Volume", items: { cubic_meter: 1, liter: 0.001, milliliter: 0.000001, US_gallon: 0.00378541, US_quart: 0.000946353, US_pint: 0.000473176, US_cup: 0.000236588, US_fluid_ounce: 0.0000295735, imperial_gallon: 0.00454609, imperial_quart: 0.00113652, imperial_pint: 0.000568261, imperial_fluid_ounce: 0.0000284131 } },
                            speed: { name: "Speed", items: { meters_per_second: 1, kilometers_per_hour: 0.277778, miles_per_hour: 0.44704, knot: 0.514444 } },
                            time: { name: "Time", items: { second: 1, minute: 60, hour: 3600, day: 86400, week: 604800, month_avg: 2629746, year_avg: 31556952 } },
                            // Add more categories like pressure, energy, power, data storage etc.
                        };


                        container.innerHTML = `
                            <label for="ucCategory">Category:</label>
                            <select id="ucCategory"></select>
                            <div style="display:flex; gap:10px; margin-top:10px; align-items:flex-end;">
                                <div style="flex:2">
                                    <label for="ucInputValue">Value:</label>
                                    <input type="number" id="ucInputValue" value="1">
                                </div>
                                <div style="flex:3">
                                    <label for="ucFromUnit">From:</label>
                                    <select id="ucFromUnit"></select>
                                </div>
                                <div style="font-size:1.5rem; padding-bottom:0.5rem;">⇄</div>
                                <div style="flex:3">
                                    <label for="ucToUnit">To:</label>
                                    <select id="ucToUnit"></select>
                                </div>
                            </div>
                            <div id="ucResult" class="result-area" style="margin-top:1rem; font-weight:bold; font-size:1.2rem; text-align:center;">Enter values and see result here</div>
                        `;


                        const categorySelect = container.querySelector('#ucCategory');
                        const fromUnitSelect = container.querySelector('#ucFromUnit');
                        const toUnitSelect = container.querySelector('#ucToUnit');
                        const valueInput = container.querySelector('#ucInputValue');
                        const resultDiv = container.querySelector('#ucResult');


                        function populateCategories() {
                            for (const categoryKey in units) {
                                const option = document.createElement('option');
                                option.value = categoryKey;
                                option.textContent = units[categoryKey].name;
                                categorySelect.appendChild(option);
                            }
                        }


                        function populateUnitOptions(categoryKey) {
                            const unitSet = units[categoryKey].items;
                            fromUnitSelect.innerHTML = '';
                            toUnitSelect.innerHTML = '';
                            let count = 0;
                            for (const unit in unitSet) {
                                const optionText = unit.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Prettify name
                                
                                const option1 = document.createElement('option');
                                option1.value = unit;
                                option1.textContent = optionText;
                                fromUnitSelect.appendChild(option1);


                                const option2 = document.createElement('option');
                                option2.value = unit;
                                option2.textContent = optionText;
                                toUnitSelect.appendChild(option2);
                                
                                if (count === 1 && Object.keys(unitSet).length > 1) { // Select second item for "To" unit by default if available
                                    option2.selected = true;
                                }
                                count++;
                            }
                             if (Object.keys(unitSet).length === 1) { // If only one unit, select it for "To" as well
                                 toUnitSelect.selectedIndex = 0;
                             }
                        }
                        
                        function convertUnits() {
                            const categoryKey = categorySelect.value;
                            const fromUnit = fromUnitSelect.value;
                            const toUnit = toUnitSelect.value;
                            const inputValue = parseFloat(valueInput.value);


                            if (isNaN(inputValue)) {
                                resultDiv.textContent = 'Invalid input value.';
                                resultDiv.style.color = 'var(--accent-color)';
                                return;
                            }
                            
                            hideAlert();
                            let result;
                            const unitFactors = units[categoryKey].items;


                            if (categoryKey === 'temperature') {
                                if (fromUnit === toUnit) { result = inputValue; }
                                else if (fromUnit === 'celsius') {
                                    if (toUnit === 'fahrenheit') result = (inputValue * 9/5) + 32;
                                    else if (toUnit === 'kelvin') result = inputValue + 273.15;
                                } else if (fromUnit === 'fahrenheit') {
                                    if (toUnit === 'celsius') result = (inputValue - 32) * 5/9;
                                    else if (toUnit === 'kelvin') result = (inputValue - 32) * 5/9 + 273.15;
                                } else if (fromUnit === 'kelvin') {
                                    if (toUnit === 'celsius') result = inputValue - 273.15;
                                    else if (toUnit === 'fahrenheit') result = (inputValue - 273.15) * 9/5 + 32;
                                }
                            } else {
                                const baseValue = inputValue * unitFactors[fromUnit];
                                result = baseValue / unitFactors[toUnit];
                            }
                            
                            if (typeof result === 'undefined') {
                                 resultDiv.textContent = 'Conversion not supported or error.';
                                 resultDiv.style.color = 'var(--accent-color)';
                            } else {
                                const fromUnitText = fromUnitSelect.options[fromUnitSelect.selectedIndex].text;
                                const toUnitText = toUnitSelect.options[toUnitSelect.selectedIndex].text;
                                // Use more decimal places for precision, especially for small numbers
                                const resultPrecision = Math.abs(result) > 0.0001 || result === 0 ? 4 : 8;
                                resultDiv.textContent = `${inputValue} ${fromUnitText} = ${result.toFixed(resultPrecision)} ${toUnitText}`;
                                resultDiv.style.color = 'var(--text-color)';
                            }
                        }


                        categorySelect.onchange = () => {
                            populateUnitOptions(categorySelect.value);
                            convertUnits(); // Convert immediately on category change
                        };
                        fromUnitSelect.onchange = convertUnits;
                        toUnitSelect.onchange = convertUnits;
                        valueInput.oninput = convertUnits;
                        
                        populateCategories();
                        populateUnitOptions(categorySelect.value); // Initial population for default category
                        convertUnits(); // Initial conversion
                    };
