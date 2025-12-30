import express from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// create a booking
router.post("/", auth("customer", "admin"), bookingControllers.createBooking);

// get all bookings
router.get("/", auth("admin", "customer"), bookingControllers.getBookings);

// update booking 
router.put("/:bookingId", auth("customer", "admin"), bookingControllers.updateBookingStatus);

export default router;
