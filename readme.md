# TO DO
### 1. Problem Statement Analysis - (Done)
### 2. UI Design (done)
### 3. Database Design and SetUp (In Progress)
### 4. Development (in progress)
### 5. Testing (Pending)
### 6. Completed (Pending)



# TransitOps

TransitOps is a reliable, high-performance transport management ecosystem designed to streamline fleet tracking, driver allocation, maintenance cycles, and financial auditing. Built completely from scratch for the Odoo Hackathon 2026, the application replaces fragmented spreadsheets with a secure, role-based, real-time tracking interface.

## Key System Functionalities

### 1. Multi-Role Authentication & Access Control (RBAC)
Secure login gateway supporting four distinct operational profiles, ensuring strict data segregation:
* **Fleet Manager:** Full CRUD access over the `Fleet` and `Maintenance` pipelines.
* **Dispatcher:** Manages the operational `Dashboard`, driver assignments, and live `Trips`.
* **Safety Officer:** Direct oversight of driver performance, health records, and `Compliance`.
* **Financial Analyst:** Dedicated read/write capabilities for `Fuel & Expenses` and platform-wide `Analytics`.

### 2. Intelligent Trip & Fleet Dispatch
* Dynamic availability engine checking vehicle and driver statuses before dispatching.
* Automated cargo capacity threshold validations to prevent logistics overloading.

### 3. Preventive Maintenance & Asset Lifecycle
* Logs vehicular wear-and-tear events alongside strict odometer-based triggers.
* Real-time downtime calculators linked directly to the primary operational dashboard.

### 4. Expense Auditing & Analytics
* Streamlined fuel cost and operational expense tracking.
* Dynamic statistical charts converting raw backend database tallies into actionable data.

## Database Schema Architecture

The platform runs on a local relational database setup with zero cloud dependencies:

* **`users`**: `id` (PK), `name`, `email`, `password_hash`, `role` (ENUM), `failed_attempts`, `locked_until`
* **`vehicles`**: `id` (PK), `model`, `plate_number`, `max_weight_capacity`, `status` (ENUM: Available, Active, Maintenance)
* **`drivers`**: `id` (PK), `user_id` (FK), `license_number`, `status` (ENUM: Available, On-Trip, Off-Duty)
* **`trips`**: `id` (PK), `dispatcher_id` (FK), `vehicle_id` (FK), `driver_id` (FK), `cargo_weight`, `status` (ENUM), `created_at`
* **`maintenance_logs`**: `id` (PK), `vehicle_id` (FK), `description`, `cost`, `scheduled_date`
* **`fuel_expenses`**: `id` (PK), `vehicle_id` (FK), `liters_filled`, `total_cost`, `logged_at`

## System Integration & Data Flow


[ Login Screen ] ---> Validation Middleware ---> JWT Token Generation (Role Injected)
|
+-----------------------+-----------------------+-------------+-------------+
|                       |                       |                           |
v                       v                       v                           v
[Fleet Manager]       [Dispatcher]          [Safety Officer]          [Financial Analyst]
|                       |                       |                           |
(Fleet & Maintenance) (Dashboard & Trips)   (Drivers & Compliance)     (Expenses & Analytics)
|                       |                       |                           |
+-----------------------+-----------------------+-------------+-------------+
|
v
[ Central Relational DB ]


1. **The Handshake:** A user signs in through the unified interface. The backend checks credentials and returns a secure token containing their operational role.
2. **Operational Safeguards:** When a `Dispatcher` schedules a new transit run, the API validates the relational keys in the database (`vehicles` and `drivers`). If validation clears, statuses are flipped instantly across the platform.
3. **Financial Side-Effects:** Any dynamic updates logged in the `Fuel & Expenses` table by operators are immediately accumulated by backend database queries, reflecting real-time shifts in the `Analytics` panel viewed by the `Financial Analyst`.

## Tech Stack & Installation

* **Frontend:** HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
* **Backend:** Node.js with Express.js
* **Database:** MySQL
