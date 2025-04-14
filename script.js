document.addEventListener('DOMContentLoaded', () => {
    const appliancesContainer = document.getElementById('appliancesContainer');
    const addApplianceButton = document.getElementById('addAppliance');
    const calculateButton = document.getElementById('calculate');
    const resultsDiv = document.getElementById('results');

    const ratedData = {
        "Refrigerator": { "5-star": 80, "4-star": 100, "3-star": 120, "2-star": 140, "1-star": 175 },
        "Air Conditioner": { "5-star": 900, "4-star": 1100, "3-star": 1300, "2-star": 1500, "1-star": 1700 },
        "Washing Machine": { "5-star": 100, "4-star": 125, "3-star": 160, "2-star": 200, "1-star": 250 },
        "LED TV": { "5-star": 40, "4-star": 50, "3-star": 70, "2-star": 100, "1-star": 110 },
        "Computer": { "5-star": 30, "4-star": 35, "3-star": 40, "2-star": 45, "1-star": 50 }
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

    const ratePerKWH = 1.69; // Rate in Ghanaian cedis

    // Add new appliance entry
    addApplianceButton.addEventListener('click', () => {
        const newEntry = appliancesContainer.firstElementChild.cloneNode(true);
        newEntry.querySelector('.remove-appliance').addEventListener('click', (e) => {
            e.target.parentElement.remove();
        });
        appliancesContainer.appendChild(newEntry);
    });

    // Calculate total consumption and cost
    calculateButton.addEventListener('click', () => {
        let totalConsumptionPerDayInKWH = 0;
        let totalDailyCost = 0;
        let totalWeeklyCost = 0;
        let totalMonthlyCost = 0;

        resultsDiv.innerHTML = ""; // Clear previous results

        appliancesContainer.querySelectorAll('.appliance-entry').forEach(entry => {
            const appliance = entry.querySelector('.appliance-select').value;
            const isRated = entry.querySelector('.is-rated-select').value;
            const starRating = isRated === 'rated' ? entry.querySelector('.star-rating-select').value : null;
            const hoursUsed = parseInt(entry.querySelector('.hours-used-input').value, 10);
            const daysUsed = parseInt(entry.querySelector('.days-used-input').value, 10);

            if (!appliance || appliance === "Choose" || isNaN(hoursUsed) || isNaN(daysUsed)) {
                // Skipping incomplete or invalid entries
                resultsDiv.innerHTML += `<p style="color: red;">Please fill all fields correctly for each appliance.</p>`;
                return;
            }

            let consumptionPerDayInKWH = 0;

            if (isRated === 'rated' && ratedData[appliance] && starRating) {
                consumptionPerDayInKWH = (ratedData[appliance][starRating] * hoursUsed) / 1000; // Convert watts to kWh
            } else if (isRated === 'not-rated' && notRatedData[appliance]) {
                consumptionPerDayInKWH = (notRatedData[appliance] * hoursUsed) / 1000; // Convert watts to kWh
            } else {
                resultsDiv.innerHTML += `<p style="color: red;">Invalid data for ${appliance}. Please check your input.</p>`;
                return;
            }

            // Calculate costs
            const dailyCost = consumptionPerDayInKWH * ratePerKWH;
            const weeklyCost = dailyCost * 7;
            const monthlyCost = dailyCost * daysUsed;

            totalConsumptionPerDayInKWH += consumptionPerDayInKWH;
            totalDailyCost += dailyCost;
            totalWeeklyCost += weeklyCost;
            totalMonthlyCost += monthlyCost;

            resultsDiv.innerHTML += `
                <p><strong>Appliance:</strong> ${appliance}</p>
                <p><strong>Daily Consumption:</strong> ${consumptionPerDayInKWH.toFixed(2)} kWh</p>
                <p><strong>Daily Cost:</strong> GHc ${dailyCost.toFixed(2)}</p>
                <p><strong>Weekly Cost:</strong> GHc ${weeklyCost.toFixed(2)}</p>
                <p><strong>Monthly Cost:</strong> GHc ${monthlyCost.toFixed(2)}</p>
                <hr>
            `;
        });

        // Total summary
        if (totalConsumptionPerDayInKWH > 0) {
            resultsDiv.innerHTML += `
                <h3>Total Consumption and Costs:</h3>
                <p><strong>Total Daily Consumption:</strong> ${totalConsumptionPerDayInKWH.toFixed(2)} kWh</p>
                <p><strong>Total Daily Cost:</strong> GHc ${totalDailyCost.toFixed(2)}</p>
                <p><strong>Total Weekly Cost:</strong> GHc ${totalWeeklyCost.toFixed(2)}</p>
                <p><strong>Total Monthly Cost:</strong> GHc ${totalMonthlyCost.toFixed(2)}</p>
            `;
        }
    });
});