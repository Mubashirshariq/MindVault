"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const schema_1 = require("../models/schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
dotenv_1.default.config();
const URL = "/api/v1";
const JwtSecret = process.env.JWT_SECRET;
exports.router = express_1.default.Router();
// router.use(express.json());
//signup route
exports.router.post(`${URL}/signup`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const schema = zod_1.z.object({
        username: zod_1.z.string().min(5, { message: "Must be 5 or more characters long" }),
        password: zod_1.z.string().min(6, { message: "Must be 6 or more characters long" }).max(20, { message: "Must be 20 or fewer characters long" })
    });
    const parsedData = schema.safeParse({ username, password });
    if (!parsedData.success) {
        res.status(401).json({
            message: "Invalid data",
            errors: parsedData.error.errors
        });
    }
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield schema_1.User.create({
            username,
            password: hashedPassword
        });
        res.json({
            message: "User Signup successfull"
        });
    }
    catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
            message: "User signup unsuccessful",
            error: error
        });
    }
}));
//signin route
exports.router.post(`${URL}/signin`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const schema = zod_1.z.object({
        username: zod_1.z.string().min(5, { message: "Must be 5 or more characters long" }),
        password: zod_1.z.string().min(6, { message: "Must be 6 or more characters long" }).max(20, { message: "Must be 20 or fewer characters long" })
    });
    const parsedData = schema.safeParse({ username, password });
    if (!parsedData.success) {
        res.status(401).json({
            message: "Invalid data",
            errors: parsedData.error.errors
        });
    }
    try {
        const user = yield schema_1.User.findOne({ username });
        if (!user) {
            res.status(403).json({
                message: 'Login unsuccessful. User not found.',
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || '');
        if (!isPasswordValid) {
            res.status(403).json({
                message: 'Login unsuccessful. Incorrect password.',
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: (user === null || user === void 0 ? void 0 : user._id) || '' }, JwtSecret);
        res.json({
            message: 'Login successful',
            token,
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            message: 'An error occurred during login. Please try again later.',
        });
    }
}));
exports.router.post(`${URL}/content`, authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title, userId } = req.body;
    try {
        const content = yield schema_1.Content.create({
            link,
            type,
            title,
            tags: [],
            userId
        });
        res.json({
            message: "content created succesfully",
            content
        });
    }
    catch (error) {
        res.json({
            message: "error while posting content ", error
        });
    }
}));
exports.router.get(`${URL}/content`, authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    try {
        const content = yield schema_1.Content.find({
            userId
        }).populate("userId", "username");
        res.json({
            content
        });
    }
    catch (error) {
        res.status(404).json({
            message: "error while fetching content"
        });
    }
}));
exports.router.delete("api/v1/content", (req, res) => {
});
exports.router.post("api/v1/brain/:shareLink", (req, res) => {
});
