import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JwtSecret:string = process.env.JWT_SECRET || "";

interface CustomRequest extends Request {
    userId?: string;
}

 export const authMiddleware=(req: CustomRequest, res: Response, next: NextFunction)=> {
    const token = req.headers["authorization"];

    if (!token) {
         res.status(403).json({
            message: "User not authenticated - token missing",
        });
    }

    try {
        const decoded = jwt.verify(token as string, JwtSecret) as JwtPayload;
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        res.status(403).json({
            message: "User not authenticated - invalid token",
        });
    }
}
