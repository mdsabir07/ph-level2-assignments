import express from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// Route to create a booking
router.post("/", auth("customer", "admin"), bookingControllers.createBooking);

// Route to get all bookings (Admin) or user's own bookings (Customer)
router.get("/", auth("admin", "customer"), bookingControllers.getBookings);

// Route to update booking status (Cancel or Return)
router.put("/:bookingId", auth("customer", "admin"), bookingControllers.updateBookingStatus);

export default router;
