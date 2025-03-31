<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $appliances = $_POST['appliances']; // Array of appliances with details
    $ratePerKWH = 1.69;

    $ratedData = [
        "Refrigerator" => ["5-star" => 80, "4-star" => 100, "3-star" => 120, "2-star" => 140, "1-star" => 175],
        "Air Conditioner" => ["5-star" => 900, "4-star" => 1100, "3-star" => 1300, "2-star" => 1500, "1-star" => 1700],
        "Washing Machine" => ["5-star" => 100, "4-star" => 125, "3-star" => 160, "2-star" => 200, "1-star" => 250],
        "LED TV" => ["5-star" => 40, "4-star" => 50, "3-star" => 70, "2-star" => 100, "1-star" => 110],
        "Computer" => ["5-star" => 30, "4-star" => 35, "3-star" => 40, "2-star" => 45, "1-star" => 50]
    ];

    $notRatedData = [
        "Steam Iron" => 3000,
        "Dry Iron" => 2000,
        "Laptop" => 45,
        "Sound System" => 80,
        "Desktop Computer" => 90,
        "Refrigerator" => 123,
        "Air Conditioner" => 1300,
        "Washing Machine" => 167,
        "LED TV" => 74
    ];

    $totalConsumption = 0;
    $totalDailyCost = 0;

    foreach ($appliances as $appliance) {
        $name = $appliance['name'];
        $hoursUsed = $appliance['hoursUsed'];
        $daysUsed = $appliance['daysUsed'];

        if ($appliance['isRated'] === 'true') {
            $starRating = $appliance['starRating'];
            $consumptionPerDay = $ratedData[$name][$starRating] * $hoursUsed;
        } else {
            $consumptionPerDay = $notRatedData[$name] * $hoursUsed;
        }

        $monthlyConsumption = $consumptionPerDay * $daysUsed;
        $totalConsumption += $monthlyConsumption;

        $dailyCost = ($consumptionPerDay / 1000) * $ratePerKWH;
        $totalDailyCost += $dailyCost;

        $weeklyCost = $dailyCost * 7;
        $monthlyCost = $dailyCost * $daysUsed;

        echo json_encode([
            'dailyCost' => number_format($dailyCost, 2),
            'weeklyCost' => number_format($weeklyCost, 2),
            'monthlyCost' => number_format($monthlyCost, 2)
        ]);
    }
}
?>
