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
const generateRandomLink_1 = require("../utils/generateRandomLink");
const generative_ai_1 = require("@google/generative-ai");
const vector_1 = require("../utils/vector");
dotenv_1.default.config();
const URL = "/api/v1";
const JwtSecret = process.env.JWT_SECRET;
const gemini_api_key = process.env.GEMINI_API_KEY;
function AiPipeline() {
    return __awaiter(this, void 0, void 0, function* () {
        const genAI = new generative_ai_1.GoogleGenerativeAI(gemini_api_key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Explain how AI works";
        try {
            const result = yield model.generateContent(prompt);
            return result.response.text();
        }
        catch (error) {
            console.error("Error in AiPipeline:", error);
            throw new Error("AI Pipeline failed");
        }
    });
}
exports.router = express_1.default.Router();
// router.use(express.json());
//signup route
exports.router.post(`${URL}/signup`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const schema = zod_1.z.object({
        username: zod_1.z.string().min(5, { message: "Must be 5 or more characters long" }),
        password: zod_1.z.string().min(4, { message: "Must be 6 or more characters long" }).max(20, { message: "Must be 20 or fewer characters long" })
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
        password: zod_1.z.string().min(4, { message: "Must be 6 or more characters long" }).max(20, { message: "Must be 20 or fewer characters long" })
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
//posting content
exports.router.post(`${URL}/content`, authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title, userId, description } = req.body;
    console.log("body", req.body);
    try {
        const content = yield schema_1.Content.create({
            link,
            type,
            title,
            description,
            tags: [],
            userId
        });
        (0, vector_1.createVector)(req, res);
        // res.json({
        //    message:"content created succesfully",
        //    content
        // }
    }
    catch (error) {
        res.json({
            message: "error while posting content ", error
        });
    }
}));
//query using ai
exports.router.get(`${URL}/queryai`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //    const resp=await AiPipeline();
    //    res.json({
    //       message:"queried ai model successfully",
    //       resp
    //    })
    // } catch (error) {
    //    res.status(404).json({
    //       message:"error while quering ai model",error
    //    })
    // }
}));
//get content
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
//delete content
exports.router.delete(`${URL}/content`, authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const content_id = req.body.content_id;
    console.log(req.body);
    try {
        yield schema_1.Content.deleteMany({
            _id: content_id,
            userId: req.body.userId
        });
        res.json({
            message: "deleted content"
        });
    }
    catch (error) {
        res.status(404).json({
            error
        });
    }
}));
exports.router.post(`${URL}/brain/share`, authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    if (!share) {
        res.status(400).json({ error: 'Data to share is required' });
    }
    const hash = (0, generateRandomLink_1.generateShareLink)(10);
    yield schema_1.Link.create({
        hash,
        userId: req.body.userId
    });
    res.status(201).json({
        message: 'Share link created successfully',
        hash
    });
}));
exports.router.get(`${URL}/brain/:shareLink`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield schema_1.Link.findOne({
        hash
    });
    if (!link) {
        res.status(400).json({ error: 'Share link is required' });
        return;
    }
    const content = yield schema_1.Content.find({
        userId: link.userId
    });
    const user = yield schema_1.User.findOne({
        _id: link.userId
    });
    res.status(200).json({
        username: user === null || user === void 0 ? void 0 : user.username,
        content: content,
        message: 'Shared data retrieved successfully',
    });
}));
