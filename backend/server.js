const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'transitops_jwt_secret_2026';

// Token Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: "Access Denied: Missing authorization token." });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Access Denied: Invalid or expired token." });
        }
        req.user = decoded;
        next();
    });
}

// Role-Based Access Control Middleware
function requireRole(allowedRolesArray) {
    return (req, res, next) => {
        if (!req.user || !allowedRolesArray.includes(req.user.role)) {
            return res.status(403).json({ 
                error: "Access Denied: Insufficient operational clearance for this resource." 
            });
        }
        next();
    };
}

// Main Root Route
app.get('/', (req, res) => {
    res.send("TransitOps Backend Engine is Live!");
});

// Health check to test database connection
app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({ status: "success", message: "Backend and MySQL DB are communicating perfectly!" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 📌 1. VEHICLES DATA ROUTE (Main Data)
app.get('/api/vehicles', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vehicles');
        res.json({ status: "success", data: rows });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 📌 2. DRIVERS DATA ROUTE
app.get('/api/drivers', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM drivers');
        res.json({ status: "success", data: rows });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 🔑 Authentication Routes
// POST /api/auth/signup: Checks if email exists, hashes the password using bcryptjs (10 salt rounds), and inserts the record.
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "Missing required fields (name, email, password, role)." });
    }
    
    // Check if role is valid
    const validRoles = ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role specified." });
    }

    try {
        // Check if user exists
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, passwordHash, role]
        );

        res.status(201).json({ status: "success", message: "User registered successfully.", userId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/login: Validates user credentials using bcrypt.compare and returns a secure JWT signed for exactly 8h payloading { id, role }.
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password." });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ status: "success", token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🚛 Trips Dispatch Route (Protected: Dispatcher only)
app.post('/api/trips', authenticateToken, requireRole(['Dispatcher']), async (req, res) => {
    const { vehicle_id, driver_id, cargo_weight } = req.body;
    if (!vehicle_id || !driver_id || !cargo_weight) {
        return res.status(400).json({ error: "Missing required fields (vehicle_id, driver_id, cargo_weight)." });
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Validate vehicle exists and check cargo capacity
        const [vehicles] = await conn.query('SELECT max_weight_capacity, status FROM vehicles WHERE id = ? FOR UPDATE', [vehicle_id]);
        if (vehicles.length === 0) {
            await conn.rollback();
            return res.status(404).json({ error: "Vehicle not found." });
        }
        const vehicle = vehicles[0];
        if (cargo_weight > vehicle.max_weight_capacity) {
            await conn.rollback();
            return res.status(400).json({ error: `Cargo weight (${cargo_weight} kg) exceeds vehicle max capacity (${vehicle.max_weight_capacity} kg).` });
        }
        if (vehicle.status === 'Maintenance') {
            await conn.rollback();
            return res.status(400).json({ error: "Vehicle is currently in Maintenance and cannot be dispatched." });
        }

        // 2. Validate driver exists and is available
        const [drivers] = await conn.query('SELECT status FROM drivers WHERE id = ? FOR UPDATE', [driver_id]);
        if (drivers.length === 0) {
            await conn.rollback();
            return res.status(404).json({ error: "Driver not found." });
        }
        const driver = drivers[0];
        if (driver.status !== 'Available') {
            await conn.rollback();
            return res.status(400).json({ error: `Driver is currently not available (Status: ${driver.status}).` });
        }

        // 3. Insert trip
        const [tripResult] = await conn.query(
            'INSERT INTO trips (dispatcher_id, vehicle_id, driver_id, cargo_weight, status) VALUES (?, ?, ?, ?, "Dispatched")',
            [req.user.id, vehicle_id, driver_id, cargo_weight]
        );

        // Update driver status to 'On-Trip'
        await conn.query('UPDATE drivers SET status = "On-Trip" WHERE id = ?', [driver_id]);

        // Update vehicle status to 'Active'
        await conn.query('UPDATE vehicles SET status = "Active" WHERE id = ?', [vehicle_id]);

        await conn.commit();
        res.status(201).json({ status: "success", message: "Trip dispatched successfully.", tripId: tripResult.insertId });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// 📊 Analytics Overview Route (Protected: Financial Analyst or Fleet Manager)
app.get('/api/analytics/overview', authenticateToken, requireRole(['Financial Analyst', 'Fleet Manager']), async (req, res) => {
    try {
        // Aggregates total costs
        const [maintenanceSumResult] = await db.query('SELECT COALESCE(SUM(cost), 0) AS total_maintenance FROM maintenance_logs');
        const [fuelSumResult] = await db.query('SELECT COALESCE(SUM(total_cost), 0) AS total_fuel FROM fuel_expenses');
        
        const total_maintenance = parseFloat(maintenanceSumResult[0].total_maintenance);
        const total_fuel = parseFloat(fuelSumResult[0].total_fuel);
        const total_operational_cost = total_maintenance + total_fuel;

        // Window group ranking query for top 3 most expensive vehicles based on maintenance history
        const rankQuery = `
            WITH ranked_maintenance AS (
                SELECT 
                    vehicle_id,
                    SUM(cost) AS total_maintenance_cost,
                    DENSE_RANK() OVER (ORDER BY SUM(cost) DESC) as cost_rank
                FROM maintenance_logs
                GROUP BY vehicle_id
            )
            SELECT r.vehicle_id, r.total_maintenance_cost, r.cost_rank, v.model, v.plate_number
            FROM ranked_maintenance r
            JOIN vehicles v ON r.vehicle_id = v.id
            WHERE r.cost_rank <= 3
            ORDER BY r.cost_rank ASC
        `;
        const [topVehicles] = await db.query(rankQuery);

        res.json({
            status: "success",
            overview: {
                total_maintenance_cost: total_maintenance,
                total_fuel_cost: total_fuel,
                total_operational_cost: total_operational_cost
            },
            top_expensive_vehicles: topVehicles
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`⚡ TransitOps System Ready!`);
});