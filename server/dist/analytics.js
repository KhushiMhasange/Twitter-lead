"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.get('/analytics', async (req, res) => {
    const topic = req.query.topic;
    if (!topic)
        return res.status(400).json({ error: 'Missing topic query param' });
    try {
        const alchemystRes = await axios_1.default.post(process.env.CONTEXT_PROCESSOR_API_SEARCH, {
            "query": "lead data",
            "similarity_threshold": 0.8,
            "minimum_similarity_threshold": 0.5,
            "scope": "internal",
            "metadata": { fileName: `fetching data on topic ${topic}`,
                fileType: 'string',
                fileSize: 1024,
                lastModified: 'June 24, 2025', }
        }, {
            headers: {
                Authorization: `Bearer ${process.env.CONTEXT_PROCESSOR_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        console.log("Res from alchemyst", alchemystRes);
        const counts = {};
        for (const item of alchemystRes.data.results) {
            const content = item.contextData.toLowerCase();
            if (content.includes(topic.toLowerCase())) {
                counts[topic] = (counts[topic] || 0) + 1;
            }
            else {
                counts["Others"] = (counts["Others"] || 0) + 1;
            }
        }
        // Format for chart usage
        const chartData = Object.entries(counts).map(([label, value]) => ({
            name: label,
            value,
        }));
        res.json(chartData);
    }
    catch (err) {
        console.error('Analytics fetch failed:', err);
        res.status(500).json({ error: 'Failed to retrieve analytics' });
    }
});
exports.default = router;
