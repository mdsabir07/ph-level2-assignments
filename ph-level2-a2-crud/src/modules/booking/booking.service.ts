import { pool } from "../../config/db";

const calculateTotalPrice = (rent_start_date: string, rent_end_date: string, daily_rent_price: string) => {
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const numberOfDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24); 
    return parseFloat(daily_rent_price) * numberOfDays;
};

// Function to create a booking
const createBooking = async (customer_id: number, vehicle_id: number, rent_start_date: string, rent_end_date: string) => {
    // Step 1: Fetch vehicle details
    const vehicleResult = await pool.query(
        `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`,
        [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    const vehicle = vehicleResult.rows[0];
    const total_price = calculateTotalPrice(rent_start_date, rent_end_date, vehicle.daily_rent_price);

    // Step 2: Insert the booking into the bookings table
    const result = await pool.query(
        `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
         VALUES ($1, $2, $3, $4, $5, 'booked') 
         RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    // Step 3: Update the vehicle's status to "booked"
    await pool.query(
        `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
        [vehicle_id]
    );

    return {
        ...result.rows[0],
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price
        }
    };
};

// Function to get all bookings
const getAllBookings = async () => {
    const result = await pool.query("SELECT * FROM bookings");
    return result.rows;
};

// Function to get user bookings
const getUserBookings = async (userId: number) => {
    const result = await pool.query(
        `SELECT * FROM bookings WHERE customer_id = $1`,
        [userId]
    );
    return result.rows;
};

// Function to update booking status
const updateBookingStatus = async (bookingId: string, status: string) => {
    const result = await pool.query(
        `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
        [status, bookingId]
    );
    return result.rows[0];
};

export const bookingServices = {
    createBooking,
    getAllBookings,
    getUserBookings,
    updateBookingStatus
};
