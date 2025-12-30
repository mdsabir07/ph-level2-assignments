import { Pool } from "pg";
import config from ".";

// DB
export const pool = new Pool({
    connectionString: `${config.connection_string}`
});

const initDB = async () => {
    // Users table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
            phone VARCHAR(15) NOT NULL,
            role VARCHAR(10) NOT NULL CHECK (role IN('admin', 'customer'))
        );
    `);

    // Vehicles table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(150) NOT NULL,
            type VARCHAR(15) NOT NULL CHECK (type IN('car', 'bike', 'van', 'SUV')),
            registration_number VARCHAR(100) UNIQUE NOT NULL,
            daily_rent_price DECIMAL(10, 2) NOT NULL CHECK (daily_rent_price > 0),
            availability_status VARCHAR(15) NOT NULL CHECK (availability_status IN('available', 'booked'))
        );    
    `);

    // Bookings table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date TIMESTAMP NOT NULL,
            rent_end_date TIMESTAMP NOT NULL,
            total_price DECIMAL(10, 2) NOT NULL, -- Calculated based on daily rate * duration
            status VARCHAR(50) DEFAULT 'booked', -- Track the booking status (e.g., 'booked', 'cancelled', 'returned')
            CHECK (rent_end_date > rent_start_date), -- Ensures rent_end_date is after rent_start_date
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

export default initDB;