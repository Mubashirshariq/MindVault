"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const main_1 = require("./routes/main");
const db_1 = require("./db");
const cors_1 = __importDefault(require("cors"));
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/", main_1.router);
app.listen(4000, () => console.log("server is up and running on port 4000"));
