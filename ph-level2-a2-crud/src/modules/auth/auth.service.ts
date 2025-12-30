import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

// SignUp user 
const signUp = async (name: string, email: string, password: string, phone: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

    // If user exists, return null to prevent creating duplicate user
    if (result.rows.length > 0) {
        return null;
    };

    // Hash the password before inserting into the database
    const hashedPass = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertResult = await pool.query(
        `INSERT INTO users (name, email, password, phone, role)
        VALUES($1, $2, $3, $4, $5)
        RETURNING id, name, email, phone, role`,
        [name, email, hashedPass, phone, 'customer']
    );

    // console.log('Insert result:', insertResult.rows); 

    if (insertResult.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    // Get the newly created user
    const newUser = insertResult.rows[0];

    // Generate a JWT token for the new user
    const token = jwt.sign(
        { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
        config.jwtSecret as string,
        { expiresIn: "5d" }
    );

    // console.log({ token }); 
    return { token, user: newUser };
};

// SingIn user
const signIn = async (email: string, password: string) => {
    // step: 1 Find the user by email
    const result = await pool.query(
        `SELECT * FROM users WHERE email=$1`, [email]
    );

    if (result.rows.length === 0) {
        return null;
    };
    const user = result.rows[0]

    // step: 2 Compare the password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return null;
    };

    // step: 3 Generate the JWT token
    const token = jwt.sign({
        id: user.id, name: user.name, email: user.email, role: user.role
    }, config.jwtSecret as string, {
        expiresIn: "5d"
    });

    // step: 4 Return the token and user data
    return {
        token, user: {
            id: user.id, name: user.name, email: user.email, role: user.role
        }
    };

}

export const authServices = {
    signUp,
    signIn
};
