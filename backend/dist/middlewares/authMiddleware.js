"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JwtSecret = process.env.JWT_SECRET || "";
const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        res.status(403).json({
            message: "User not authenticated - token missing",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JwtSecret);
        req.body.userId = decoded.id;
        next();
    }
    catch (error) {
        res.status(403).json({
            message: "User not authenticated - invalid token",
        });
    }
};
exports.authMiddleware = authMiddleware;
