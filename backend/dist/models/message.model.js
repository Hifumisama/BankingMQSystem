"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const messageSchema = new mongoose_1.default.Schema({
    id: { type: String, default: uuid_1.v4, unique: true },
    content: { type: String, required: true },
    partnerId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: {
        type: String,
        required: true,
        enum: ['PENDING', 'PROCESSED', 'ERROR'],
        default: 'PENDING'
    },
    direction: {
        type: String,
        required: true,
        enum: ['INBOUND', 'OUTBOUND']
    },
    mqMessageId: { type: String, required: false }
});
exports.Message = mongoose_1.default.model('Message', messageSchema);
