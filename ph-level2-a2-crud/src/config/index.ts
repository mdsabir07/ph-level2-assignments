import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), '.env') });

// console.log("PORT:", process.env.PORT);
// console.log("CONNECTION_STRING:", process.env.CONNECTION_STRING);

const config = {
    connection_string: process.env.CONNECTION_STRING,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET
};

export default config;