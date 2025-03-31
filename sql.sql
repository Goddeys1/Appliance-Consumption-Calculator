
CREATE DATABASE appliance_calculator;

USE appliance_calculator;

CREATE TABLE appliances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_rated BOOLEAN NOT NULL, -- TRUE for rated, FALSE for not rated
    star_rating VARCHAR(10), -- NULL for non-rated appliances
    consumption_per_hour INT NOT NULL -- Watt-hours (Wh)
);
