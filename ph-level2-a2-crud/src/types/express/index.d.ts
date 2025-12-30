import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express{
        interface Request {
            user?: MainJwtPayload;
        }
    }

    interface MainJwtPayload extends JwtPayload {
        id: number;
        role: string;
    }
}