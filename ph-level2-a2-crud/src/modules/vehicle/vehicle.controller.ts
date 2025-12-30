import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

// Create vehicle
const createVehicle = async (req: Request, res: Response) => {
    try {
        console.log("User from JWT:", req.user);

        const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
        const result = await vehicleServices.createVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Get all 
const getVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getVehicles();
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
};
// Get single
const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getSingleVehicle(req.params.vehicleId as string);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle fetched successfully",
                data: result.rows[0]
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
// Update vehicle
const updateVehicle = async (req: Request, res: Response) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    try {
        const result = await vehicleServices.updateVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.vehicleId!);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found!",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle updated successfully",
                data: result.rows[0]
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
// Delete vehicle
const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.deleteVehicle(req.params.vehicleId!);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully",
                data: result.rows
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Check vehicle availability for a given rental period
const checkAvailability = async (req: Request, res: Response) => {
    try {
        const { vehicle_id, rent_start_date, rent_end_date } = req.body;

        const isAvailable = await vehicleServices.checkVehicleAvailability(vehicle_id, rent_start_date, rent_end_date);

        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: "The vehicle is not available for the selected dates."
            });
        }

        return res.status(200).json({
            success: true,
            message: "The vehicle is available for the selected dates."
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred while checking vehicle availability."
        });
    }
};

// Update the availability status of a vehicle
const updateStatus = async (req: Request, res: Response) => {
    try {
        const { vehicle_id, status } = req.body;

        // Ensure the status is valid (can be expanded as needed)
        const validStatuses = ["available", "booked", "under maintenance"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status provided. Please provide a valid status."
            });
        }

        const updatedVehicle = await vehicleServices.updateVehicleStatus(vehicle_id, status);

        return res.status(200).json({
            success: true,
            message: "Vehicle status updated successfully.",
            data: updatedVehicle
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating vehicle status."
        });
    }
};

// Get the details of a specific vehicle by ID
const getVehicleDetails = async (req: Request, res: Response) => {
    try {
        const { vehicle_id } = req.params;

        const vehicle = await vehicleServices.getVehicleDetails(Number(vehicle_id));

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: vehicle
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred while fetching vehicle details."
        });
    }
};

// List all vehicles with optional filters (by availability, type)
const listVehicles = async (req: Request, res: Response) => {
    try {
        const { availability_status, type } = req.query;

        const vehicles = await vehicleServices.listAllVehicles(
            availability_status as string, 
            type as string
        );

        return res.status(200).json({
            success: true,
            data: vehicles
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred while listing vehicles."
        });
    }
};

export const vehicleControllers = {
    createVehicle,
    getVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
    checkAvailability,
    updateStatus,
    getVehicleDetails,
    listVehicles
}