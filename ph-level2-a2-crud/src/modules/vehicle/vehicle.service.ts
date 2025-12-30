import { pool } from "../../config/db"

// Create vehicle
const createVehicle = async (vehicle_name: string, type: string, registration_number: string, daily_rent_price: string, availability_status: string) => {
    const result = await pool.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) 
        VALUES($1, $2, $3, $4, $5)
        RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );
    const newResult = result.rows[0];
    return {
        newResult: {
            id: newResult.id,
            vehicle_name: newResult.vehicle_name,
            type: newResult.type,
            registration_number: newResult.registration_number,
            daily_rent_price: newResult.daily_rent_price,
            availability_status: newResult.availability_status
        }
    };
};
// Get vehicle
const getVehicles = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result;
};
// Get single
const getSingleVehicle = async (id: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
    return result;
}
// Update vehicle
const updateVehicle = async (vehicle_name: string, type: string, registration_number: string, daily_rent_price: string, availability_status: string, id: string) => {
    const result = await pool.query(
        `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
    );
    return result;
}
// Delete vehicle
const deleteVehicle = async (id: string) => {
    const result = await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`, [id]);
    // console.log({result});
    return result;
}

// Check if the vehicle is available for the given dates
const checkVehicleAvailability = async (vehicle_id: number, rent_start_date: string, rent_end_date: string) => {
    const result = await pool.query(
        `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active' AND 
        (rent_start_date < $2 AND rent_end_date > $3)`, 
        [vehicle_id, rent_end_date, rent_start_date]
    );
    
    // If there's an active booking that overlaps with the desired period, it's not available
    return result.rows.length === 0;
};

// Update vehicle status (e.g., mark it as booked)
const updateVehicleStatus = async (vehicle_id: number, status: string) => {
    const result = await pool.query(
        `UPDATE vehicles SET availability_status = $1 WHERE id = $2 RETURNING id, availability_status`,
        [status, vehicle_id]
    );

    return result.rows[0]; // Return updated vehicle status
};

// Get vehicle details by ID
const getVehicleDetails = async (vehicle_id: number) => {
    const result = await pool.query(
        `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
        FROM vehicles WHERE id = $1`,
        [vehicle_id]
    );
    
    return result.rows[0]; // Return vehicle details
};

// List all vehicles with optional filtering (by availability or type)
const listAllVehicles = async (availability_status?: string, type?: string) => {
    let query = `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status 
                 FROM vehicles WHERE 1=1`;
    const params: string[] = [];

    if (availability_status) {
        query += ` AND availability_status = $${params.length + 1}`;
        params.push(availability_status);
    }

    if (type) {
        query += ` AND type = $${params.length + 1}`;
        params.push(type);
    }

    const result = await pool.query(query, params);
    return result.rows; // Return all matching vehicles
};

export const vehicleServices = {
    createVehicle,
    getVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
    checkVehicleAvailability,
    updateVehicleStatus,
    getVehicleDetails,
    listAllVehicles
}