"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Partner = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const partnerSchema = new mongoose_1.default.Schema({
    id: { type: String, default: uuid_1.v4, unique: true },
    alias: { type: String, required: true },
    type: { type: String, required: true },
    direction: {
        type: String,
        required: true,
        enum: ['INBOUND', 'OUTBOUND']
    },
    application: { type: String, required: true },
    processed_flow_type: {
        type: String,
        required: true,
        enum: ['MESSAGE', 'ALERTING', 'NOTIFICATION']
    },
    description: { type: String, required: true }
});
exports.Partner = mongoose_1.default.model('Partner', partnerSchema);
