"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLeadsToContextProcessor = sendLeadsToContextProcessor;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function sendLeadsToContextProcessor(leads) {
    try {
        const res = await axios_1.default.post(process.env.CONTEXT_PROCESSOR_API, leads, {
            headers: {
                Authorization: `Bearer ${process.env.CONTEXT_PROCESSOR_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        console.log("Leads sent successfully:", res.data);
    }
    catch (err) {
        console.error("Error sending to context processor:", err.response || err.message);
    }
}
