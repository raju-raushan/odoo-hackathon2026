-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM(
        'Fleet Manager',
        'Dispatcher',
        'Safety Officer',
        'Financial Analyst'
    ) NOT NULL,
    INDEX idx_users_email (email)
);

-- 2. Create Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    plate_number VARCHAR(50) UNIQUE NOT NULL,
    max_weight_capacity INT NOT NULL,
    status ENUM(
        'Available',
        'Active',
        'Maintenance'
    ) DEFAULT 'Available',
    INDEX idx_vehicles_status (status)
);

-- 3. Create Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM(
        'Available',
        'On-Trip',
        'Off-Duty'
    ) DEFAULT 'Available',
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_drivers_status (status),
    INDEX idx_drivers_user_id (user_id)
);

-- 4. Create Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dispatcher_id INT,
    vehicle_id INT,
    driver_id INT,
    cargo_weight INT NOT NULL,
    status ENUM(
        'Dispatched',
        'Completed',
        'Cancelled'
    ) DEFAULT 'Dispatched',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispatcher_id) REFERENCES users (id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    FOREIGN KEY (driver_id) REFERENCES drivers (id),
    INDEX idx_trips_dispatcher (dispatcher_id),
    INDEX idx_trips_vehicle (vehicle_id),
    INDEX idx_trips_driver (driver_id)
);

-- 5. Create Maintenance Logs Table
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT,
    description TEXT,
    cost DECIMAL(10, 2) NOT NULL,
    scheduled_date DATE NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE CASCADE,
    INDEX idx_maintenance_vehicle (vehicle_id)
);

-- 6. Create Fuel Expenses Table
CREATE TABLE IF NOT EXISTS fuel_expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT,
    liters_filled DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE CASCADE,
    INDEX idx_fuel_vehicle (vehicle_id)
);