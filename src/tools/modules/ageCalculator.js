import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        container.innerHTML = `
                            <label for="birthDate">Enter your Date of Birth:</label>
                            <input type="date" id="birthDate">
                            <button id="calculateAgeBtn">Calculate Age</button>
                            <div id="ageResult" class="result-area" style="display:none;"></div>
                        `;
                        const birthDateInput = container.querySelector('#birthDate');
                        const calculateBtn = container.querySelector('#calculateAgeBtn');
                        const ageResultDiv = container.querySelector('#ageResult');


                        calculateBtn.onclick = () => {
                            const birthDateString = birthDateInput.value;
                            if (!birthDateString) {
                                showAlert('Please enter your date of birth.', 'error');
                                ageResultDiv.style.display = 'none';
                                return;
                            }
                            const birthDate = new Date(birthDateString);
                            const today = new Date();


                            if (birthDate > today) {
                                showAlert('Birth date cannot be in the future.', 'error');
                                ageResultDiv.style.display = 'none';
                                return;
                            }


                            let years = today.getFullYear() - birthDate.getFullYear();
                            let months = today.getMonth() - birthDate.getMonth();
                            let days = today.getDate() - birthDate.getDate();


                            if (days < 0) {
                                months--;
                                // Get days in the previous month of 'today'
                                const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                                days += prevMonth.getDate();
                            }
                            if (months < 0) {
                                years--;
                                months += 12;
                            }
                            ageResultDiv.innerHTML = `You are: <br>
                                                    <strong>${years}</strong> years,
                                                    <strong>${months}</strong> months, and
                                                    <strong>${days}</strong> days old.`;
                            ageResultDiv.style.display = 'block';
                            hideAlert();
                        };
                    };
