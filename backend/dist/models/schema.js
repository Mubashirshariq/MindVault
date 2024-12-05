"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = exports.Tag = exports.Content = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const contentTypes = ['youtube', 'twitter', 'documents'];
const contentSchema = new mongoose_1.default.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    description: { type: String },
    title: { type: String, required: true },
    tags: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
});
const tagSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, unique: true }
});
const linkSchema = new mongoose_1.default.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
});
exports.User = mongoose_1.default.model('User', userSchema);
exports.Content = mongoose_1.default.model('Content', contentSchema);
exports.Tag = mongoose_1.default.model('Tag', tagSchema);
exports.Link = mongoose_1.default.model('Link', linkSchema);
