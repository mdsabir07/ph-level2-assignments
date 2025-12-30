import { Request, Response } from "express";
import { userServices } from "./user.service";

// // Create user
// const createUser = async (req: Request, res: Response) => {
//     try {
//         const result = await userServices.createUser(req.body);
//         res.status(201).json({
//             success: true,
//             message: "User data inserted successfully",
//             data: result.rows[0]
//         })
//     } catch (error: any) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

// Get user
const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser();
        res.status(200).json({
            success: true,
            message: "User data retrieved successfully",
            data: result.rows
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        });
    }
};

// Update user
const updateUser = async (req: Request, res: Response) => {
    const { name, email, phone, role } = req.body;
    console.log(req.body);
    try {
        const result = await userServices.updateUser(name, email, phone, role, req.params.userId!);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User updated successfully!",
                data: result.rows[0]
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Delete user
const deleteUser = async(req:Request, res:Response)=>{
    try {
        const result = await userServices.deleteUser(req.params.userId!);
        if(result.rowCount===0){
            res.status(404).json({
                success:false,
                message: "User not found!"
            });
        }else{
            res.status(200).json({
                success: true,
                message: "User deleted successfully!",
                data: result.rows[0]
            });
        }
    } catch (error:any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const userControllers = {
    getUser,
    updateUser,
    deleteUser
}