import express from "express";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = express.Router();
// Create a new vehicle
router.post("/", auth("admin"), vehicleControllers.createVehicle);

// Get all vehicles
router.get("/", vehicleControllers.getVehicles);

// Get a single vehicle by ID
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

// Update vehicle details
router.put("/:vehicleId", auth("admin"), vehicleControllers.updateVehicle);

// Delete a vehicle
router.delete("/:vehicleId", auth("admin"), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;