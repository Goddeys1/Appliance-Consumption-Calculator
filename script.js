document.getElementById('calculate').addEventListener('click', function () {
    const appliance = document.getElementById('appliance').value;
    const isRated = document.getElementById('isRated').value;
    const starRating = isRated === 'rated' ? document.getElementById('starRating').value : null;
    const hoursUsed = parseInt(document.getElementById('hoursUsed').value, 10);
    const daysUsed = parseInt(document.getElementById('daysUsed').value, 10);

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

    const ratePerKWH = 1.69; // Rate in GHc
    let consumptionPerDayInKWH = 0; // Daily consumption in kWh

    // Calculate daily consumption
    if (isRated === 'rated') {
        consumptionPerDayInKWH = (ratedData[appliance][starRating] * hoursUsed) / 1000;
    } else {
        consumptionPerDayInKWH = (notRatedData[appliance] * hoursUsed) / 1000;
    }

    // Calculate costs
    const dailyCost = consumptionPerDayInKWH * ratePerKWH;
    const weeklyCost = dailyCost * 7;
    const monthlyCost = dailyCost * daysUsed;

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <p><strong>Appliance:</strong> ${appliance}</p>
        <p><strong>Daily Consumption:</strong> ${consumptionPerDayInKWH.toFixed(2)} kWh</p>
        <p><strong>Daily Cost:</strong> GHc ${dailyCost.toFixed(2)}</p>
        <p><strong>Weekly Cost:</strong> GHc ${weeklyCost.toFixed(2)}</p>
        <p><strong>Monthly Cost:</strong> GHc ${monthlyCost.toFixed(2)}</p>
    `;
});
