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
const createVector_1 = require("../utils/createVector");
const pinecone_1 = require("@pinecone-database/pinecone");
dotenv_1.default.config();
const URL = "/api/v1";
const JwtSecret = process.env.JWT_SECRET;
const gemini_api_key = process.env.GEMINI_API_KEY;
const config = {
    apiKey: process.env.PINECONE_API_KEY || '',
};
if (!config.apiKey) {
    throw new Error('PINECONE_API_KEY is not defined in environment variables');
}
const pc = new pinecone_1.Pinecone(config);
const pcIndex = pc.index('brainly');
function AiPipeline(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryEmbedding = yield (0, createVector_1.createEmbedding)(input);
        const queryResponse = yield pcIndex.namespace("ns1").query({
            //@ts-ignore
            vector: queryEmbedding,
            topK: 5,
            includeValues: true,
            includeMetadata: true,
        });
        const contexts = queryResponse.matches.map((match) => { var _a; return (_a = match === null || match === void 0 ? void 0 : match.metadata) === null || _a === void 0 ? void 0 : _a.description; });
        console.log("contexts: ", contexts);
        const contextString = contexts.join("\n");
        const genericQueries = [
            "hi",
            "hello",
            "who is the pm of india",
        ];
        if (genericQueries.includes(input.toLowerCase())) {
            return handleGenericQuery(input);
        }
        if (!contextString || contexts.length === 0) {
            return "I'm sorry, I couldn't find relevant information for your query. Could you please clarify or provide more details?";
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(gemini_api_key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
     You are an advanced AI assistant designed to act as a second brain for the user, capable of processing and synthesizing complex information from various saved resources like YouTube links, Twitter posts, articles, and other references. Your task is to analyze the provided context and give precise, insightful, and actionable responses to the user's query.
 
     Context:
     ${contextString}
 
     User Query:
     ${input}
 
     Instructions:
     - If the user asks a generic or irrelevant question (e.g., "Hi", "Who is the PM of India"), respond with a simple, appropriate answer without trying to analyze the context.
     - Otherwise, deeply understand the context, draw connections across different data points, and provide clear, concise answers.
     - Where relevant, include references to specific sources or key details from the context.
     - If the query requires synthesis or analysis, provide a thoughtful, well-reasoned response.
 
     Answer:
   `;
        try {
            //@ts-ignore
            const result = yield model.generateContent(prompt);
            return result.response.text();
        }
        catch (error) {
            console.error("Error in AiPipeline:", error);
            throw new Error("AI Pipeline failed");
        }
    });
}
function handleGenericQuery(input) {
    const genericResponses = {
        hi: "Hello! How can I assist you today?",
        hello: "Hi there! What can I help you with?",
    };
    const lowerCaseInput = input.toLowerCase();
    if (genericResponses[lowerCaseInput]) {
        return genericResponses[lowerCaseInput];
    }
    return "I'm here to assist you! Please provide more details or ask a specific question.";
}
exports.router = express_1.default.Router();
// router.use(express.json());
//signup route
exports.router.post(`${URL}/signup`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
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
            return;
        }
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
    try {
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
            return;
        }
        const user = yield schema_1.User.findOne({ username });
        if (!user) {
            res.status(403).json({
                message: 'Login unsuccessful. User not found.',
            });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || '');
        if (!isPasswordValid) {
            res.status(403).json({
                message: 'Login unsuccessful. Incorrect password.',
            });
            return;
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
    }
    catch (error) {
        res.json({
            message: "error while posting content ", error
        });
    }
}));
//query using ai
exports.router.post(`${URL}/queryai`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { inputMessage } = req.body;
    try {
        const data = yield AiPipeline(inputMessage);
        res.json({
            message: "queried ai model successfully",
            data
        });
    }
    catch (error) {
        res.status(404).json({
            message: "error while quering ai model", error
        });
    }
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
        const ns = pcIndex.namespace('ns1');
        yield ns.deleteOne("dd6e5c6a-6819-45e7-b0f5-0464e29b4a03");
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
