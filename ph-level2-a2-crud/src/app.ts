import express, { Request, Response } from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";

const app = express();

// parser
app.use(express.json());

// initializing db
initDB();

// "/"-> localhost:5000
app.get('/', (req: Request, res: Response) => {
    res.send("Hello assignment two!");
});

// Users route
app.use("/api/v1/users", userRoutes);

// Auth route
app.use("/api/v1/auth", authRoutes);

// Vehicle route
app.use("/api/v1/vehicles", vehicleRoutes);

// Booking route
app.use("/api/v1/bookings", vehicleRoutes);

// 404 route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found!",
        path: req.path
    })
})

export default app;