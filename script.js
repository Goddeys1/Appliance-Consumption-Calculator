document.addEventListener('DOMContentLoaded', () => {
    const appliancesContainer = document.getElementById('appliancesContainer');
    const addApplianceButton = document.getElementById('addAppliance');
    const calculateButton = document.getElementById('calculate');
    const resetButton = document.getElementById('resetCalculator');
    const currencySelector = document.getElementById('currencySelector');
    const themeToggle = document.getElementById('themeToggle');
    const resultsDiv = document.getElementById('results');
    const applianceTemplate = appliancesContainer.firstElementChild ? appliancesContainer.firstElementChild.cloneNode(true) : null;

    const ratedData = {
        "Refrigerator": { "5-star": 80, "4-star": 100, "3-star": 120, "2-star": 140, "1-star": 175 },
        "Air Conditioner": { "5-star": 900, "4-star": 1100, "3-star": 1300, "2-star": 1500, "1-star": 1700 },
        "Washing Machine": { "5-star": 100, "4-star": 125, "3-star": 160, "2-star": 200, "1-star": 250 },
        "LED TV": { "5-star": 40, "4-star": 50, "3-star": 70, "2-star": 100, "1-star": 110 },
    };

    const notRatedData = {
        "Steam Iron": 3000,
        "Dry Iron": 2000,
        "Laptop": 45,
        "Sound System": 80,
        "Desktop Computer": 90,
        "Refrigerator": 123,
        "Air Conditioner": 1300,
        "Washing Machine": 167,
        "LED TV": 74
    };

    const ratePerKWH = 1.69; // base rate in Ghanaian cedis
    const currencyRates = {
        GHS: 1,
        USD: 0.065,
        GBP: 0.055,
        EUR: 0.058
    };

    function formatCurrency(value, currency = currencySelector.value) {
        const symbolMap = {
            GHS: 'GH₵',
            USD: '$',
            GBP: '£',
            EUR: '€'
        };

        const convertedValue = value * currencyRates[currency];
        return `${symbolMap[currency]} ${convertedValue.toFixed(2)}`;
    }

    function applyTheme(theme) {
        const isDark = theme === 'dark';
        document.body.classList.toggle('dark-theme', isDark);
        themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }

    function saveState() {
        const entries = Array.from(appliancesContainer.querySelectorAll('.appliance-entry')).map(entry => ({
            appliance: entry.querySelector('.appliance-select').value,
            isRated: entry.querySelector('.is-rated-select').value,
            starRating: entry.querySelector('.star-rating-select').value,
            hoursUsed: entry.querySelector('.hours-used-input').value,
            daysUsed: entry.querySelector('.days-used-input').value
        }));

        const state = {
            currency: currencySelector.value,
            theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
            entries
        };

        localStorage.setItem('jehm_appliance_calculator_state', JSON.stringify(state));
    }

    function restoreState() {
        const savedState = localStorage.getItem('jehm_appliance_calculator_state');

        if (!savedState) {
            resetCalculator();
            return;
        }

        try {
            const state = JSON.parse(savedState);
            const selectedCurrency = state.currency || 'GHS';
            const selectedTheme = state.theme || 'light';
            const entries = Array.isArray(state.entries) && state.entries.length ? state.entries : [{}];

            currencySelector.value = selectedCurrency;
            applyTheme(selectedTheme);
            appliancesContainer.innerHTML = '';

            entries.forEach((entryData) => {
                const entry = createApplianceEntry(entryData);
                if (entry) {
                    appliancesContainer.appendChild(entry);
                }
            });

            resultsDiv.innerHTML = '<p>Saved calculator data restored.</p>';
        } catch (error) {
            console.error('Could not restore saved state:', error);
            resetCalculator();
        }
    }

    function createApplianceEntry(entryData = {}) {
        if (!applianceTemplate) {
            return null;
        }

        const newEntry = applianceTemplate.cloneNode(true);
        const removeButton = newEntry.querySelector('.remove-appliance');

        const applianceSelect = newEntry.querySelector('.appliance-select');
        const isRatedSelect = newEntry.querySelector('.is-rated-select');
        const starRatingSelect = newEntry.querySelector('.star-rating-select');
        const hoursInput = newEntry.querySelector('.hours-used-input');
        const daysInput = newEntry.querySelector('.days-used-input');

        applianceSelect.value = entryData.appliance || 'Choose';
        isRatedSelect.value = entryData.isRated || 'Choose';
        starRatingSelect.value = entryData.starRating || 'Choose';
        hoursInput.value = entryData.hoursUsed || '';
        daysInput.value = entryData.daysUsed || '';

        [applianceSelect, isRatedSelect, starRatingSelect, hoursInput, daysInput].forEach(field => {
            field.addEventListener('input', saveState);
            field.addEventListener('change', saveState);
        });

        removeButton.addEventListener('click', (event) => {
            const entry = event.target.closest('.appliance-entry');
            if (entry && appliancesContainer.querySelectorAll('.appliance-entry').length > 1) {
                entry.remove();
                saveState();
            }
        });

        return newEntry;
    }

    function resetCalculator() {
        appliancesContainer.innerHTML = '';
        const firstEntry = createApplianceEntry();

        if (firstEntry) {
            appliancesContainer.appendChild(firstEntry);
        }

        resultsDiv.innerHTML = '<p>Ready to calculate your appliance usage.</p>';
        saveState();
    }

    addApplianceButton.addEventListener('click', () => {
        const newEntry = createApplianceEntry();
        if (newEntry) {
            appliancesContainer.appendChild(newEntry);
            saveState();
        }
    });

    resetButton.addEventListener('click', () => {
        resetCalculator();
    });

    currencySelector.addEventListener('change', () => {
        saveState();
    });

    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(nextTheme);
        saveState();
    });

    calculateButton.addEventListener('click', () => {
        let totalConsumptionPerDayInKWH = 0;
        let totalDailyCost = 0;
        let totalWeeklyCost = 0;
        let totalMonthlyCost = 0;
        let totalAnnualCost = 0;
        let hasValidEntries = false;

        resultsDiv.innerHTML = "";

        appliancesContainer.querySelectorAll('.appliance-entry').forEach(entry => {
            const appliance = entry.querySelector('.appliance-select').value;
            const isRated = entry.querySelector('.is-rated-select').value;
            const starRating = isRated === 'rated' ? entry.querySelector('.star-rating-select').value : null;
            const hoursUsed = parseInt(entry.querySelector('.hours-used-input').value, 10);
            const daysUsed = parseInt(entry.querySelector('.days-used-input').value, 10);

            if (!appliance || appliance === 'Choose' || isNaN(hoursUsed) || isNaN(daysUsed)) {
                return;
            }

            let consumptionPerDayInKWH = 0;

            if (isRated === 'rated' && ratedData[appliance] && starRating) {
                consumptionPerDayInKWH = (ratedData[appliance][starRating] * hoursUsed) / 1000;
            } else if (isRated === 'not-rated' && notRatedData[appliance]) {
                consumptionPerDayInKWH = (notRatedData[appliance] * hoursUsed) / 1000;
            } else {
                resultsDiv.innerHTML += `<p style="color: red;">Invalid data for ${appliance}. Please check your input.</p>`;
                return;
            }

            const dailyCost = consumptionPerDayInKWH * ratePerKWH;
            const weeklyCost = dailyCost * 7;
            const monthlyCost = dailyCost * daysUsed;
            const annualCost = monthlyCost * 12;

            hasValidEntries = true;
            totalConsumptionPerDayInKWH += consumptionPerDayInKWH;
            totalDailyCost += dailyCost;
            totalWeeklyCost += weeklyCost;
            totalMonthlyCost += monthlyCost;
            totalAnnualCost += annualCost;

            resultsDiv.innerHTML += `
                <div class="result-item">
                    <p><strong>Appliance:</strong> ${appliance}</p>
                    <p><strong>Daily Consumption:</strong> ${consumptionPerDayInKWH.toFixed(2)} kWh</p>
                    <p><strong>Daily Cost:</strong> ${formatCurrency(dailyCost)}</p>
                    <p><strong>Weekly Cost:</strong> ${formatCurrency(weeklyCost)}</p>
                    <p><strong>Monthly Cost:</strong> ${formatCurrency(monthlyCost)}</p>
                </div>
            `;
        });

        if (!hasValidEntries) {
            resultsDiv.innerHTML = '<p style="color: red;">Please complete all appliance details before calculating.</p>';
            return;
        }

        resultsDiv.innerHTML += `
            <div class="summary-card">
                <h3>Total Consumption and Costs</h3>
                <p><strong>Total Daily Consumption:</strong> ${totalConsumptionPerDayInKWH.toFixed(2)} kWh</p>
                <p><strong>Total Daily Cost:</strong> ${formatCurrency(totalDailyCost)}</p>
                <p><strong>Total Weekly Cost:</strong> ${formatCurrency(totalWeeklyCost)}</p>
                <p><strong>Total Monthly Cost:</strong> ${formatCurrency(totalMonthlyCost)}</p>
                <p><strong>Total Annual Cost:</strong> ${formatCurrency(totalAnnualCost)}</p>
            </div>
        `;
    });

    restoreState();
});