// import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

// Get user
const getUser = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
};

// Update user
const updateUser = async (name: string, email: string, phone: string, role: string, id: string) => {
    const result = await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`, [name, email, phone, role, id]);
    console.log({ result });
    return result;
}
// Delete user
const deleteUser = async (id: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [id]);
    return result;
}

export const userServices = {
    getUser,
    updateUser,
    deleteUser
}