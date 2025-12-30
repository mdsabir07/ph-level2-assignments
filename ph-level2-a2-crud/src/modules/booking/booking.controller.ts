import { Request, Response } from "express";
import { bookingServices } from "./booking.service";
import { vehicleServices } from "../vehicles/vehicle.service";

// create a booking
const createBooking = async (req: Request, res: Response) => {
    try {
        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

        // Validate if vehicle is available for the given date range
        const isAvailable = await vehicleServices.checkVehicleAvailability(vehicle_id, rent_start_date, rent_end_date);
        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: "The vehicle is not available for the selected dates."
            });
        }

        // Create the booking
        const booking = await bookingServices.createBooking(customer_id, vehicle_id, rent_start_date, rent_end_date);

        // Return the booking data with vehicle details
        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create booking."
        });
    }
};

// get all bookings
const getBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (userRole === 'admin') {
            const bookings = await bookingServices.getAllBookings();
            return res.status(200).json({
                success: true,
                message: "Bookings fetched successfully",
                data: bookings
            });
        }

        // For customers, return only their own bookings
        const bookings = await bookingServices.getUserBookings(userId);
        return res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: bookings
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch bookings."
        });
    }
};

// update booking status
const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const bookingId = req.params.bookingId;
        const { status } = req.body; // 'cancelled' or 'returned'

        // Handle status change
        if (status === 'cancelled' || status === 'returned') {
            const updatedBooking = await bookingServices.updateBookingStatus(bookingId, status);

            // Update vehicle availability when booking status changes
            await vehicleServices.updateVehicleStatus(updatedBooking.vehicle_id, 'available');

            return res.status(200).json({
                success: true,
                message: `Booking marked as ${status} successfully.`,
                data: updatedBooking
            });
        }

        return res.status(400).json({
            success: false,
            message: "Invalid booking status provided."
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update booking status."
        });
    }
};

export const bookingControllers = {
    createBooking,
    getBookings,
    updateBookingStatus
};